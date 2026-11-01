package com.academiko.academiko;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    record LoginRequest(String username, String password) {}
    record UserInfo(String username, String role, String name, String email) {}

    // Temporary hard-coded accounts. Replace with the User table (hashed passwords) later.
    private static final Map<String, UserInfo> USERS = Map.of(
        "student", new UserInfo("student", "STUDENT", "Student", "student@school.edu"),
        "teacher", new UserInfo("teacher", "TEACHER", "Teacher", "teacher@school.edu")
    );
    private static final String PASSWORD = "12345";

    @PostMapping("/login")
    public ResponseEntity<UserInfo> login(@RequestBody LoginRequest req) {
        UserInfo user = req.username() == null ? null : USERS.get(req.username().trim().toLowerCase());
        if (user == null || !PASSWORD.equals(req.password())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(user);
    }
}