package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.Payment;
import com.dineflow.backend.domain.port.out.PaymentRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.PaymentEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PaymentPersistenceAdapter implements PaymentRepositoryPort {

    private final SpringDataPaymentRepository paymentRepository;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = toEntity(payment);
        PaymentEntity saved = paymentRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return paymentRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Payment> findByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId).map(this::toDomain);
    }

    private PaymentEntity toEntity(Payment payment) {
        if (payment == null) return null;
        return PaymentEntity.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .createdBy(payment.getCreatedBy())
                .version(payment.getVersion())
                .build();
    }

    private Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .amount(entity.getAmount())
                .paymentStatus(entity.getPaymentStatus())
                .transactionId(entity.getTransactionId())
                .paymentMethod(entity.getPaymentMethod())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
