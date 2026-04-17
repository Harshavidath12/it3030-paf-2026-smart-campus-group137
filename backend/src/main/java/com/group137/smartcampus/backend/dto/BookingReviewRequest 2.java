package com.group137.smartcampus.backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 * NEW FILE: DTO for admin booking review (approve/reject).
 */
public class BookingReviewRequest {
    
    @NotNull(message = "Review decision (approved) is required")
    private Boolean approved;
    
    private String remarks;

    // Getters and Setters
    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
