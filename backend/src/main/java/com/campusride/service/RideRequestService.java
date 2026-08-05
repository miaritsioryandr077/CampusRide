package com.campusride.service;

import com.campusride.dto.RideRequestDto;
import com.campusride.entity.Ride;
import com.campusride.entity.RideRequest;
import com.campusride.entity.User;
import com.campusride.entity.enums.RideRequestStatus;
import com.campusride.repository.RideRepository;
import com.campusride.repository.RideRequestRepository;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideRequestService {

    private final RideRequestRepository requestRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideRequestDto requestRide(Long rideId, String passengerEmail) {
        User passenger = userRepository.findByEmail(passengerEmail).orElseThrow();
        Ride ride = rideRepository.findById(rideId).orElseThrow();
        
        var existingRequest = requestRepository.findByRideIdAndPassengerId(rideId, passenger.getId());
        if(existingRequest.isPresent()) {
            throw new RuntimeException("Ride already requested");
        }

        RideRequest request = RideRequest.builder()
                .ride(ride)
                .passenger(passenger)
                .status(RideRequestStatus.PENDING)
                .build();
        
        return mapToDto(requestRepository.save(request));
    }

    public RideRequestDto updateRequestStatus(Long requestId, RideRequestStatus status, String driverEmail) {
        RideRequest request = requestRepository.findById(requestId).orElseThrow();
        User driver = userRepository.findByEmail(driverEmail).orElseThrow();
        
        if (!request.getRide().getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Only driver can update the request status");
        }

        request.setStatus(status);
        
        if(status == RideRequestStatus.ACCEPTED) {
            Ride ride = request.getRide();
            if(ride.getAvailableSeats() > 0){
                ride.setAvailableSeats(ride.getAvailableSeats() - 1);
                rideRepository.save(ride);
            } else {
                throw new RuntimeException("No available seats left");
            }
        }
        
        return mapToDto(requestRepository.save(request));
    }

    public List<RideRequestDto> getRequestsForRide(Long rideId) {
        return requestRepository.findByRideId(rideId).stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public List<RideRequestDto> getRequestsByPassenger(Long passengerId) {
        return requestRepository.findByPassengerId(passengerId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private RideRequestDto mapToDto(RideRequest request) {
        return RideRequestDto.builder()
                .id(request.getId())
                .rideId(request.getRide().getId())
                .passengerId(request.getPassenger().getId())
                .passengerName(request.getPassenger().getFirstName() + " " + request.getPassenger().getLastName())
                .status(request.getStatus())
                .requestedAt(request.getRequestedAt())
                .build();
    }
}
