import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface StreamEvent {
  type: "service-status" | "payment-events" | "chain-events";
  requestId?: string;
  status?: string;
  txHash?: string;
  receiptId?: string;
  action?: string;
  agency?: string;
  serviceType?: string;
  amount?: number;
  timestamp: string;
}

export function useEventStream() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "/ws/events";
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as any,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/events", (message) => {
          try {
            const event: StreamEvent = JSON.parse(message.body);
            setEvents((prev) => [event, ...prev.slice(0, 99)]);
          } catch { /* ignore parse errors */ }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const latestStatus = (requestId: string): string | undefined => {
    const event = events.find(
      (e) => e.requestId === requestId && e.status
    );
    return event?.status;
  };

  return { events, connected, latestStatus };
}
