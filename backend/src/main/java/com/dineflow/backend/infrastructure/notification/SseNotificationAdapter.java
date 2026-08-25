package com.dineflow.backend.infrastructure.notification;

import com.dineflow.backend.domain.model.Order;
import com.dineflow.backend.domain.port.out.NotificationPort;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseNotificationAdapter implements NotificationPort {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(180_000L); // 3 minutes timeout
        emitters.add(emitter);
        
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        try {
            // Send initial connection event
            emitter.send(SseEmitter.event().name("init").data("Connected to DineFlow real-time stream"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    @Override
    public void sendOrderStatusUpdate(Order order) {
        broadcast("status_update", order);
    }

    @Override
    public void sendNewOrderNotification(Order order) {
        broadcast("new_order", order);
    }

    private void broadcast(String eventName, Object data) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data, MediaType.APPLICATION_JSON));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }
}
