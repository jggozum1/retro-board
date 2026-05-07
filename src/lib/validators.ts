import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  pin: z.string().min(4).max(8),
  adminName: z.string().min(1).max(50),
});

export const joinRoomSchema = z.object({
  code: z.string().length(6),
  displayName: z.string().min(1).max(50),
});

export const createNoteSchema = z.object({
  roomId: z.string().uuid(),
  columnType: z.enum(['went_well', 'went_wrong', 'improvements', 'action_items']),
  content: z.string().min(1).max(500),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(500),
});

export const voteSchema = z.object({
  noteId: z.string().uuid(),
});
