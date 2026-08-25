'use client';

import { useEffect, useRef } from 'react';

interface SseHandlers {
  onNewOrder?: (order: any) => void;
  onStatusUpdate?: (order: any) => void;
  onInit?: (message: string) => void;
}

export function useSse(handlers: SseHandlers) {
  const handlersRef = useRef(handlers);

  // Keep handlers up-to-date to avoid re-triggering connection
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const baseUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8080/api';
    const url = `${baseUrl}/kitchen/stream`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('init', (event: MessageEvent) => {
      if (handlersRef.current.onInit) {
        handlersRef.current.onInit(event.data);
      }
    });

    eventSource.addEventListener('new_order', (event: MessageEvent) => {
      if (handlersRef.current.onNewOrder) {
        try {
          const order = JSON.parse(event.data);
          handlersRef.current.onNewOrder(order);
        } catch (e) {
          // Parse failure
        }
      }
    });

    eventSource.addEventListener('status_update', (event: MessageEvent) => {
      if (handlersRef.current.onStatusUpdate) {
        try {
          const order = JSON.parse(event.data);
          handlersRef.current.onStatusUpdate(order);
        } catch (e) {
          // Parse failure
        }
      }
    });

    eventSource.onerror = (err) => {
      // EventSource automatically attempts to reconnect on failure
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
