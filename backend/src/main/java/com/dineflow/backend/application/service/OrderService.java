package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.model.OrderStatus;
import com.dineflow.backend.domain.model.PaymentStatus;
import com.dineflow.backend.domain.port.in.OrderUseCases;
import com.dineflow.backend.domain.port.out.OrderRepositoryPort;
import com.dineflow.backend.domain.port.out.NotificationPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import com.dineflow.backend.domain.exception.InvalidOrderStateException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService implements OrderUseCases {

    private final OrderRepositoryPort orderRepositoryPort;
    private final NotificationPort notificationPort;

    @Override
    @Transactional
    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.calculateTotals();

        Order savedOrder = orderRepositoryPort.save(order);
        notificationPort.sendNewOrderNotification(savedOrder);
        return savedOrder;
    }

    @Override
    public Order getOrderById(UUID id) {
        return orderRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    @Override
    public List<Order> getOrdersByUser(UUID userId) {
        return orderRepositoryPort.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepositoryPort.findAll();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepositoryPort.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        order.setStatus(status);
        if (status == OrderStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }

        Order updatedOrder = orderRepositoryPort.save(order);
        notificationPort.sendOrderStatusUpdate(updatedOrder);
        return updatedOrder;
    }

    @Override
    @Transactional
    public Order cancelOrder(UUID orderId, String reason) {
        Order order = orderRepositoryPort.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        if (currentStatus == OrderStatus.PREPARING || 
            currentStatus == OrderStatus.READY || 
            currentStatus == OrderStatus.COMPLETED || 
            currentStatus == OrderStatus.OUT_FOR_DELIVERY) {
            throw new InvalidOrderStateException("Cannot cancel order in state: " + currentStatus);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setNotes(order.getNotes() + " | Cancel reason: " + reason);

        Order updatedOrder = orderRepositoryPort.save(order);
        notificationPort.sendOrderStatusUpdate(updatedOrder);
        return updatedOrder;
    }
}
