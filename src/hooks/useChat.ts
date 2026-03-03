'use client';

import { useEffect, useState } from 'react';
import type { ChatTurn } from '@/types/domain';

export function useChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const existing = localStorage.getItem('chat-session-id');
    if (existing) setSessionId(existing);
  }, []);

  const ask = async (content: string) => {
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, sessionId: sessionId || undefined }),
      });
      const text = await response.text();
      const newSession = response.headers.get('x-session-id');
      if (newSession && !sessionId) {
        setSessionId(newSession);
        localStorage.setItem('chat-session-id', newSession);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, ask, sessionId };
}
