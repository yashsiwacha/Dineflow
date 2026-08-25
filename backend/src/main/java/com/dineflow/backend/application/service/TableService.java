package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.RestaurantTable;
import com.dineflow.backend.domain.model.TableStatus;
import com.dineflow.backend.domain.port.in.TableUseCases;
import com.dineflow.backend.domain.port.out.TableRepositoryPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TableService implements TableUseCases {

    private final TableRepositoryPort tableRepositoryPort;

    @Override
    public List<RestaurantTable> getAllTables() {
        return tableRepositoryPort.findAll();
    }

    @Override
    public RestaurantTable getTableByNumber(int tableNumber) {
        return tableRepositoryPort.findByTableNumber(tableNumber)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with number: " + tableNumber));
    }

    @Override
    @Transactional
    public RestaurantTable updateTableStatus(int tableNumber, TableStatus status) {
        RestaurantTable table = tableRepositoryPort.findByTableNumber(tableNumber)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with number: " + tableNumber));
        table.setStatus(status);
        return tableRepositoryPort.save(table);
    }

    @Override
    @Transactional
    public RestaurantTable createTable(RestaurantTable table) {
        tableRepositoryPort.findByTableNumber(table.getTableNumber()).ifPresent(t -> {
            throw new IllegalArgumentException("Table with number " + table.getTableNumber() + " already exists.");
        });
        return tableRepositoryPort.save(table);
    }
}
