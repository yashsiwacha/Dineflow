package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.*;
import com.dineflow.backend.domain.port.in.PaymentUseCases;
import com.dineflow.backend.domain.port.out.OrderRepositoryPort;
import com.dineflow.backend.domain.port.out.PaymentRepositoryPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService implements PaymentUseCases {

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final OrderRepositoryPort orderRepositoryPort;

    @Override
    @Transactional
    public Payment processPayment(UUID orderId, BigDecimal amount, PaymentMethod method) {
        Order order = orderRepositoryPort.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        // Create Payment record
        Payment payment = Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentStatus(PaymentStatus.COMPLETED)
                .transactionId("txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                .paymentMethod(method)
                .build();

        Payment savedPayment = paymentRepositoryPort.save(payment);

        // Update Order payment status
        order.setPaymentStatus(PaymentStatus.COMPLETED);
        
        // If order type is DINE_IN, mark order as CONFIRMED upon payment (auto-confirmed)
        if (order.getOrderType() == OrderType.DINE_IN && order.getStatus() == OrderStatus.PLACED) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        orderRepositoryPort.save(order);

        return savedPayment;
    }
}
