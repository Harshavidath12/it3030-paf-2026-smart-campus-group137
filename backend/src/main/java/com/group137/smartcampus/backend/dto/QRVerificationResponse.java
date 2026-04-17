package com.group137.smartcampus.backend.dto;

/**
 * DTO for QR code verification response.
 */
public class QRVerificationResponse {
    private boolean valid;
    private String message;
    private BookingResponseDTO booking;

    public QRVerificationResponse(boolean valid, String message, BookingResponseDTO booking) {
        this.valid = valid;
        this.message = message;
        this.booking = booking;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BookingResponseDTO getBooking() { return booking; }
    public void setBooking(BookingResponseDTO booking) { this.booking = booking; }
}
