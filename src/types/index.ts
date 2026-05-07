export type ColumnType = 'went_well' | 'went_wrong' | 'improvements' | 'action_items';

export interface Room {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'archived';
  createdAt: Date;
}

export interface Participant {
  id: string;
  roomId: string;
  displayName: string;
  isAdmin: boolean;
  joinedAt: Date;
}

export interface Note {
  id: string;
  roomId: string;
  participantId: string;
  columnType: ColumnType;
  content: string;
  voteCount: number;
  createdAt: Date;
  participantName?: string;
  hasVoted?: boolean;
}

export interface Vote {
  id: string;
  noteId: string;
  participantId: string;
}

export const COLUMN_CONFIG: Record<ColumnType, { title: string; color: string }> = {
  went_well: { title: 'What Went Well', color: 'var(--column-well)' },
  went_wrong: { title: 'What Went Wrong', color: 'var(--column-wrong)' },
  improvements: { title: 'Opportunities for Improvement', color: 'var(--column-improve)' },
  action_items: { title: 'Action Items', color: 'var(--column-action)' },
};
