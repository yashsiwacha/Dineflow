package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.*;
import com.dineflow.backend.domain.port.in.MenuUseCases;
import com.dineflow.backend.domain.port.in.OrderUseCases;
import com.dineflow.backend.domain.port.in.ReservationUseCases;
import com.dineflow.backend.domain.port.in.UserUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final OrderUseCases orderUseCases;
    private final ReservationUseCases reservationUseCases;
    private final MenuUseCases menuUseCases;
    private final UserUseCases userUseCases;

    public record AnalyticsSummary(
            BigDecimal totalRevenue,
            long totalOrders,
            BigDecimal averageOrderValue,
            long totalReservations,
            List<Map<String, Object>> topDishes,
            List<Map<String, Object>> ordersByCategory,
            List<Map<String, Object>> reservationsTrend
    ) {}

    public record CustomerProfile(
            UUID id,
            String email,
            String fullName,
            String phone,
            long orderCount,
            BigDecimal totalSpend,
            String status,
            String lastOrderDate
    ) {}

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsSummary> getAnalytics() {
        List<Order> allOrders = orderUseCases.getAllOrders();
        List<Reservation> allReservations = reservationUseCases.getAllReservations();
        List<MenuItem> allItems = menuUseCases.getAllMenuItems(null, false, null);
        List<MenuCategory> allCategories = menuUseCases.getAllCategories();

        // Calculate Revenue (Completed orders)
        List<Order> completedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageOrderValue = completedOrders.isEmpty() ? BigDecimal.ZERO :
                totalRevenue.divide(BigDecimal.valueOf(completedOrders.size()), 2, RoundingMode.HALF_UP);

        // Aggregate Top Dishes
        Map<UUID, Integer> dishQuantities = new HashMap<>();
        for (Order order : allOrders) {
            for (OrderItem item : order.getItems()) {
                dishQuantities.put(item.getMenuItemId(), dishQuantities.getOrDefault(item.getMenuItemId(), 0) + item.getQuantity());
            }
        }

        List<Map<String, Object>> topDishesList = dishQuantities.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    Optional<MenuItem> dish = allItems.stream().filter(i -> i.getId().equals(entry.getKey())).findFirst();
                    map.put("name", dish.map(MenuItem::getName).orElse("Unknown Dish"));
                    map.put("quantity", entry.getValue());
                    return map;
                })
                .sorted((a, b) -> Integer.compare((int) b.get("quantity"), (int) a.get("quantity")))
                .limit(5)
                .collect(Collectors.toList());

        // Aggregate Orders by Category
        Map<UUID, Integer> categoryCounts = new HashMap<>();
        for (Order order : allOrders) {
            for (OrderItem item : order.getItems()) {
                Optional<MenuItem> dish = allItems.stream().filter(i -> i.getId().equals(item.getMenuItemId())).findFirst();
                if (dish.isPresent()) {
                    UUID catId = dish.get().getMenuCategoryId();
                    categoryCounts.put(catId, categoryCounts.getOrDefault(catId, 0) + item.getQuantity());
                }
            }
        }

        List<Map<String, Object>> categoryCountsList = categoryCounts.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    Optional<MenuCategory> category = allCategories.stream().filter(c -> c.getId().equals(entry.getKey())).findFirst();
                    map.put("category", category.map(MenuCategory::getName).orElse("Others"));
                    map.put("count", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // Reservation trend grouped by Date
        Map<String, Long> reservationDateGroup = allReservations.stream()
                .collect(Collectors.groupingBy(r -> r.getReservationDate().toString(), Collectors.counting()));

        List<Map<String, Object>> reservationsTrendList = reservationDateGroup.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", entry.getKey());
                    map.put("count", entry.getValue());
                    return map;
                })
                .sorted(Comparator.comparing(a -> (String) a.get("date")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AnalyticsSummary(
                totalRevenue,
                allOrders.size(),
                averageOrderValue,
                allReservations.size(),
                topDishesList,
                categoryCountsList,
                reservationsTrendList
        ));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerProfile>> getCustomers() {
        List<User> customers = userUseCases.getAllCustomers().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER)
                .collect(Collectors.toList());

        List<Order> allOrders = orderUseCases.getAllOrders();

        List<CustomerProfile> profiles = customers.stream()
                .map(customer -> {
                    List<Order> customerOrders = allOrders.stream()
                            .filter(o -> o.getUserId() != null && o.getUserId().equals(customer.getId()))
                            .collect(Collectors.toList());

                    BigDecimal totalSpend = customerOrders.stream()
                            .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                            .map(Order::getFinalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    String lastOrderDate = customerOrders.isEmpty() ? "N/A" :
                            customerOrders.get(0).getCreatedAt().toString();

                    return new CustomerProfile(
                            customer.getId(),
                            customer.getEmail(),
                            customer.getFullName(),
                            customer.getPhone(),
                            customerOrders.size(),
                            totalSpend,
                            customer.getStatus().name(),
                            lastOrderDate
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(profiles);
    }
}
