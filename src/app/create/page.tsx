import { Card } from '@/components/ui/card';
import { CreateRoomForm } from '@/components/room/create-room-form';

export default function CreateRoomPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Create a Room</h1>
          <p className="text-sm text-text-secondary">
            Set up a new retrospective session
          </p>
        </div>
        <Card className="p-6">
          <CreateRoomForm />
        </Card>
      </div>
    </div>
  );
}
