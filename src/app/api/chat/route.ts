import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { buildSystemPrompt } from '@/lib/ai/build-system-prompt';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { artemProfile } from '@/data/artem-profile';
import { randomUUID } from 'crypto';

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1) })).min(1),
  sessionId: z.string().optional(),
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const sessionId = parsed.data.sessionId || randomUUID();
  const lastMessage = parsed.data.messages[parsed.data.messages.length - 1]?.content;
  let historyMessages: { role: 'user' | 'assistant'; content: string }[] = [];

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createAdminSupabaseClient();
      const { data } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(20);
      historyMessages = ((data || []) as { role: 'user' | 'assistant'; content: string }[]).reverse();
    } catch {
      historyMessages = [];
    }
  }

  let answer = artemProfile.summary;
  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildSystemPrompt({ profile: { id: 'local', name: artemProfile.name, title: artemProfile.title } });
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL_CHAT || 'gpt-4.1-mini',
      input: [
        { role: 'system', content: prompt },
        ...historyMessages.map((m) => ({ role: m.role, content: m.content })),
        ...parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_output_tokens: 350,
    });
    answer = completion.output_text || answer;
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from('chat_history').insert([
        { session_id: sessionId, role: 'user', content: lastMessage },
        { session_id: sessionId, role: 'assistant', content: answer },
      ]);
    } catch {
      // no-op if db unavailable
    }
  }

  return new NextResponse(answer, { headers: { 'x-session-id': sessionId } });
}
