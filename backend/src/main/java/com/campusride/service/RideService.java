package com.campusride.service;

import com.campusride.dto.RideDto;
import com.campusride.entity.Ride;
import com.campusride.entity.User;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideDto createRide(RideDto rideDto, String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail).orElseThrow();
        Ride ride = Ride.builder()
                .driver(driver)
                .origin(rideDto.getOrigin())
                .destination(rideDto.getDestination())
                .departureTime(rideDto.getDepartureTime())
                .availableSeats(rideDto.getAvailableSeats())
                .price(rideDto.getPrice())
                .isCompleted(false)
                .build();
        Ride savedRide = rideRepository.save(ride);
        return mapToDto(savedRide);
    }

    public List<RideDto> searchRides(String origin, String destination, LocalDateTime after) {
        if (origin == null) origin = "";
        if (destination == null) destination = "";
        if (after == null) after = LocalDateTime.now();

        return rideRepository.findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndDepartureTimeAfter(
                origin, destination, after).stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public List<RideDto> getRidesByDriver(Long driverId) {
        return rideRepository.findByDriverId(driverId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public RideDto getRideById(Long id) {
        return rideRepository.findById(id).map(this::mapToDto).orElseThrow();
    }

    private RideDto mapToDto(Ride ride) {
        return RideDto.builder()
                .id(ride.getId())
                .driverId(ride.getDriver().getId())
                .driverName(ride.getDriver().getFirstName() + " " + ride.getDriver().getLastName())
                .origin(ride.getOrigin())
                .destination(ride.getDestination())
                .departureTime(ride.getDepartureTime())
                .availableSeats(ride.getAvailableSeats())
                .price(ride.getPrice())
                .isCompleted(ride.getIsCompleted())
                .build();
    }
}
