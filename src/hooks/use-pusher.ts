'use client';

import { useEffect, useRef } from 'react';
import { getPusherClient } from '@/lib/pusher/client';
import type { Channel } from 'pusher-js';

export function usePusher(channelName: string, events: Record<string, (data: unknown) => void>) {
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    Object.entries(events).forEach(([event, handler]) => {
      channel.bind(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        channel.unbind(event, handler);
      });
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [channelName]); // eslint-disable-line react-hooks/exhaustive-deps
}
