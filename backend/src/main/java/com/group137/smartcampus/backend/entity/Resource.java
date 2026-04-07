package com.group137.smartcampus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g. LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT

    private Integer capacity;

    private String location;

    @Column(name = "availability_window")
    private String availabilityWindow; // e.g. "08:00-18:00"

    @Column(nullable = false)
    private String status; // e.g. ACTIVE, OUT_OF_SERVICE
}
