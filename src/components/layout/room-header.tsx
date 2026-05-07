'use client';

import { useState } from 'react';
import { SummaryModal } from '@/components/board/summary-modal';

interface Participant {
  id: string;
  displayName: string;
  isAdmin: boolean;
  joinedAt: Date;
}

interface RoomHeaderProps {
  roomName: string;
  roomCode: string;
  roomId: string;
  isAdmin: boolean;
  participants: Participant[];
  noteCount: number;
}

export function RoomHeader({ roomName, roomCode, roomId, isAdmin, participants, noteCount }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{roomName}</h1>
        <p className="text-xs text-text-secondary">{participants.length} participants</p>
      </div>
      <div className="flex items-center gap-3">
        {/* AI Summary button - admin only */}
        {isAdmin && (
          <button
            onClick={() => setShowSummary(true)}
            disabled={noteCount === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border rounded-md hover:border-accent transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1.5a2.5 2.5 0 0 1-5 0V14H9v1.5a2.5 2.5 0 0 1-5 0V14a3 3 0 0 1 3-3h3V9.4A4 4 0 0 1 12 2z" />
            </svg>
            <span className="text-sm text-text-primary">AI Summary</span>
          </button>
        )}

        {/* Participants button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border rounded-md hover:border-border-hover transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-sm text-text-primary">{participants.length}</span>
        </button>

        {/* Room code */}
        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border rounded-md hover:border-accent transition-colors"
        >
          <span className="text-sm font-mono text-accent tracking-wider">{roomCode}</span>
          <span className="text-xs text-text-secondary">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Participants Panel */}
      {showPanel && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowPanel(false)} />
          <div className="absolute right-4 top-full mt-2 z-40 w-72 bg-bg-secondary border border-border rounded-lg shadow-xl animate-[scaleIn_0.15s_ease-out]">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Participants</h3>
              <p className="text-xs text-text-secondary">{participants.length} people in this room</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-elevated transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent">
                      {p.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {p.displayName}
                    </p>
                    {p.isAdmin && (
                      <span className="text-[10px] font-medium text-accent">Admin</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* AI Summary Modal */}
      {showSummary && (
        <SummaryModal roomId={roomId} onClose={() => setShowSummary(false)} />
      )}
    </div>
  );
}
