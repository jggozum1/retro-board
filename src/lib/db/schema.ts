import { pgTable, uuid, varchar, text, boolean, integer, timestamp, unique, index } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 6 }).notNull().unique(),
  adminPin: varchar('admin_pin', { length: 60 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  displayName: varchar('display_name', { length: 50 }).notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  sessionToken: varchar('session_token', { length: 64 }).notNull().unique(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  index('idx_participants_room').on(table.roomId),
]);

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  participantId: uuid('participant_id').notNull().references(() => participants.id, { onDelete: 'cascade' }),
  columnType: varchar('column_type', { length: 30 }).notNull(),
  content: text('content').notNull(),
  voteCount: integer('vote_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_notes_room').on(table.roomId),
  index('idx_notes_room_column').on(table.roomId, table.columnType),
]);

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  participantId: uuid('participant_id').notNull().references(() => participants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  unique('unique_vote').on(table.noteId, table.participantId),
  index('idx_votes_note').on(table.noteId),
]);
