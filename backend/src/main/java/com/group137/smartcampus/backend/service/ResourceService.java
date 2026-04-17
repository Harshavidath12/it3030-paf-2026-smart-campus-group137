package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.entity.resource.Resource;
import com.group137.smartcampus.backend.entity.resource.ResourceStatus;
import com.group137.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> search(String type, String building, String floor, ResourceStatus status, Integer minCapacity) {
        return resourceRepository.searchResources(type, building, floor, status, minCapacity);
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedData) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    resource.setName(updatedData.getName());
                    resource.setType(updatedData.getType());
                    resource.setCategory(updatedData.getCategory());
                    resource.setCapacity(updatedData.getCapacity());
                    resource.setBuilding(updatedData.getBuilding());
                    resource.setFloor(updatedData.getFloor());
                    resource.setRoomNumber(updatedData.getRoomNumber());
                    resource.setStatus(updatedData.getStatus());
                    resource.setDescription(updatedData.getDescription());
                    resource.setMetadata(updatedData.getMetadata());
                    return resourceRepository.save(resource);
                }).orElseThrow(() -> new RuntimeException("Resource not found with id " + id));
    }

    public Resource toggleStatus(Long id, ResourceStatus status) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    resource.setStatus(status);
                    return resourceRepository.save(resource);
                }).orElseThrow(() -> new RuntimeException("Resource not found with id " + id));
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
