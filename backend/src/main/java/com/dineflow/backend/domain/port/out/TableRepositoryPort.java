package com.dineflow.backend.domain.port.out;

import com.dineflow.backend.domain.model.RestaurantTable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TableRepositoryPort {
    List<RestaurantTable> findAll();
    Optional<RestaurantTable> findByTableNumber(int tableNumber);
    RestaurantTable save(RestaurantTable table);
}
