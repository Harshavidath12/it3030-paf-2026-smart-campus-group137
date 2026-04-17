package com.group137.smartcampus.backend.repository;

import com.group137.smartcampus.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
}
