package com.campusride.repository;

import com.campusride.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndDepartureTimeAfter(
            String origin, String destination, LocalDateTime localDateTime
    );
    List<Ride> findByDriverId(Long driverId);
}
