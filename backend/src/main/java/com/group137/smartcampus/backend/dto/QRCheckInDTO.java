package com.group137.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for QR code check-in requests.
 */
public class QRCheckInDTO {

    @NotBlank(message = "QR token is required")
    private String qrToken;

    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
}
