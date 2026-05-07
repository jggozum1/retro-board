'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateRoomForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin, adminName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create room');
        return;
      }

      const { code } = await res.json();
      router.push(`/room/${code}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="room-name"
        label="Room Name"
        placeholder="Sprint 42 Retro"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
      />
      <Input
        id="admin-name"
        label="Your Name (Admin)"
        placeholder="Scrum Master"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
        required
        maxLength={50}
      />
      <Input
        id="pin"
        label="Admin PIN (4-8 digits)"
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        required
        minLength={4}
        maxLength={8}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create Room'}
      </Button>
    </form>
  );
}
