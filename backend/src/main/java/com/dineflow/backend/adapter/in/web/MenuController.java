package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.MenuCategory;
import com.dineflow.backend.domain.model.MenuItem;
import com.dineflow.backend.domain.port.in.MenuUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuUseCases menuUseCases;

    // Categories
    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getAllCategories() {
        return ResponseEntity.ok(menuUseCases.getAllCategories());
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuCategory> createCategory(@RequestBody MenuCategory category) {
        return ResponseEntity.ok(menuUseCases.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuCategory> updateCategory(@PathVariable UUID id, @RequestBody MenuCategory category) {
        return ResponseEntity.ok(menuUseCases.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        menuUseCases.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Menu Items
    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false, defaultValue = "false") Boolean availableOnly,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(menuUseCases.getAllMenuItems(categoryId, availableOnly, search));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable UUID id) {
        return ResponseEntity.ok(menuUseCases.getMenuItemById(id));
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(menuUseCases.createMenuItem(item));
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable UUID id, @RequestBody MenuItem item) {
        return ResponseEntity.ok(menuUseCases.updateMenuItem(id, item));
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable UUID id) {
        menuUseCases.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
