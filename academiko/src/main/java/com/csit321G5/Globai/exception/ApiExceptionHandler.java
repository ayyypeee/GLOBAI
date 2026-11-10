package com.csit321G5.Globai.exception;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleLinkedRecord() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "This record is linked to other records, so the action cannot be completed."));
    }
}