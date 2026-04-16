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





        Resource r9 = Resource.builder()
                .name("Computer Lab A301")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(30)
                .building("New Building")
                .floor("Level 3")
                .roomNumber("A301")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r10 = Resource.builder()
                .name("Computer Lab A401")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(40)
                .building("New Building")
                .floor("Level 4")
                .roomNumber("A401")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r11 = Resource.builder()
                .name("Computer Lab A506")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(50)
                .building("New Building")
                .floor("Level 5")
                .roomNumber("A506")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r12 = Resource.builder()
                .name("Computer Lab F305")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(30)
                .building("New Building")
                .floor("Level 3")
                .roomNumber("F305")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r13 = Resource.builder()
                .name("Computer Lab B405")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(60)
                .building("New Building")
                .floor("Level 4")
                .roomNumber("B405")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r14 = Resource.builder()
                .name("Computer Lab G601")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(40)
                .building("New Building")
                .floor("Level 6")
                .roomNumber("G601")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r15 = Resource.builder()
                .name("Computer Lab G604")
                .type("Computer Lab")
                .category(ResourceCategory.FACILITY)
                .capacity(60)
                .building("New Building")
                .floor("Level 6")
                .roomNumber("G604")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r16 = Resource.builder()
                .name("Main Library")
                .type("Library")
                .category(ResourceCategory.FACILITY)
                .capacity(300)
                .building("New Building")
                .floor("Level 1")
                .roomNumber("L101")
                .status(ResourceStatus.ACTIVE)
                .description("Main campus library with extensive study areas.")
                .build();

        Resource r17 = Resource.builder()
                .name("Meeting Room 1")
                .type("Meeting Room")
                .category(ResourceCategory.FACILITY)
                .capacity(12)
                .building("Main Building")
                .floor("Level 7")
                .roomNumber("Room 701")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r18 = Resource.builder()
                .name("Meeting Room 2")
                .type("Meeting Room")
                .category(ResourceCategory.FACILITY)
                .capacity(12)
                .building("Main Building")
                .floor("Level 7")
                .roomNumber("Room 702")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r19 = Resource.builder()
                .name("Projector Room A406")
                .type("Projector Room")
                .category(ResourceCategory.FACILITY)
                .capacity(20)
                .building("Main Building")
                .floor("Level 4")
                .roomNumber("A406")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r20 = Resource.builder()
                .name("Projector Room A407")
                .type("Projector Room")
                .category(ResourceCategory.FACILITY)
                .capacity(20)
                .building("Main Building")
                .floor("Level 4")
                .roomNumber("A407")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r21 = Resource.builder()
                .name("Lecture Hall B502")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(80)
                .building("Main Building")
                .floor("Level 5")
                .roomNumber("B502")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r22 = Resource.builder()
                .name("Lecture Hall B503")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(80)
                .building("Main Building")
                .floor("Level 5")
                .roomNumber("B503")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r23 = Resource.builder()
                .name("Lecture Hall E401")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(60)
                .building("Main Building")
                .floor("Level 4")
                .roomNumber("E401")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r24 = Resource.builder()
                .name("Lecture Hall E304")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(60)
                .building("Main Building")
                .floor("Level 3")
                .roomNumber("E304")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r25 = Resource.builder()
                .name("Lecture Hall A303")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(100)
                .building("Main Building")
                .floor("Level 3")
                .roomNumber("A303")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r26 = Resource.builder()
                .name("Lecture Hall A305")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(100)
                .building("Main Building")
                .floor("Level 3")
                .roomNumber("A305")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r27 = Resource.builder()
                .name("Lecture Hall A404")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(120)
                .building("Main Building")
                .floor("Level 4")
                .roomNumber("A404")
                .status(ResourceStatus.ACTIVE)
                .build();

        Resource r28 = Resource.builder()
                .name("Lecture Hall A504")
                .type("Lecture Hall")
                .category(ResourceCategory.FACILITY)
                .capacity(120)
                .building("Main Building")
                .floor("Level 5")
                .roomNumber("A504")
                .status(ResourceStatus.ACTIVE)
                .build();

        resourceRepository.saveAll(Arrays.asList(
                r1, r2, r9, r10, r11, r12, r13, r14, r15, r16,
                r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28
        ));
        System.out.println("✅ Member 1: Database Updated with Suggested Campus Data.");
    }
}
