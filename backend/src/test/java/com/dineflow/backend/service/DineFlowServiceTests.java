package com.dineflow.backend.service;

import com.dineflow.backend.application.service.ReservationService;
import com.dineflow.backend.application.service.UserService;
import com.dineflow.backend.domain.exception.ReservationConflictException;
import com.dineflow.backend.domain.model.*;
import com.dineflow.backend.domain.port.out.LockPort;
import com.dineflow.backend.domain.port.out.ReservationRepositoryPort;
import com.dineflow.backend.domain.port.out.TableRepositoryPort;
import com.dineflow.backend.domain.port.out.UserRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class DineFlowServiceTests {

    private UserService userService;
    private ReservationService reservationService;

    @Mock private UserRepositoryPort userRepositoryPort;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private ReservationRepositoryPort reservationRepositoryPort;
    @Mock private TableRepositoryPort tableRepositoryPort;
    @Mock private LockPort lockPort;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepositoryPort, passwordEncoder);
        reservationService = new ReservationService(reservationRepositoryPort, tableRepositoryPort, lockPort);
    }

    @Test
    void testUserRegistrationHashesPassword() {
        User user = User.builder()
                .email("test@gmail.com")
                .passwordHash("raw_password")
                .fullName("Test User")
                .phone("+919999999999")
                .build();

        when(userRepositoryPort.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepositoryPort.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User registered = userService.register(user);

        assertNotNull(registered);
        assertEquals("hashed_password", registered.getPasswordHash());
        assertEquals(UserRole.CUSTOMER, registered.getRole());
        assertEquals(UserStatus.ACTIVE, registered.getStatus());
        verify(userRepositoryPort, times(1)).save(any(User.class));
    }

    @Test
    void testOrderCalculationComputesTaxAndTotal() {
        OrderItem item1 = OrderItem.builder()
                .menuItemId(UUID.randomUUID())
                .quantity(2)
                .price(BigDecimal.valueOf(100.00)) // Total 200
                .build();

        OrderItem item2 = OrderItem.builder()
                .menuItemId(UUID.randomUUID())
                .quantity(1)
                .price(BigDecimal.valueOf(50.00)) // Total 50
                .build();

        Order order = Order.builder()
                .orderType(OrderType.DELIVERY)
                .deliveryCharge(BigDecimal.valueOf(30.00))
                .items(Arrays.asList(item1, item2))
                .build();

        order.calculateTotals();

        // 200 + 50 = 250
        assertEquals(BigDecimal.valueOf(250.00), order.getTotalAmount());
        
        // 250 * 0.05 = 12.5
        assertEquals(BigDecimal.valueOf(12.50), order.getTaxAmount().setScale(1));
        
        // 250 + 12.5 + 30 = 292.5
        assertEquals(BigDecimal.valueOf(292.50), order.getFinalAmount().setScale(1));
    }

    @Test
    void testReservationPreventsDoubleBooking() {
        Reservation reservation = Reservation.builder()
                .reservationDate(LocalDate.now().plusDays(1))
                .timeSlot(LocalTime.of(19, 0))
                .partySize(4)
                .tableNumber(5)
                .build();

        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(5)
                .seatingCapacity(6)
                .build();

        when(tableRepositoryPort.findByTableNumber(5)).thenReturn(Optional.of(table));
        
        // Setup mock to return true for conflict check
        when(reservationRepositoryPort.existsByTableNumberAndDateAndTimeSlot(
                eq(5), any(LocalDate.class), any(LocalTime.class)
        )).thenReturn(true);

        assertThrows(ReservationConflictException.class, () -> {
            reservationService.createReservation(reservation);
        });

        verify(lockPort, times(1)).lock(anyString());
        verify(lockPort, times(1)).unlock(anyString());
        verify(reservationRepositoryPort, never()).save(any(Reservation.class));
    }
}
