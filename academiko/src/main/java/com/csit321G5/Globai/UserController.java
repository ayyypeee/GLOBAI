package com.csit321G5.Globai;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Used by the Admin dashboard: list accounts, approve or reject requests, remove accounts
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponse> list() {
        return service.findAll().stream().map(UserResponse::from).toList();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(UserResponse.from(service.approve(id)));
        } catch (IllegalStateException | NoSuchElementException e) {
            return error(e);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(UserResponse.from(service.reject(id)));
        } catch (IllegalStateException | NoSuchElementException e) {
            return error(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("User deleted.");
        } catch (IllegalStateException | NoSuchElementException e) {
            return error(e);
        }
    }

    // Plain-text error messages, so the React page can show them directly
    private ResponseEntity<String> error(RuntimeException e) {
        if (e instanceof NoSuchElementException) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
        return ResponseEntity.status(409).body(e.getMessage());
    }
}
