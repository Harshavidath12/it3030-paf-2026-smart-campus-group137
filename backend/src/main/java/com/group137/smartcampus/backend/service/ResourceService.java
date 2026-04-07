package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.ResourceRequest;
import com.group137.smartcampus.backend.dto.ResourceResponse;
import com.group137.smartcampus.backend.entity.Resource;
import com.group137.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<ResourceResponse> getAllResources(String type, String location, Integer minCapacity) {
        List<Resource> resources;
        
        if (type != null && location != null) {
            resources = resourceRepository.findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(type, location);
        } else if (type != null) {
            resources = resourceRepository.findByTypeContainingIgnoreCase(type);
        } else if (location != null) {
            resources = resourceRepository.findByLocationContainingIgnoreCase(location);
        } else {
            resources = resourceRepository.findAll();
        }
        
        return resources.stream()
                .filter(res -> minCapacity == null || (res.getCapacity() != null && res.getCapacity() >= minCapacity))
                .map(ResourceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ResourceResponse getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return ResourceResponse.fromEntity(resource);
    }

    public ResourceResponse createResource(ResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .availabilityWindow(request.getAvailabilityWindow())
                .status(request.getStatus())
                .build();
                
        Resource savedResource = resourceRepository.save(resource);
        return ResourceResponse.fromEntity(savedResource);
    }

    public ResourceResponse updateResource(Long id, ResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
                
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailabilityWindow(request.getAvailabilityWindow());
        resource.setStatus(request.getStatus());
        
        Resource updatedResource = resourceRepository.save(resource);
        return ResourceResponse.fromEntity(updatedResource);
    }

    public ResourceResponse patchResourceStatus(Long id, String status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
                
        if (status != null && !status.isEmpty()) {
            resource.setStatus(status);
        }
        
        Resource updatedResource = resourceRepository.save(resource);
        return ResourceResponse.fromEntity(updatedResource);
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}
