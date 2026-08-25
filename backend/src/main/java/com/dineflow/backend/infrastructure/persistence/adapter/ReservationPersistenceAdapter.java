package com.dineflow.backend.infrastructure.persistence.adapter;

import com.dineflow.backend.domain.model.Reservation;
import com.dineflow.backend.domain.port.out.ReservationRepositoryPort;
import com.dineflow.backend.infrastructure.persistence.entity.ReservationEntity;
import com.dineflow.backend.infrastructure.persistence.repository.SpringDataReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReservationPersistenceAdapter implements ReservationRepositoryPort {

    private final SpringDataReservationRepository reservationRepository;

    @Override
    public Reservation save(Reservation reservation) {
        ReservationEntity entity = toEntity(reservation);
        ReservationEntity saved = reservationRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Reservation> findById(UUID id) {
        return reservationRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Reservation> findByUserId(UUID userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Reservation> findByDate(LocalDate date) {
        return reservationRepository.findByReservationDate(date).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Reservation> findAll() {
        return reservationRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByTableNumberAndDateAndTimeSlot(int tableNumber, LocalDate date, LocalTime timeSlot) {
        return reservationRepository.existsConflict(tableNumber, date, timeSlot);
    }

    @Override
    public List<Reservation> findConflictingReservations(LocalDate date, LocalTime timeSlot) {
        return reservationRepository.findConflictingReservations(date, timeSlot).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private ReservationEntity toEntity(Reservation res) {
        if (res == null) return null;
        return ReservationEntity.builder()
                .id(res.getId())
                .userId(res.getUserId())
                .customerName(res.getCustomerName())
                .customerPhone(res.getCustomerPhone())
                .customerEmail(res.getCustomerEmail())
                .reservationDate(res.getReservationDate())
                .timeSlot(res.getTimeSlot())
                .partySize(res.getPartySize())
                .tableNumber(res.getTableNumber())
                .status(res.getStatus())
                .createdAt(res.getCreatedAt())
                .updatedAt(res.getUpdatedAt())
                .createdBy(res.getCreatedBy())
                .version(res.getVersion())
                .build();
    }

    private Reservation toDomain(ReservationEntity entity) {
        if (entity == null) return null;
        return Reservation.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .reservationDate(entity.getReservationDate())
                .timeSlot(entity.getTimeSlot())
                .partySize(entity.getPartySize())
                .tableNumber(entity.getTableNumber())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .version(entity.getVersion())
                .build();
    }
}
