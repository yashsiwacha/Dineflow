package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.User;
import com.dineflow.backend.domain.model.UserRole;
import com.dineflow.backend.domain.model.UserStatus;
import com.dineflow.backend.domain.port.in.UserUseCases;
import com.dineflow.backend.domain.port.out.UserRepositoryPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserUseCases {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User register(User user) {
        userRepositoryPort.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists.");
        });

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
        }
        user.setStatus(UserStatus.ACTIVE);
        return userRepositoryPort.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }

    @Override
    public User findById(UUID id) {
        return userRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
    }

    @Override
    public List<User> getAllCustomers() {
        return userRepositoryPort.findAllCustomers();
    }
}
