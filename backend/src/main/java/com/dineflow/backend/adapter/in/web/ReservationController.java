package com.dineflow.backend.adapter.in.web;

import com.dineflow.backend.domain.model.Reservation;
import com.dineflow.backend.domain.model.ReservationStatus;
import com.dineflow.backend.domain.model.User;
import com.dineflow.backend.domain.port.in.ReservationUseCases;
import com.dineflow.backend.domain.port.in.UserUseCases;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationUseCases reservationUseCases;
    private final UserUseCases userUseCases;

    public record StatusRequest(ReservationStatus status) {}
    public record AssignTableRequest(Integer tableNumber) {}

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails userDetails) {
            User user = userUseCases.findByEmail(userDetails.getUsername());
            reservation.setUserId(user.getId());
            if (reservation.getCustomerName() == null) {
                reservation.setCustomerName(user.getFullName());
            }
            if (reservation.getCustomerPhone() == null) {
                reservation.setCustomerPhone(user.getPhone());
            }
            if (reservation.getCustomerEmail() == null) {
                reservation.setCustomerEmail(user.getEmail());
            }
        }
        return ResponseEntity.ok(reservationUseCases.createReservation(reservation));
    }

    @GetMapping("/my-reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Reservation>> getMyReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userUseCases.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(reservationUseCases.getReservationsByUser(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<Reservation>> getAllReservations(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(reservationUseCases.getReservationsByDate(date));
        }
        return ResponseEntity.ok(reservationUseCases.getAllReservations());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable UUID id,
            @RequestBody StatusRequest request) {
        return ResponseEntity.ok(reservationUseCases.updateReservationStatus(id, request.status()));
    }

    @PatchMapping("/{id}/assign-table")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Reservation> assignTable(
            @PathVariable UUID id,
            @RequestBody AssignTableRequest request) {
        return ResponseEntity.ok(reservationUseCases.assignTable(id, request.tableNumber()));
    }
}
