package com.dineflow.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuCategory {
    private UUID id;
    private String name;
    private boolean isActive;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
