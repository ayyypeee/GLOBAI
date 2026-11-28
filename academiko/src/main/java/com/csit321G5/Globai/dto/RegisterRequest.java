package com.csit321G5.Globai.dto;

public record RegisterRequest(
        String username,
        String password,
        String role,
        String fullname,
        String email,
        String program,
        Integer yearlevel,
        String department) {
}