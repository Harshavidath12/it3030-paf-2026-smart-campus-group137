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
        // Use deleteAllInBatch() to efficiently clear the table.
        // If you see "column building does not exist", it means Hibernate's 'update'
        // failed to sync your DB schema. We'll use a batch delete to clear it first.
        resourceRepository.deleteAllInBatch();

        Resource r1 = Resource.builder()
                .name("Grand Auditorium")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(250)
                .building("Main Building")
                .floor("Level 1")
                .roomNumber("Room 101")
                .status(ResourceStatus.ACTIVE)
                .description("Main campus auditorium for large events.")
                .build();

        Resource r2 = Resource.builder()
                .name("MAC Lab A")
                .type("Laboratory")
                .category(ResourceCategory.FACILITY)
                .capacity(45)
                .building("Main Building")
                .floor("4th Floor")
                .roomNumber("Lab 401")
                .status(ResourceStatus.ACTIVE)
                .description("Advanced computing lab with high-end workstations.")
                .build();

        Resource r3 = Resource.builder()
                .name("Sony Laser Projector")
                .type("Projector")
                .category(ResourceCategory.ASSET)
                .capacity(0)
                .building("Main Building")
                .floor("Ground Floor")
                .roomNumber("Unit B")
                .status(ResourceStatus.ACTIVE)
                .description("Portable 4K laser projector.")
                .build();

        Resource r4 = Resource.builder()
                .name("Room E204")
                .type("Tutorial Room")
                .category(ResourceCategory.FACILITY)
                .capacity(30)
                .building("New Building")
                .floor("Level 2")
                .roomNumber("Room 204")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r5 = Resource.builder()
                .name("Board Room 01")
                .type("Meeting Room")
                .category(ResourceCategory.FACILITY)
                .capacity(8)
                .building("New Building")
                .floor("3rd Floor")
                .roomNumber("Room 305")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r6 = Resource.builder()
                .name("Science Lecture Theatre")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(180)
                .building("Main Building")
                .floor("Level 2")
                .roomNumber("Room 210")
                .status(ResourceStatus.ACTIVE)
                .description("Modern tiered lecture theatre with dual projection.")
                .build();

        Resource r7 = Resource.builder()
                .name("South Wing Hall")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(120)
                .building("Main Building")
                .floor("Main Floor")
                .roomNumber("Hall 1")
                .status(ResourceStatus.ACTIVE)
                .description("Standard acoustics and whiteboard setups.")
                .build();

        Resource r8 = Resource.builder()
                .name("Mini Lecture Hall B")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(60)
                .building("New Building")
                .floor("Basement")
                .roomNumber("Room B10")
                .status(ResourceStatus.ACTIVE)
                .description("Intimate lecture hall for small student groups.")
                .build();

        resourceRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6, r7, r8));
        System.out.println("✅ Member 1: Database Updated with Suggested Campus Data.");
    }
}
