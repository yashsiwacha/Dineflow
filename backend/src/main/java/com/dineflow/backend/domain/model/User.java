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
public class User {
    private UUID id;
    private String email;
    private String passwordHash;
    private String fullName;
    private String phone;
    private UserRole role;
    private UserStatus status;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Long version;
}
