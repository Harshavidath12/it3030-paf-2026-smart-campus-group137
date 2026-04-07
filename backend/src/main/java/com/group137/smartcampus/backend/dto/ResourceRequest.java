package com.group137.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourceRequest {

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Type is mandatory")
    private String type;

    private Integer capacity;
    
    private String location;
    
    private String availabilityWindow;
    
    @NotBlank(message = "Status is mandatory")
    private String status;
}
