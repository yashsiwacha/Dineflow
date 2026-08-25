package com.dineflow.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "menu_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at IS NULL")
public class MenuItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "menu_category_id", nullable = false)
    private UUID menuCategoryId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal price;

    @Column(name = "is_vegetarian", nullable = false)
    private boolean isVegetarian;

    @Column(name = "spice_level", nullable = false)
    private int spiceLevel;

    @Convert(converter = ListToJsonConverter.class)
    @Column(columnDefinition = "jsonb")
    private List<String> allergens;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

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
