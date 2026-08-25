package com.dineflow.backend.application.service;

import com.dineflow.backend.domain.model.Reservation;
import com.dineflow.backend.domain.model.ReservationStatus;
import com.dineflow.backend.domain.model.RestaurantTable;
import com.dineflow.backend.domain.port.in.ReservationUseCases;
import com.dineflow.backend.domain.port.out.ReservationRepositoryPort;
import com.dineflow.backend.domain.port.out.TableRepositoryPort;
import com.dineflow.backend.domain.port.out.LockPort;
import com.dineflow.backend.domain.exception.EntityNotFoundException;
import com.dineflow.backend.domain.exception.ReservationConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService implements ReservationUseCases {

    private final ReservationRepositoryPort reservationRepositoryPort;
    private final TableRepositoryPort tableRepositoryPort;
    private final LockPort lockPort;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        String lockKey = "res_" + reservation.getReservationDate() + "_" + reservation.getTimeSlot();
        lockPort.lock(lockKey);

        try {
            // If table number is specified, verify it's not already booked for the exact time slot
            if (reservation.getTableNumber() != null) {
                RestaurantTable table = tableRepositoryPort.findByTableNumber(reservation.getTableNumber())
                        .orElseThrow(() -> new EntityNotFoundException("Table not found: " + reservation.getTableNumber()));
                
                if (table.getSeatingCapacity() < reservation.getPartySize()) {
                    throw new IllegalArgumentException("Table " + reservation.getTableNumber() + 
                            " capacity is too small for party size: " + reservation.getPartySize());
                }

                boolean existsConflict = reservationRepositoryPort.existsByTableNumberAndDateAndTimeSlot(
                        reservation.getTableNumber(), 
                        reservation.getReservationDate(), 
                        reservation.getTimeSlot()
                );
                if (existsConflict) {
                    throw new ReservationConflictException("Table " + reservation.getTableNumber() + 
                            " is already reserved at " + reservation.getReservationDate() + " " + reservation.getTimeSlot());
                }
            }

            reservation.setStatus(ReservationStatus.PENDING);
            return reservationRepositoryPort.save(reservation);
        } finally {
            lockPort.unlock(lockKey);
        }
    }

    @Override
    public List<Reservation> getReservationsByUser(UUID userId) {
        return reservationRepositoryPort.findByUserId(userId);
    }

    @Override
    public List<Reservation> getReservationsByDate(LocalDate date) {
        return reservationRepositoryPort.findByDate(date);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepositoryPort.findAll();
    }

    @Override
    @Transactional
    public Reservation updateReservationStatus(UUID id, ReservationStatus status) {
        Reservation reservation = reservationRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        return reservationRepositoryPort.save(reservation);
    }

    @Override
    @Transactional
    public Reservation assignTable(UUID id, Integer tableNumber) {
        Reservation reservation = reservationRepositoryPort.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));

        RestaurantTable table = tableRepositoryPort.findByTableNumber(tableNumber)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with number: " + tableNumber));

        if (table.getSeatingCapacity() < reservation.getPartySize()) {
            throw new IllegalArgumentException("Table capacity (" + table.getSeatingCapacity() + 
                    ") is less than reservation party size (" + reservation.getPartySize() + ")");
        }

        String lockKey = "res_" + reservation.getReservationDate() + "_" + reservation.getTimeSlot();
        lockPort.lock(lockKey);
        try {
            boolean existsConflict = reservationRepositoryPort.existsByTableNumberAndDateAndTimeSlot(
                    tableNumber, 
                    reservation.getReservationDate(), 
                    reservation.getTimeSlot()
            );
            if (existsConflict) {
                throw new ReservationConflictException("Table " + tableNumber + 
                        " is already reserved at " + reservation.getReservationDate() + " " + reservation.getTimeSlot());
            }

            reservation.setTableNumber(tableNumber);
            reservation.setStatus(ReservationStatus.CONFIRMED);
            return reservationRepositoryPort.save(reservation);
        } finally {
            lockPort.unlock(lockKey);
        }
    }
}
