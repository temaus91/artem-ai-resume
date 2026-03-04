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
    const prompt = buildSystemPrompt({
      profile: {
        id: 'local',
        name: artemProfile.name,
        title: artemProfile.title,
        elevator_pitch: artemProfile.summary,
        location: artemProfile.location,
        target_titles: ['Senior Software Engineer', 'Senior Full-Stack Engineer', 'Platform Engineer'],
        career_narrative: `${artemProfile.yearsExperience}. 10 years at Amazon across Seller Experience, HR, Seller Fraud Prevention, and Kindle Content Management, then Oracle building test automation and AI-enabled product workflows.`,
        looking_for: artemProfile.status,
        not_looking_for: (artemProfile.hardNoClaims || []).join('; '),
      },
      experiences: artemProfile.experience.map((exp, idx) => ({
        id: `exp-${idx + 1}`,
        company_name: exp.company,
        title: exp.role,
        bullet_points: exp.highlights,
        actual_contributions: exp.aiContext.technicalWork,
        why_left: exp.company === 'Amazon' ? artemProfile.whyLeftAmazon : undefined,
        lessons_learned: exp.aiContext.lessonsLearned,
      })),
      skills: [
        ...artemProfile.skills.strong.map((s) => ({ skill_name: s, category: 'strong', evidence: 'Repeatedly demonstrated in production environments.' })),
        ...artemProfile.skills.moderate.map((s) => ({ skill_name: s, category: 'moderate', evidence: 'Applied in real project delivery contexts.' })),
        ...artemProfile.skills.gaps.map((s) => ({ skill_name: s, category: 'gaps', honest_notes: 'Known gap; be explicit and do not overclaim.' })),
      ],
      gaps: [
        { description: 'No formal people-manager role to date', why_its_a_gap: 'Career track has been senior IC ownership.' },
        { description: 'No server hardware engineering background', why_its_a_gap: 'Primary focus has been software platforms and cloud systems.' },
        { description: 'Limited direct device-focused scope', why_its_a_gap: 'Some Kindle work, but not deeply device-specialized.' },
      ],
      faq: (artemProfile.faq || []).map((item) => ({ question: item.question, answer: item.answer })),
      instructions: [
        { instruction: 'Use balanced tone: direct and honest, approachable but not overly friendly or hype.' },
        { instruction: 'Do not claim insufficient years for roles requiring 12 years or fewer.' },
        { instruction: 'Do not claim lack of high-scale background; Amazon and Oracle are high-scale environments.' },
        { instruction: `AWS experience includes: ${(artemProfile.awsServices || []).join(', ')}.` },
        { instruction: `Latest manager feedback: ${artemProfile.managerFeedback2026}` },
        { instruction: `Work values: ${(artemProfile.workValues || []).join('; ')}.` },
        { instruction: `Personality highlights: ${(artemProfile.personalityHighlights || []).join('; ')}.` },
        { instruction: `Long-term dreams: ${(artemProfile.longTermDreams || []).join('; ')}.` },
      ],
    });
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
