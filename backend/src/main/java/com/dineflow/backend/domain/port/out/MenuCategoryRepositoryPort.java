package com.dineflow.backend.domain.port.out;

import com.dineflow.backend.domain.model.MenuCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MenuCategoryRepositoryPort {
    MenuCategory save(MenuCategory category);
    Optional<MenuCategory> findById(UUID id);
    List<MenuCategory> findAll();
    void delete(UUID id);
}
