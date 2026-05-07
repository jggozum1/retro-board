import PusherClient from 'pusher-js';
import type { Channel } from 'pusher-js';

let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherInstance;
}

// Reference-counted channel subscriptions
const channelRefs = new Map<string, { channel: Channel; count: number }>();

export function subscribeChannel(channelName: string): Channel {
  const existing = channelRefs.get(channelName);
  if (existing) {
    existing.count++;
    return existing.channel;
  }

  const pusher = getPusherClient();
  const channel = pusher.subscribe(channelName);
  channelRefs.set(channelName, { channel, count: 1 });
  return channel;
}

export function unsubscribeChannel(channelName: string): void {
  const existing = channelRefs.get(channelName);
  if (!existing) return;

  existing.count--;
  if (existing.count <= 0) {
    const pusher = getPusherClient();
    pusher.unsubscribe(channelName);
    channelRefs.delete(channelName);
  }
}
