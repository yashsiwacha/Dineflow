package com.dineflow.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private UUID id;
    private UUID orderId;
    private UUID menuItemId;
    private int quantity;
    private BigDecimal price;
    private String specialInstructions;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
