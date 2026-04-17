package com.group137.smartcampus.backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for admin approval or rejection of a booking.
 */
public class BookingApprovalDTO {

    @NotNull(message = "Approval decision (isApproved) is required")
    private Boolean isApproved;

    private String adminRemarks;

    private String rejectionReason;

    // Getters and Setters
    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
