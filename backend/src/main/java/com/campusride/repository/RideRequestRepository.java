package com.campusride.repository;

import com.campusride.entity.RideRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {
    List<RideRequest> findByRideId(Long rideId);
    List<RideRequest> findByPassengerId(Long passengerId);
    Optional<RideRequest> findByRideIdAndPassengerId(Long rideId, Long passengerId);
}
