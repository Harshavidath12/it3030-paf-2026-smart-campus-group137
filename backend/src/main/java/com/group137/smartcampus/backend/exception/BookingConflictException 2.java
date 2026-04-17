package com.group137.smartcampus.backend.exception;

/**
 * Thrown when a booking conflicts with an existing booking for the same resource/time.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}
