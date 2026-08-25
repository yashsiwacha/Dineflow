package com.dineflow.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    private UUID id;
    private UUID menuCategoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean isVegetarian;
    private int spiceLevel; // 0 to 3
    private List<String> allergens;
    private boolean isAvailable;
    private String imageUrl;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
