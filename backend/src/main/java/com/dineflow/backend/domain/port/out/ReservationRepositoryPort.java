package com.dineflow.backend.domain.port.out;

import com.dineflow.backend.domain.model.Reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepositoryPort {
    Reservation save(Reservation reservation);
    Optional<Reservation> findById(UUID id);
    List<Reservation> findByUserId(UUID userId);
    List<Reservation> findByDate(LocalDate date);
    List<Reservation> findAll();
    boolean existsByTableNumberAndDateAndTimeSlot(int tableNumber, LocalDate date, LocalTime timeSlot);
    List<Reservation> findConflictingReservations(LocalDate date, LocalTime timeSlot);
}
