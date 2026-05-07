'use client';

import { useEffect, useRef } from 'react';
import { subscribeChannel, unsubscribeChannel } from '@/lib/pusher/client';
import type { Channel } from 'pusher-js';

export function usePusher(channelName: string, events: Record<string, (data: unknown) => void>) {
  const channelRef = useRef<Channel | null>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    const channel = subscribeChannel(channelName);
    channelRef.current = channel;

    const handlers: Record<string, (data: unknown) => void> = {};
    Object.entries(eventsRef.current).forEach(([event, handler]) => {
      // Wrap handler to always use latest ref
      const wrappedHandler = (data: unknown) => eventsRef.current[event]?.(data);
      handlers[event] = wrappedHandler;
      channel.bind(event, wrappedHandler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        channel.unbind(event, handler);
      });
      unsubscribeChannel(channelName);
      channelRef.current = null;
    };
  }, [channelName]);
}
