package com.academiko.academiko;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByStudentId(String studentId);

    boolean existsByUsername(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByStudentId(String studentId);
}