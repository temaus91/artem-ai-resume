import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { buildSystemPrompt } from '@/lib/ai/build-system-prompt';
import { isClearlyOffTopic, normalizeAssistantAnswer, OFF_TOPIC_RESPONSE } from '@/lib/ai/chat-guardrails';
import { withEvidenceLine } from '@/lib/ai/evidence-labels';
import { rateLimitHeaders, rateLimitRequest } from '@/lib/rate-limit';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role';
import { artemProfile } from '@/data/artem-profile';
import { randomUUID } from 'crypto';

const CHAT_RATE_LIMIT = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1) })).min(1),
  sessionId: z.string().optional(),
});

export const runtime = 'nodejs';

async function persistChatTurn(sessionId: string, userMessage: string | undefined, assistantMessage: string) {
  if (!userMessage || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  try {
    const supabase = createServiceRoleSupabaseClient();
    await supabase.from('chat_history').insert([
      { session_id: sessionId, role: 'user', content: userMessage },
      { session_id: sessionId, role: 'assistant', content: assistantMessage },
    ]);
  } catch {
    // no-op if db unavailable
  }
}

function getDeterministicProfileAnswer(message: string | undefined) {
  if (!message) return '';

  const normalized = message.toLowerCase();
  const asksEducation = /\b(education|degree|university|college|uw|bachelor|bs)\b/.test(normalized);
  const asksWorkAuthorization =
    /\b(citizen|citizenship|visa|authorized|authorization)\b/.test(normalized) ||
    normalized.includes('work legally') ||
    normalized.includes('legally work');

  if (asksEducation && asksWorkAuthorization) {
    return `I have a ${artemProfile.education}. For fuller education details, LinkedIn is the best reference. Yes, I am a US citizen and legally authorized to work in the United States.`;
  }

  if (asksEducation) {
    return `I have a ${artemProfile.education}. For fuller education details, LinkedIn is the best reference.`;
  }

  if (asksWorkAuthorization) {
    return 'Yes. I am a US citizen and legally authorized to work in the United States.';
  }

  return '';
}

export async function POST(req: Request) {
  const limit = rateLimitRequest(req, {
    route: 'chat',
    limit: CHAT_RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (!limit.allowed) {
    return new NextResponse('Too many chat requests. Please wait a few minutes and try again.', {
      status: 429,
      headers: rateLimitHeaders(limit),
    });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const sessionId = parsed.data.sessionId || randomUUID();
  const lastMessage = parsed.data.messages[parsed.data.messages.length - 1]?.content;
  let historyMessages: { role: 'user' | 'assistant'; content: string }[] = [];

  if (lastMessage && isClearlyOffTopic(lastMessage)) {
    await persistChatTurn(sessionId, lastMessage, OFF_TOPIC_RESPONSE);
    return new NextResponse(OFF_TOPIC_RESPONSE, { headers: { 'x-session-id': sessionId } });
  }

  const deterministicAnswer = getDeterministicProfileAnswer(lastMessage);
  if (deterministicAnswer) {
    const answer = withEvidenceLine(deterministicAnswer, lastMessage);
    await persistChatTurn(sessionId, lastMessage, answer);
    return new NextResponse(answer, { headers: { 'x-session-id': sessionId } });
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createServiceRoleSupabaseClient();
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
        career_narrative: `${artemProfile.yearsExperience}. 10 years at Amazon across Seller Experience, HR, Seller Fraud Prevention, and Kindle Content Management, then Oracle building test automation and AI-enabled product workflows. ${artemProfile.aiExperienceSummary}`,
        looking_for: artemProfile.status,
        not_looking_for: (artemProfile.hardNoClaims || []).join('; '),
        education: artemProfile.education,
        work_authorization: artemProfile.workAuthorization,
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
      projects: artemProfile.projects.map((project, idx) => ({
        id: `project-${idx + 1}`,
        name: project.name,
        role: project.role,
        period: project.period,
        summary: project.summary,
        source_url: project.sourceUrl,
        bullet_points: project.highlights,
        stack: project.stack,
        actual_contributions: project.aiContext.technicalWork,
        lessons_learned: project.aiContext.lessonsLearned,
      })),
      failures: artemProfile.failures.map((failure) => ({
        year: failure.year,
        title: failure.title,
        summary: failure.summary,
        details: failure.details,
        lessons: failure.lessons,
      })),
      skills: [
        ...artemProfile.skills.strong.map((s) => ({ skill_name: s, category: 'strong', evidence: 'Repeatedly demonstrated in production environments.' })),
        ...artemProfile.skills.moderate.map((s) => ({ skill_name: s, category: 'moderate', evidence: 'Applied in real project delivery contexts.' })),
        ...artemProfile.skills.gaps.map((s) => ({ skill_name: s, category: 'gaps', honest_notes: 'Known gap; be explicit and do not overclaim.' })),
      ],
      gaps: [
        { description: 'No formal people-manager role to date', why_its_a_gap: 'Career track has been senior IC ownership.' },
        { description: 'No server hardware engineering background', why_its_a_gap: 'Primary focus has been software platforms and cloud systems.' },
        { description: 'Not deeply specialized in production native mobile or device systems', why_its_a_gap: 'Currently building a SwiftUI iOS/watchOS paragliding app and has some Kindle Scribe launch/device-readiness experience, but primary professional focus is full-stack, backend, platform workflows, and production operations.' },
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
        { instruction: `AI experience: ${artemProfile.aiExperienceSummary}` },
        { instruction: `Education: ${artemProfile.education}` },
        { instruction: `Work authorization: ${artemProfile.workAuthorization}` },
        { instruction: 'When discussing the private marketplace project, do not name the product, domain, or present it as current employment. Describe it as independent product work built outside employment, focused on full-stack marketplace workflows, payments, auth, deployment, and operations.' },
        { instruction: 'When discussing the Soaring Session project, describe it as an in-progress personal iOS/watchOS prototype. Do not present it as a shipped public app or claim real GPS/barometer/field-test reliability before that validation exists.' },
      ],
    });
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL_CHAT || 'gpt-4.1-mini',
      store: false,
      instructions: prompt,
      input: [
        ...historyMessages.map((m) => ({ role: m.role, content: m.content })),
        ...parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_output_tokens: 350,
    });
    answer = normalizeAssistantAnswer(completion.output_text || answer);
  }

  answer = withEvidenceLine(answer, lastMessage);

  await persistChatTurn(sessionId, lastMessage, answer);

  return new NextResponse(answer, { headers: { 'x-session-id': sessionId } });
}
