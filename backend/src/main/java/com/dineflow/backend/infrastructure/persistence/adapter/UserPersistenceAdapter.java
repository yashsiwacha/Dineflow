package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.User;
import com.dineflow.backend.domain.port.out.UserRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.UserEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository userRepository;

    @Override
    public User save(User user) {
        UserEntity entity = toEntity(user);
        UserEntity saved = userRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<User> findAllCustomers() {
        return userRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private UserEntity toEntity(User user) {
        if (user == null) return null;
        return UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .createdBy(user.getCreatedBy())
                .version(user.getVersion())
                .build();
    }

    private User toDomain(UserEntity entity) {
        if (entity == null) return null;
        return User.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .role(entity.getRole())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
