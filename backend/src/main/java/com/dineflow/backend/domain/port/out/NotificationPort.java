package com.dineflow.backend.domain.port.out;

import com.dineflow.backend.domain.model.Order;

public interface NotificationPort {
    void sendOrderStatusUpdate(Order order);
    void sendNewOrderNotification(Order order);
}
