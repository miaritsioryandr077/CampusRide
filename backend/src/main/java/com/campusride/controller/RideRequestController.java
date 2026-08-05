package com.campusride.controller;

import com.campusride.dto.RideRequestDto;
import com.campusride.entity.enums.RideRequestStatus;
import com.campusride.service.RideRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService requestService;

    @PostMapping("/ride/{rideId}")
    public ResponseEntity<RideRequestDto> requestRide(@PathVariable Long rideId, Authentication authentication) {
        String passengerEmail = authentication.getName();
        return ResponseEntity.ok(requestService.requestRide(rideId, passengerEmail));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<RideRequestDto> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam RideRequestStatus status,
            Authentication authentication
    ) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(requestService.updateRequestStatus(requestId, status, driverEmail));
    }

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<List<RideRequestDto>> getRequestsForRide(@PathVariable Long rideId) {
        return ResponseEntity.ok(requestService.getRequestsForRide(rideId));
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<RideRequestDto>> getRequestsByPassenger(@PathVariable Long passengerId) {
        return ResponseEntity.ok(requestService.getRequestsByPassenger(passengerId));
    }
}
