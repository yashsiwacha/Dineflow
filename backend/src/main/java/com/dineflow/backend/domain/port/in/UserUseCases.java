package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.User;

import java.util.List;
import java.util.UUID;

public interface UserUseCases {
    User register(User user);
    User findByEmail(String email);
    User findById(UUID id);
    List<User> getAllCustomers();
}
