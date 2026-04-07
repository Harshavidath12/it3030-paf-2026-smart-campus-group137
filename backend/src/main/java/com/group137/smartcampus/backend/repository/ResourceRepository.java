package com.group137.smartcampus.backend.repository;

import com.group137.smartcampus.backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

    List<Resource> findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(String type, String location);
    List<Resource> findByTypeContainingIgnoreCase(String type);
    List<Resource> findByLocationContainingIgnoreCase(String location);
}
