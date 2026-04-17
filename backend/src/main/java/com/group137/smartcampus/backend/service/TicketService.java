package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.dto.TicketRequest;
import com.group137.smartcampus.backend.dto.TicketResponse;
import com.group137.smartcampus.backend.dto.TicketUpdateRequest;
import com.group137.smartcampus.backend.entity.NotificationType;
import com.group137.smartcampus.backend.entity.Ticket;
import com.group137.smartcampus.backend.entity.TicketStatus;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.TicketRepository;
import com.group137.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketResponse createTicket(TicketRequest request) {
        User currentUser = getCurrentUser();

        Ticket ticket = Ticket.builder()
                .resourceName(request.getResourceName())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .status(TicketStatus.OPEN)
                .imagesBase64(request.getImagesBase64())
                .creatorId(currentUser.getId())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);
        
        return mapToResponse(savedTicket);
    }

    public List<TicketResponse> getMyTickets() {
        User currentUser = getCurrentUser();
        return ticketRepository.findByCreatorIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse updateTicket(Long ticketId, TicketUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
            
            // Notify Creator of status change
            NotificationRequest notifReq = new NotificationRequest();
            notifReq.setUserId(ticket.getCreatorId());
            notifReq.setMessage("Your ticket for " + ticket.getResourceName() + " is now: " + ticket.getStatus());
            notifReq.setType(NotificationType.TICKET_UPDATE);
            notifReq.setReferenceId(ticket.getId());
            notificationService.createNotification(notifReq);
        }

        if (request.getAssigneeId() != null) {
            ticket.setAssigneeId(request.getAssigneeId());

            // Notify Assignee
            NotificationRequest notifReq = new NotificationRequest();
            notifReq.setUserId(request.getAssigneeId());
            notifReq.setMessage("You have been assigned to a new ticket: " + ticket.getResourceName());
            notifReq.setType(NotificationType.TICKET_UPDATE);
            notifReq.setReferenceId(ticket.getId());
            notificationService.createNotification(notifReq);
        }

        return mapToResponse(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        
        User currentUser = getCurrentUser();
        if (!ticket.getCreatorId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You do not have permission to delete this ticket");
        }
        
        ticketRepository.delete(ticket);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        String creatorName = userRepository.findById(ticket.getCreatorId())
                .map(User::getName)
                .orElse("Unknown");
        String assigneeName = "Unassigned";
        if (ticket.getAssigneeId() != null) {
            assigneeName = userRepository.findById(ticket.getAssigneeId())
                    .map(User::getName)
                    .orElse("Unknown");
        }

        return TicketResponse.builder()
                .id(ticket.getId())
                .resourceName(ticket.getResourceName())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .contactNumber(ticket.getContactNumber())
                .email(ticket.getEmail())
                .status(ticket.getStatus())
                .imagesBase64(ticket.getImagesBase64())
                .creatorId(ticket.getCreatorId())
                .creatorName(creatorName)
                .assigneeId(ticket.getAssigneeId())
                .assigneeName(assigneeName)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
