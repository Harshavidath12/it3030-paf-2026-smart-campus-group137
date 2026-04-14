package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.TicketPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank(message = "Resource name is required")
    private String resourceName;

    @NotBlank(message = "Description is required")
    private String description;

    private TicketPriority priority;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be exactly 10 digits")
    private String contactNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String imageBase64;
}
