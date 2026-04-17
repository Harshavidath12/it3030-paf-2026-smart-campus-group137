package com.group137.smartcampus.backend.model;

/**
 * Enum representing all possible booking states in the workflow.
 * PENDING -> APPROVED/REJECTED -> CANCELLED -> CHECKED_IN
 */
public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED,
    CHECKED_IN
}
