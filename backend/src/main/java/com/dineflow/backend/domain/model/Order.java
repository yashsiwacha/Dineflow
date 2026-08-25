package com.dineflow.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private UUID id;
    private Integer tableNumber;
    private UUID userId;
    private OrderType orderType;
    private OrderStatus status;
    private String notes;
    
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal finalAmount = BigDecimal.ZERO;
    
    private PaymentStatus paymentStatus;
    private String address;
    private String contactPhone;
    private String contactName;
    
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;

    public void calculateTotals() {
        if (items == null || items.isEmpty()) {
            this.totalAmount = BigDecimal.ZERO;
            this.taxAmount = BigDecimal.ZERO;
            this.finalAmount = this.deliveryCharge != null ? this.deliveryCharge : BigDecimal.ZERO;
            return;
        }

        // Sum items: qty * price
        BigDecimal sum = BigDecimal.ZERO;
        for (OrderItem item : items) {
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            sum = sum.add(itemTotal);
        }
        this.totalAmount = sum;

        // Apply 5% GST tax rate
        this.taxAmount = this.totalAmount.multiply(BigDecimal.valueOf(0.05));

        // Final amount = total + tax + delivery
        BigDecimal charge = this.deliveryCharge != null ? this.deliveryCharge : BigDecimal.ZERO;
        this.finalAmount = this.totalAmount.add(this.taxAmount).add(charge);
    }
}
