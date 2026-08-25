package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataPaymentRepository extends JpaRepository<PaymentEntity, UUID> {
    Optional<PaymentEntity> findByOrderId(UUID orderId);
}
