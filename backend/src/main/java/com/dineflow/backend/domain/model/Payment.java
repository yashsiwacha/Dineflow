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
public class Payment {
    private UUID id;
    private UUID orderId;
    private BigDecimal amount;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private PaymentMethod paymentMethod;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
