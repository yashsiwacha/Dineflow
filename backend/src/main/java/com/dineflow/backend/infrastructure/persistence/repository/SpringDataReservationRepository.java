package com.dineflow.backend.infrastructure.persistence.repository;

import com.dineflow.backend.infrastructure.persistence.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SpringDataReservationRepository extends JpaRepository<ReservationEntity, UUID> {

    List<ReservationEntity> findByUserId(UUID userId);
    List<ReservationEntity> findByReservationDate(LocalDate date);

    @Query("SELECT COUNT(r) > 0 FROM ReservationEntity r WHERE " +
           "r.tableNumber = :tableNumber AND " +
           "r.reservationDate = :date AND " +
           "r.timeSlot = :timeSlot AND " +
           "r.status NOT IN (com.dineflow.backend.domain.model.ReservationStatus.CANCELLED, com.dineflow.backend.domain.model.ReservationStatus.NO_SHOW)")
    boolean existsConflict(
            @Param("tableNumber") int tableNumber,
            @Param("date") LocalDate date,
            @Param("timeSlot") LocalTime timeSlot
    );

    @Query("SELECT r FROM ReservationEntity r WHERE " +
           "r.reservationDate = :date AND " +
           "r.timeSlot = :timeSlot AND " +
           "r.status NOT IN (com.dineflow.backend.domain.model.ReservationStatus.CANCELLED, com.dineflow.backend.domain.model.ReservationStatus.NO_SHOW)")
    List<ReservationEntity> findConflictingReservations(
            @Param("date") LocalDate date,
            @Param("timeSlot") LocalTime timeSlot
    );
}
