package com.dineflow.backend.infrastructure.persistence.entity;

import com.dineflow.backend.domain.model.TableStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "restaurant_tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at IS NULL")
public class RestaurantTableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "table_number", nullable = false, unique = true)
    private int tableNumber;

    @Column(name = "seating_capacity", nullable = false)
    private int seatingCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (createdBy == null) {
            createdBy = "SYSTEM";
        }
    }
}
