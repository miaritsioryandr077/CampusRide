package com.campusride.dto;

import com.campusride.entity.enums.RideRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RideRequestDto {
    private Long id;
    private Long rideId;
    private Long passengerId;
    private String passengerName;
    private RideRequestStatus status;
    private LocalDateTime requestedAt;
}
