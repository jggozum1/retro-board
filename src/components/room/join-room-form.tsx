'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ALIASES = ['Phoenix', 'Shadow', 'Nova', 'Zen', 'Blaze', 'Echo', 'Storm', 'Pixel', 'Drift', 'Spark'];

function getRandomAlias() {
  return ALIASES[Math.floor(Math.random() * ALIASES.length)];
}

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [useAlias, setUseAlias] = useState(true);

  useEffect(() => {
    setDisplayName(getRandomAlias());
  }, []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), displayName }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to join room');
        return;
      }

      const { roomCode } = await res.json();
      router.push(`/room/${roomCode}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="room-code"
        label="Room Code"
        placeholder="ABC123"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        required
        maxLength={6}
        className="uppercase tracking-widest text-center text-lg"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-alias"
            checked={useAlias}
            onChange={(e) => {
              setUseAlias(e.target.checked);
              if (e.target.checked) setDisplayName(getRandomAlias());
            }}
            className="accent-accent"
          />
          <label htmlFor="use-alias" className="text-sm text-text-secondary">
            Use random alias
          </label>
        </div>
        <Input
          id="display-name"
          label={useAlias ? 'Your Alias' : 'Your Name'}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={useAlias}
          required
          maxLength={50}
        />
        {useAlias && (
          <button
            type="button"
            onClick={() => setDisplayName(getRandomAlias())}
            className="text-xs text-accent hover:text-accent-dim"
          >
            Shuffle alias
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Joining...' : 'Join Room'}
      </Button>
    </form>
  );
}
