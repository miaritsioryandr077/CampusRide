package com.campusride.controller;

import com.campusride.dto.RideDto;
import com.campusride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rides")
@RequiredArgsConstructor
public class RideController {
    
    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideDto> createRide(@RequestBody RideDto rideDto, Authentication authentication) {
        String driverEmail = authentication.getName();
        return ResponseEntity.ok(rideService.createRide(rideDto, driverEmail));
    }

    @GetMapping
    public ResponseEntity<List<RideDto>> searchRides(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime after
    ) {
        return ResponseEntity.ok(rideService.searchRides(origin, destination, after));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RideDto> getRideById(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRideById(id));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RideDto>> getRidesByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(rideService.getRidesByDriver(driverId));
    }
}
