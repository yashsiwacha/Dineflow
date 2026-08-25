package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.Payment;
import com.dineflow.backend.domain.model.PaymentMethod;
import com.dineflow.backend.domain.port.in.PaymentUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentUseCases paymentUseCases;

    public record PaymentRequest(UUID orderId, BigDecimal amount, PaymentMethod method) {}

    @PostMapping
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        Payment payment = paymentUseCases.processPayment(request.orderId(), request.amount(), request.method());
        return ResponseEntity.ok(payment);
    }
}
