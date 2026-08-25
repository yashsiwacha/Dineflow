package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.MenuCategory;
import com.dineflow.backend.domain.model.MenuItem;
import com.dineflow.backend.domain.port.in.MenuUseCases;
import com.dineflow.backend.domain.port.out.MenuCategoryRepositoryPort;
import com.dineflow.backend.domain.port.out.MenuItemRepositoryPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService implements MenuUseCases {

    private final MenuCategoryRepositoryPort categoryRepositoryPort;
    private final MenuItemRepositoryPort itemRepositoryPort;

    @Override
    public List<MenuCategory> getAllCategories() {
        return categoryRepositoryPort.findAll();
    }

    @Override
    @Transactional
    public MenuCategory createCategory(MenuCategory category) {
        return categoryRepositoryPort.save(category);
    }

    @Override
    @Transactional
    public MenuCategory updateCategory(UUID id, MenuCategory category) {
        categoryRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        category.setId(id);
        return categoryRepositoryPort.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        categoryRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        categoryRepositoryPort.delete(id);
    }

    @Override
    public List<MenuItem> getAllMenuItems(UUID categoryId, Boolean availableOnly, String searchQuery) {
        return itemRepositoryPort.findAll(categoryId, availableOnly, searchQuery);
    }

    @Override
    public MenuItem getMenuItemById(UUID id) {
        return itemRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu item not found with id: " + id));
    }

    @Override
    @Transactional
    public MenuItem createMenuItem(MenuItem item) {
        categoryRepositoryPort.findById(item.getMenuCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + item.getMenuCategoryId()));
        return itemRepositoryPort.save(item);
    }

    @Override
    @Transactional
    public MenuItem updateMenuItem(UUID id, MenuItem item) {
        itemRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu item not found with id: " + id));
        categoryRepositoryPort.findById(item.getMenuCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + item.getMenuCategoryId()));
        item.setId(id);
        return itemRepositoryPort.save(item);
    }

    @Override
    @Transactional
    public void deleteMenuItem(UUID id) {
        itemRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu item not found with id: " + id));
        itemRepositoryPort.delete(id);
    }
}
