'use client';

import React from 'react';

interface VoteButtonProps {
  voteCount: number;
  hasVoted: boolean;
  onVote: (e: React.MouseEvent) => void;
}

export function VoteButton({ voteCount, hasVoted, onVote }: VoteButtonProps) {
  return (
    <button
      onClick={onVote}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
        hasVoted
          ? 'bg-gray-900/20 text-gray-900'
          : 'bg-white/30 text-gray-700 hover:bg-white/50'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill={hasVoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M12 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" />
      </svg>
      {voteCount > 0 && <span>{voteCount}</span>}
    </button>
  );
}
