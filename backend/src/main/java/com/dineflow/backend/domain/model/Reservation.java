package com.dineflow.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    private UUID id;
    private UUID userId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private LocalDate reservationDate;
    private LocalTime timeSlot;
    private int partySize;
    private Integer tableNumber;
    private ReservationStatus status;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
