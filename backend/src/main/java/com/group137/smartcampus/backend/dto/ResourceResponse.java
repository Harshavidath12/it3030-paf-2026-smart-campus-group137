package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourceResponse {

    private Long id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String availabilityWindow;
    private String status;

    public static ResourceResponse fromEntity(Resource resource) {
        if (resource == null) return null;
        
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindow(resource.getAvailabilityWindow())
                .status(resource.getStatus())
                .build();
    }
}
