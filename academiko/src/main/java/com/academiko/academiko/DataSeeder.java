package com.academiko.academiko;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    // Runs once every time the backend starts
    @Bean
    CommandLineRunner seedAdmin(UserService userService) {
        return args -> userService.ensureAdmin();
    }
}