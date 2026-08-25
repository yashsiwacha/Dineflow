package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.infrastructure.persistence.entity.MenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataMenuCategoryRepository extends JpaRepository<MenuCategoryEntity, UUID> {
    Optional<MenuCategoryEntity> findByName(String name);
}
