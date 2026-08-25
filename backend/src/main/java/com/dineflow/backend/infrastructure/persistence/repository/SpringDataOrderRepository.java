package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.infrastructure.persistence.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataOrderRepository extends JpaRepository<OrderEntity, UUID> {

    @Query("SELECT DISTINCT o FROM OrderEntity o LEFT JOIN FETCH o.items ORDER BY o.createdAt DESC")
    List<OrderEntity> findAllWithItems();

    @Query("SELECT DISTINCT o FROM OrderEntity o LEFT JOIN FETCH o.items WHERE o.userId = :userId ORDER BY o.createdAt DESC")
    List<OrderEntity> findByUserIdWithItems(@Param("userId") UUID userId);

    @Query("SELECT o FROM OrderEntity o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<OrderEntity> findByIdWithItems(@Param("id") UUID id);
}
