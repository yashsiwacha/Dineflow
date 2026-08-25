package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.infrastructure.persistence.entity.MenuItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpringDataMenuItemRepository extends JpaRepository<MenuItemEntity, UUID> {

    @Query("SELECT m FROM MenuItemEntity m WHERE " +
           "(:categoryId IS NULL OR m.menuCategoryId = :categoryId) AND " +
           "(:availableOnly = false OR m.isAvailable = true) AND " +
           "(:searchQuery IS NULL OR :searchQuery = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    List<MenuItemEntity> findAllFiltered(
            @Param("categoryId") UUID categoryId,
            @Param("availableOnly") Boolean availableOnly,
            @Param("searchQuery") String searchQuery
    );
}
