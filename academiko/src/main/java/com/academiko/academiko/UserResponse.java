package com.academiko.academiko;

// What the server sends back. It never includes the password.
public record UserResponse(Long id, String username, String name,
                           String email, String role, String studentId) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getName(),
                                u.getEmail(), u.getRole(), u.getStudentId());
    }
}