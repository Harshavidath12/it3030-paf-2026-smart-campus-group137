package com.group137.smartcampus.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Stores user notification preferences for the web platform.
 * Primary Key is the userId (1-to-1 mapping with User).
 */
@Entity
@Table(name = "notification_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {

    @Id
    private Long userId;

    @Column(nullable = false)
    @Builder.Default
    private boolean disableAll = false;

    // Web preferences
    @Column(nullable = false)
    @Builder.Default
    private boolean bookingWebEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketWebEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean generalWebEnabled = true;

}
