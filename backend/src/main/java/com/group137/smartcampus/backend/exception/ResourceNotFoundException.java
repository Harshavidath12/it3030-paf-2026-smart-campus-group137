package com.group137.smartcampus.backend.exception;

/**
 * Thrown when a requested resource (booking, etc.) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
