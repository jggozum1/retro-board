import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">ETS RetroBoard</h1>
          <p className="text-text-secondary">
            Real-time retrospective boards for agile teams
          </p>
        </div>
        <div className="grid gap-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Create a Room</h2>
            <p className="text-sm text-text-secondary mb-4">
              Start a new retrospective session as a facilitator
            </p>
            <Link href="/create">
              <Button className="w-full">Create Room</Button>
            </Link>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Join a Room</h2>
            <p className="text-sm text-text-secondary mb-4">
              Enter a room code to join an existing session
            </p>
            <Link href="/join">
              <Button variant="secondary" className="w-full">Join Room</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
