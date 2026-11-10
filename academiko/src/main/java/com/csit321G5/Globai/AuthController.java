package com.csit321G5.Globai;

import java.time.Instant;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
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
    record ForgotRequest(String email) {}
    record ResetRequest(String token, String newPassword) {}
    record ResetToken(Long userId, Instant expiresAt) {}

    // token -> which user it belongs to and when it expires (in memory)
    private static final Map<String, ResetToken> RESET_TOKENS = new ConcurrentHashMap<>();

    private static final String FRONTEND_URL = "http://localhost:5173";

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> found = service.authenticate(req.username(), req.password());
        if (found.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        // The password is correct, now check that the admin approved the account
        User user = found.get();
        if (User.PENDING.equals(user.getStatus())) {
            return ResponseEntity.status(403).body("Your account is still waiting for admin approval.");
        }
        if (User.REJECTED.equals(user.getStatus())) {
            return ResponseEntity.status(403).body("Your account request was rejected. Please contact the admin.");
        }
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // A student or staff member asks the admin for an account (saved as PENDING)
    @PostMapping("/request-account")
    public ResponseEntity<?> requestAccount(@RequestBody UserRequest req) {
        try {
            return ResponseEntity.status(201).body(UserResponse.from(service.requestAccount(req)));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        service.findByEmail(req.email()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            RESET_TOKENS.put(token, new ResetToken(user.getId(), Instant.now().plusSeconds(30 * 60)));
            sendResetLink(user.getEmail(), FRONTEND_URL + "/?reset=" + token);
        });

        // Same answer whether or not the email exists
        return ResponseEntity.ok("If an account exists for that email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetRequest req) {
        if (req.token() == null || req.token().isBlank() || req.newPassword() == null) {
            return ResponseEntity.badRequest().body("Token and new password are required.");
        }

        ResetToken resetToken = RESET_TOKENS.get(req.token());
        if (resetToken == null || resetToken.expiresAt().isBefore(Instant.now())) {
            RESET_TOKENS.remove(req.token());
            return ResponseEntity.badRequest().body("This reset link is invalid or has expired.");
        }

        try {
            service.changePassword(resetToken.userId(), req.newPassword());
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("This reset link is invalid or has expired.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        RESET_TOKENS.remove(req.token());   // one-time use
        return ResponseEntity.ok("Password updated.");
    }

    // For now the link is printed in the backend terminal. Real email comes later.
    private void sendResetLink(String email, String link) {
        System.out.println("PASSWORD RESET LINK for " + email + ": " + link);
    }
}