package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.MenuItem;
import com.dineflow.backend.domain.port.out.MenuItemRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.MenuItemEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataMenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MenuItemPersistenceAdapter implements MenuItemRepositoryPort {

    private final SpringDataMenuItemRepository itemRepository;

    @Override
    public MenuItem save(MenuItem item) {
        MenuItemEntity entity = toEntity(item);
        MenuItemEntity saved = itemRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<MenuItem> findById(UUID id) {
        return itemRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<MenuItem> findAll(UUID categoryId, Boolean availableOnly, String searchQuery) {
        boolean onlyAvailable = availableOnly != null && availableOnly;
        return itemRepository.findAllFiltered(categoryId, onlyAvailable, searchQuery).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        itemRepository.findById(id).ifPresent(entity -> {
            entity.setDeletedAt(java.time.Instant.now());
            itemRepository.save(entity);
        });
    }

    private MenuItemEntity toEntity(MenuItem item) {
        if (item == null) return null;
        return MenuItemEntity.builder()
                .id(item.getId())
                .menuCategoryId(item.getMenuCategoryId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .isVegetarian(item.isVegetarian())
                .spiceLevel(item.getSpiceLevel())
                .allergens(item.getAllergens())
                .isAvailable(item.isAvailable())
                .imageUrl(item.getImageUrl())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .createdBy(item.getCreatedBy())
                .version(item.getVersion())
                .build();
    }

    private MenuItem toDomain(MenuItemEntity entity) {
        if (entity == null) return null;
        return MenuItem.builder()
                .id(entity.getId())
                .menuCategoryId(entity.getMenuCategoryId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .isVegetarian(entity.isVegetarian())
                .spiceLevel(entity.getSpiceLevel())
                .allergens(entity.getAllergens())
                .isAvailable(entity.isAvailable())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
