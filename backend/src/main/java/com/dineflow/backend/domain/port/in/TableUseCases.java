package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.RestaurantTable;
import com.dineflow.backend.domain.model.TableStatus;

import java.util.List;
import java.util.UUID;

public interface TableUseCases {
    List<RestaurantTable> getAllTables();
    RestaurantTable getTableByNumber(int tableNumber);
    RestaurantTable updateTableStatus(int tableNumber, TableStatus status);
    RestaurantTable createTable(RestaurantTable table);
}
