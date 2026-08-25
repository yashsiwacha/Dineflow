package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.domain.model.UserRole;
import com.dineflow.backend.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataUserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByRole(UserRole role);
}
