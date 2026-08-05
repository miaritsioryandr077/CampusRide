package com.campusride.repository;

import com.campusride.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRideIdOrderByTimestampAsc(Long rideId);
}
