package com.campusride.config;

import com.campusride.entity.Ride;
import com.campusride.entity.User;
import com.campusride.entity.enums.Role;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User driver = User.builder()
                    .firstName("Alex")
                    .lastName("Dubois")
                    .email("alex@campus.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ROLE_STUDENT)
                    .build();

            User student2 = User.builder()
                    .firstName("Sarah")
                    .lastName("Martin")
                    .email("sarah@campus.edu")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.ROLE_STUDENT)
                    .build();

            userRepository.save(driver);
            userRepository.save(student2);

            Ride ride1 = Ride.builder()
                    .driver(driver)
                    .origin("Bibliothèque Universitaire")
                    .destination("Gare Centrale")
                    .departureTime(LocalDateTime.now().plusHours(2))
                    .availableSeats(3)
                    .price(4.50)
                    .isCompleted(false)
                    .build();

            Ride ride2 = Ride.builder()
                    .driver(driver)
                    .origin("Résidence Universitaire A")
                    .destination("Campus Centre-Ville")
                    .departureTime(LocalDateTime.now().plusHours(5))
                    .availableSeats(2)
                    .price(2.00)
                    .isCompleted(false)
                    .build();

            Ride ride3 = Ride.builder()
                    .driver(student2)
                    .origin("Campus Tech")
                    .destination("Aéroport")
                    .departureTime(LocalDateTime.now().plusDays(1))
                    .availableSeats(4)
                    .price(12.00)
                    .isCompleted(false)
                    .build();

            rideRepository.save(ride1);
            rideRepository.save(ride2);
            rideRepository.save(ride3);
        }
    }
}
