package com.group137.smartcampus.backend.repository;

import com.group137.smartcampus.backend.entity.resource.Resource;
import com.group137.smartcampus.backend.entity.resource.ResourceCategory;
import com.group137.smartcampus.backend.entity.resource.ResourceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByCategory(ResourceCategory category);

    List<Resource> findByStatus(ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR LOWER(r.type) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
           "(:building IS NULL OR LOWER(r.building) LIKE LOWER(CONCAT('%', :building, '%'))) AND " +
           "(:floor IS NULL OR LOWER(r.floor) LIKE LOWER(CONCAT('%', :floor, '%'))) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity)")
    List<Resource> searchResources(@Param("type") String type,
                                   @Param("building") String building,
                                   @Param("floor") String floor,
                                   @Param("status") ResourceStatus status,
                                   @Param("minCapacity") Integer minCapacity);
}
