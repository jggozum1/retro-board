import Groq from 'groq-sdk';
import { db } from '@/lib/db';
import { notes, participants } from '@/lib/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await request.json();
    if (session.roomId !== roomId) {
      return Response.json({ error: 'Not in this room' }, { status: 403 });
    }

    const roomNotes = await db
      .select({
        columnType: notes.columnType,
        content: notes.content,
        voteCount: notes.voteCount,
        participantName: participants.displayName,
      })
      .from(notes)
      .innerJoin(participants, eq(notes.participantId, participants.id))
      .where(eq(notes.roomId, roomId));

    if (roomNotes.length === 0) {
      return Response.json({ error: 'No notes to summarize' }, { status: 400 });
    }

    const grouped: Record<string, typeof roomNotes> = {};
    for (const note of roomNotes) {
      if (!grouped[note.columnType]) grouped[note.columnType] = [];
      grouped[note.columnType].push(note);
    }

    const columnLabels: Record<string, string> = {
      went_well: 'What Went Well',
      went_wrong: 'What Went Wrong',
      improvements: 'Opportunities for Improvement',
      action_items: 'Action Items',
    };

    let notesContent = '';
    for (const [col, colNotes] of Object.entries(grouped)) {
      notesContent += `\n## ${columnLabels[col] || col}\n`;
      for (const n of colNotes) {
        notesContent += `- "${n.content}" (by ${n.participantName}, ${n.voteCount} votes)\n`;
      }
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are a scrum master assistant. Below are the sticky notes from a team retrospective session. Please provide a concise summary that includes:

1. **Key Themes** - Main patterns across all categories
2. **Top Wins** - Most impactful positive items (consider vote count)
3. **Critical Issues** - Most pressing problems to address
4. **Recommended Actions** - Prioritized next steps based on the feedback

Keep it concise and actionable. Use bullet points.

---
${notesContent}`,
        },
      ],
      max_tokens: 1024,
    });

    const summary = completion.choices[0]?.message?.content || '';

    return Response.json({ summary });
  } catch (error: unknown) {
    console.error('Summary error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate summary';
    if (message.includes('429') || message.includes('rate')) {
      return Response.json({ error: 'AI rate limit exceeded. Please try again in a minute.' }, { status: 429 });
    }
    return Response.json({ error: 'Failed to generate summary. Please check your API key.' }, { status: 500 });
  }
}
