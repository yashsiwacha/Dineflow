package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.model.OrderItem;
import com.dineflow.backend.domain.port.out.OrderRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.OrderEntity;
import com.dineflow.backend.infrastructure.persistence.entity.OrderItemEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements OrderRepositoryPort {

    private final SpringDataOrderRepository orderRepository;

    @Override
    public Order save(Order order) {
        OrderEntity entity = toEntity(order);
        
        // Map items and link back to parent entity
        if (order.getItems() != null) {
            List<OrderItemEntity> itemEntities = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                OrderItemEntity itemEntity = toItemEntity(item);
                itemEntity.setOrder(entity);
                itemEntities.add(itemEntity);
            }
            entity.setItems(itemEntities);
        }

        OrderEntity saved = orderRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return orderRepository.findByIdWithItems(id).map(this::toDomain);
    }

    @Override
    public List<Order> findByUserId(UUID userId) {
        return orderRepository.findByUserIdWithItems(userId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAllWithItems().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private OrderEntity toEntity(Order order) {
        if (order == null) return null;
        return OrderEntity.builder()
                .id(order.getId())
                .tableNumber(order.getTableNumber())
                .userId(order.getUserId())
                .orderType(order.getOrderType())
                .status(order.getStatus())
                .notes(order.getNotes())
                .totalAmount(order.getTotalAmount())
                .taxAmount(order.getTaxAmount())
                .deliveryCharge(order.getDeliveryCharge())
                .finalAmount(order.getFinalAmount())
                .paymentStatus(order.getPaymentStatus())
                .address(order.getAddress())
                .contactPhone(order.getContactPhone())
                .contactName(order.getContactName())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .createdBy(order.getCreatedBy())
                .version(order.getVersion())
                .build();
    }

    private Order toDomain(OrderEntity entity) {
        if (entity == null) return null;
        List<OrderItem> items = new ArrayList<>();
        if (entity.getItems() != null) {
            items = entity.getItems().stream()
                    .map(this::toItemDomain)
                    .collect(Collectors.toList());
        }

        return Order.builder()
                .id(entity.getId())
                .tableNumber(entity.getTableNumber())
                .userId(entity.getUserId())
                .orderType(entity.getOrderType())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .totalAmount(entity.getTotalAmount())
                .taxAmount(entity.getTaxAmount())
                .deliveryCharge(entity.getDeliveryCharge())
                .finalAmount(entity.getFinalAmount())
                .paymentStatus(entity.getPaymentStatus())
                .address(entity.getAddress())
                .contactPhone(entity.getContactPhone())
                .contactName(entity.getContactName())
                .items(items)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }

    private OrderItemEntity toItemEntity(OrderItem item) {
        if (item == null) return null;
        return OrderItemEntity.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItemId())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .specialInstructions(item.getSpecialInstructions())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .createdBy(item.getCreatedBy())
                .version(item.getVersion())
                .build();
    }

    private OrderItem toItemDomain(OrderItemEntity entity) {
        if (entity == null) return null;
        return OrderItem.builder()
                .id(entity.getId())
                .orderId(entity.getOrder().getId())
                .menuItemId(entity.getMenuItemId())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .specialInstructions(entity.getSpecialInstructions())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
