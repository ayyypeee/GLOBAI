package com.csit321G5.Globai;

// What the server sends back. It never includes the password.
public record UserResponse(Long id, String name, String email, String role,
                           String status, String studentId, String createdAt) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(),
                                u.getStatus(), u.getStudentId(),
                                u.getCreatedAt() == null ? null : u.getCreatedAt().toString());
    }
}
