package com.academiko.academiko;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // READ all
    @GetMapping
    public List<UserResponse> list() {
        return service.findAll().stream().map(UserResponse::from).toList();
    }

    // READ one
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(UserResponse.from(service.getById(id)));
        } catch (NoSuchElementException e) {
            return error(e);
        }
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserRequest req) {
        try {
            return ResponseEntity.status(201).body(UserResponse.from(service.create(req)));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return error(e);
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserRequest req) {
        try {
            return ResponseEntity.ok(UserResponse.from(service.update(id, req)));
        } catch (IllegalArgumentException | IllegalStateException | NoSuchElementException e) {
            return error(e);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("User deleted.");
        } catch (IllegalStateException | NoSuchElementException e) {
            return error(e);
        }
    }

    // Plain-text error messages, so the React form can show them directly
    private ResponseEntity<String> error(RuntimeException e) {
        if (e instanceof NoSuchElementException) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
        if (e instanceof IllegalStateException) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}