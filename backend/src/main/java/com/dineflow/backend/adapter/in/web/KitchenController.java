package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.model.OrderStatus;
import com.dineflow.backend.domain.port.in.OrderUseCases;
import com.dineflow.backend.infrastructure.notification.SseNotificationAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final OrderUseCases orderUseCases;
    private final SseNotificationAdapter sseNotificationAdapter;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        return sseNotificationAdapter.subscribe();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getActiveKitchenOrders() {
        // Return only orders that require kitchen visibility (placed, confirmed, preparing, ready, out for delivery)
        List<OrderStatus> activeStates = Arrays.asList(
                OrderStatus.PLACED,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY,
                OrderStatus.OUT_FOR_DELIVERY
        );

        List<Order> activeOrders = orderUseCases.getAllOrders().stream()
                .filter(order -> activeStates.contains(order.getStatus()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(activeOrders);
    }
}
