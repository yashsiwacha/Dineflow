package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.User;
import com.dineflow.backend.domain.model.UserRole;
import com.dineflow.backend.domain.port.in.UserUseCases;
import com.dineflow.backend.infrastructure.config.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserUseCases userUseCases;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public record RegisterRequest(String email, String password, String fullName, String phone, UserRole role) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, String email, String fullName, String role) {}

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .email(request.email())
                .passwordHash(request.password())
                .fullName(request.fullName())
                .phone(request.phone())
                .role(request.role())
                .build();
        User registeredUser = userUseCases.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User domainUser = userUseCases.findByEmail(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                domainUser.getEmail(),
                domainUser.getFullName(),
                domainUser.getRole().name()
        ));
    }
}
