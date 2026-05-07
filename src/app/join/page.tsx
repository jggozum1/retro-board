import { Card } from '@/components/ui/card';
import { JoinRoomForm } from '@/components/room/join-room-form';

export default function JoinRoomPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Join a Room</h1>
          <p className="text-sm text-text-secondary">
            Enter the code shared by your facilitator
          </p>
        </div>
        <Card className="p-6">
          <JoinRoomForm />
        </Card>
      </div>
    </div>
  );
}
