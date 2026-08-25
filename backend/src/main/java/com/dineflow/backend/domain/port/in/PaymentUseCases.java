package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.Payment;
import com.dineflow.backend.domain.model.PaymentMethod;

import java.math.BigDecimal;
import java.util.UUID;

public interface PaymentUseCases {
    Payment processPayment(UUID orderId, BigDecimal amount, PaymentMethod method);
}
