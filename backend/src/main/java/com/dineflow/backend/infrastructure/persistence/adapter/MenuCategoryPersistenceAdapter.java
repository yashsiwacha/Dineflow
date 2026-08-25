package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.MenuCategory;
import com.dineflow.backend.domain.port.out.MenuCategoryRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.MenuCategoryEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataMenuCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MenuCategoryPersistenceAdapter implements MenuCategoryRepositoryPort {

    private final SpringDataMenuCategoryRepository categoryRepository;

    @Override
    public MenuCategory save(MenuCategory category) {
        MenuCategoryEntity entity = toEntity(category);
        MenuCategoryEntity saved = categoryRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<MenuCategory> findById(UUID id) {
        return categoryRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<MenuCategory> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        categoryRepository.findById(id).ifPresent(entity -> {
            entity.setDeletedAt(java.time.Instant.now());
            categoryRepository.save(entity);
        });
    }

    private MenuCategoryEntity toEntity(MenuCategory category) {
        if (category == null) return null;
        return MenuCategoryEntity.builder()
                .id(category.getId())
                .name(category.getName())
                .isActive(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .createdBy(category.getCreatedBy())
                .version(category.getVersion())
                .build();
    }

    private MenuCategory toDomain(MenuCategoryEntity entity) {
        if (entity == null) return null;
        return MenuCategory.builder()
                .id(entity.getId())
                .name(entity.getName())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
