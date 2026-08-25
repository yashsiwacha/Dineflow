package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.MenuCategory;
import com.dineflow.backend.domain.model.MenuItem;

import java.util.List;
import java.util.UUID;

public interface MenuUseCases {
    List<MenuCategory> getAllCategories();
    MenuCategory createCategory(MenuCategory category);
    MenuCategory updateCategory(UUID id, MenuCategory category);
    void deleteCategory(UUID id);

    List<MenuItem> getAllMenuItems(UUID categoryId, Boolean availableOnly, String searchQuery);
    MenuItem getMenuItemById(UUID id);
    MenuItem createMenuItem(MenuItem item);
    MenuItem updateMenuItem(UUID id, MenuItem item);
    void deleteMenuItem(UUID id);
}
