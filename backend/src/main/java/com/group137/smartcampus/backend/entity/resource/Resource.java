package com.group137.smartcampus.backend.entity.resource;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Resource type is required")
    @Column(nullable = false)
    private String type; // e.g., "Lecture Hall", "Lab", "Projector"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceCategory category; // FACILITY or ASSET

    @Min(value = 0, message = "Capacity cannot be negative")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status; // ACTIVE or OUT_OF_SERVICE

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String metadata; // For storing technical specs or extra info as JSON string if needed
}
