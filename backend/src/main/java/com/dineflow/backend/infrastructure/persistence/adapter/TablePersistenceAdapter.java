package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.RestaurantTable;
import com.dineflow.backend.domain.port.out.TableRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.RestaurantTableEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TablePersistenceAdapter implements TableRepositoryPort {

    private final SpringDataTableRepository tableRepository;

    @Override
    public List<RestaurantTable> findAll() {
        return tableRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<RestaurantTable> findByTableNumber(int tableNumber) {
        return tableRepository.findByTableNumber(tableNumber).map(this::toDomain);
    }

    @Override
    public RestaurantTable save(RestaurantTable table) {
        RestaurantTableEntity entity = toEntity(table);
        RestaurantTableEntity saved = tableRepository.save(entity);
        return toDomain(saved);
    }

    private RestaurantTableEntity toEntity(RestaurantTable table) {
        if (table == null) return null;
        return RestaurantTableEntity.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .seatingCapacity(table.getSeatingCapacity())
                .status(table.getStatus())
                .createdAt(table.getCreatedAt())
                .updatedAt(table.getUpdatedAt())
                .createdBy(table.getCreatedBy())
                .version(table.getVersion())
                .build();
    }

    private RestaurantTable toDomain(RestaurantTableEntity entity) {
        if (entity == null) return null;
        return RestaurantTable.builder()
                .id(entity.getId())
                .tableNumber(entity.getTableNumber())
                .seatingCapacity(entity.getSeatingCapacity())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
