package com.dineflow.backend.domain.port.out;

import com.dineflow.backend.domain.model.MenuItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MenuItemRepositoryPort {
    MenuItem save(MenuItem item);
    Optional<MenuItem> findById(UUID id);
    List<MenuItem> findAll(UUID categoryId, Boolean availableOnly, String searchQuery);
    void delete(UUID id);
}
