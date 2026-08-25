package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.RestaurantTable;
import com.dineflow.backend.domain.model.TableStatus;
import com.dineflow.backend.domain.port.in.TableUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableUseCases tableUseCases;

    public record TableStatusRequest(TableStatus status) {}

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        return ResponseEntity.ok(tableUseCases.getAllTables());
    }

    @GetMapping("/{tableNumber}")
    public ResponseEntity<RestaurantTable> getTableByNumber(@PathVariable int tableNumber) {
        return ResponseEntity.ok(tableUseCases.getTableByNumber(tableNumber));
    }

    @PatchMapping("/{tableNumber}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<RestaurantTable> updateTableStatus(
            @PathVariable int tableNumber,
            @RequestBody TableStatusRequest request) {
        return ResponseEntity.ok(tableUseCases.updateTableStatus(tableNumber, request.status()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable table) {
        return ResponseEntity.ok(tableUseCases.createTable(table));
    }
}
