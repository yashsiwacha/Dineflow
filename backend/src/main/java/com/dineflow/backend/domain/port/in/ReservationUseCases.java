package com.dineflow.backend.domain.port.in;

import com.dineflow.backend.domain.model.Reservation;
import com.dineflow.backend.domain.model.ReservationStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationUseCases {
    Reservation createReservation(Reservation reservation);
    List<Reservation> getReservationsByUser(UUID userId);
    List<Reservation> getReservationsByDate(LocalDate date);
    List<Reservation> getAllReservations();
    Reservation updateReservationStatus(UUID id, ReservationStatus status);
    Reservation assignTable(UUID id, Integer tableNumber);
}
