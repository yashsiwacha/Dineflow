package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.model.OrderStatus;
import com.dineflow.backend.domain.model.User;
import com.dineflow.backend.domain.port.in.OrderUseCases;
import com.dineflow.backend.domain.port.in.UserUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderUseCases orderUseCases;
    private final UserUseCases userUseCases;

    public record CancelRequest(String reason) {}
    public record StatusUpdateRequest(OrderStatus status) {}

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Link authenticated user context if present
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails userDetails) {
            User user = userUseCases.findByEmail(userDetails.getUsername());
            order.setUserId(user.getId());
        }
        return ResponseEntity.ok(orderUseCases.createOrder(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable UUID id) {
        Order order = orderUseCases.getOrderById(id);
        
        // Security check: Only allow customer who placed it or staff/admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails userDetails) {
            User user = userUseCases.findByEmail(userDetails.getUsername());
            boolean isStaffOrAdmin = user.getRole().name().equals("STAFF") || user.getRole().name().equals("ADMIN") || user.getRole().name().equals("KITCHEN");
            if (!isStaffOrAdmin && order.getUserId() != null && !order.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
        }
        
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Order>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userUseCases.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(orderUseCases.getOrdersByUser(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'KITCHEN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderUseCases.getAllOrders());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'KITCHEN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable UUID id, 
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(orderUseCases.updateOrderStatus(id, request.status()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable UUID id, 
            @RequestBody CancelRequest request) {
        return ResponseEntity.ok(orderUseCases.cancelOrder(id, request.reason()));
    }
}
