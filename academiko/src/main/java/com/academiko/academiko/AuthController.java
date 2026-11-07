package com.academiko.academiko;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    record LoginRequest(String username, String password) {}
    record RegisterRequest(String username, String password, String name,
                           String email, String role, String studentId) {}
    record UserInfo(String username, String role, String name, String email, String studentId) {}
    // An account = the public info + the password (the password is never sent back)
    record Account(UserInfo info, String password) {}

    // A mutable map, so new accounts can be added while the server runs
    private static final Map<String, Account> ACCOUNTS = new ConcurrentHashMap<>();

    static {
        ACCOUNTS.put("student", new Account(
            new UserInfo("student", "STUDENT", "Student", "student@school.edu", "2000000"), "12345"));
        ACCOUNTS.put("teacher", new Account(
            new UserInfo("teacher", "TEACHER", "Teacher", "teacher@school.edu", null), "12345"));
    }

    @PostMapping("/login")
    public ResponseEntity<UserInfo> login(@RequestBody LoginRequest req) {
        Account account = req.username() == null ? null : ACCOUNTS.get(req.username().trim().toLowerCase());
        if (account == null || !account.password().equals(req.password())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(account.info());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (isBlank(req.username()) || isBlank(req.password()) || isBlank(req.name())
                || isBlank(req.email()) || isBlank(req.role())) {
            return ResponseEntity.badRequest().body("Please fill in all required fields.");
        }

        String role = req.role().trim().toUpperCase();
        if (!role.equals("STUDENT") && !role.equals("TEACHER")) {
            return ResponseEntity.badRequest().body("Role must be Student or Teacher.");
        }
        if (role.equals("STUDENT") && isBlank(req.studentId())) {
            return ResponseEntity.badRequest().body("Student ID is required for students.");
        }
        if (req.password().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters.");
        }

        String username = req.username().trim().toLowerCase();
        UserInfo info = new UserInfo(
            username, role, req.name().trim(), req.email().trim(),
            role.equals("STUDENT") ? req.studentId().trim() : null);

        // putIfAbsent returns null if the username was free, or the existing account if taken
        if (ACCOUNTS.putIfAbsent(username, new Account(info, req.password())) != null) {
            return ResponseEntity.status(409).body("That username is already taken.");
        }
        return ResponseEntity.status(201).body(info);
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}