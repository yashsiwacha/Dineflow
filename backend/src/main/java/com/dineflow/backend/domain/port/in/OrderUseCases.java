package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.model.OrderStatus;

import java.util.List;
import java.util.UUID;

public interface OrderUseCases {
    Order createOrder(Order order);
    Order getOrderById(UUID id);
    List<Order> getOrdersByUser(UUID userId);
    List<Order> getAllOrders();
    Order updateOrderStatus(UUID orderId, OrderStatus status);
    Order cancelOrder(UUID orderId, String reason);
}
