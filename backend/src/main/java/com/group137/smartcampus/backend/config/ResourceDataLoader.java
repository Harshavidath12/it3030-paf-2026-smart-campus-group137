package com.group137.smartcampus.backend.config;

import com.group137.smartcampus.backend.entity.resource.Resource;
import com.group137.smartcampus.backend.entity.resource.ResourceCategory;
import com.group137.smartcampus.backend.entity.resource.ResourceStatus;
import com.group137.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class ResourceDataLoader implements CommandLineRunner {

    private final ResourceRepository resourceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data so we can see the new suggestions
        resourceRepository.deleteAll();

        Resource r1 = Resource.builder()
                .name("Grand Auditorium")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(250)
                .location("Block A - Level 1")
                .status(ResourceStatus.ACTIVE)
                .description("Main campus auditorium for large events.")
                .build();

        Resource r2 = Resource.builder()
                .name("MAC Lab A")
                .type("Laboratory")
                .category(ResourceCategory.FACILITY)
                .capacity(45)
                .location("IT Block - 4th Floor")
                .status(ResourceStatus.ACTIVE)
                .description("Advanced computing lab with high-end workstations.")
                .build();

        Resource r3 = Resource.builder()
                .name("Sony Laser Projector")
                .type("Projector")
                .category(ResourceCategory.ASSET)
                .capacity(0)
                .location("Equipment Library")
                .status(ResourceStatus.ACTIVE)
                .description("Portable 4K laser projector.")
                .build();

        Resource r4 = Resource.builder()
                .name("Room E204")
                .type("Tutorial Room")
                .category(ResourceCategory.FACILITY)
                .capacity(30)
                .location("Engineering Block")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r5 = Resource.builder()
                .name("Board Room 01")
                .type("Meeting Room")
                .category(ResourceCategory.FACILITY)
                .capacity(8)
                .location("Business School")
                .status(ResourceStatus.ACTIVE)
                .build();

        resourceRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5));
        System.out.println("✅ Member 1: Database Updated with Suggested Campus Data.");
    }
}
