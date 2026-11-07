package com.academiko.academiko;

// What the client sends when creating or updating a user
public record UserRequest(String username, String password, String name,
                          String email, String role, String studentId) {}