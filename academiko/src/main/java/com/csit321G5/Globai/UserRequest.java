package com.csit321G5.Globai;

// What a student or staff member sends when asking the admin for an account
public record UserRequest(String name, String email, String password,
                          String role, String studentId) {}
