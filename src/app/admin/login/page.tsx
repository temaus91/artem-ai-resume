'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/admin` },
      });
      setStatus('Magic link sent. Check your inbox.');
    } catch {
      setStatus('Unable to send magic link. Configure Supabase environment variables.');
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border border-border rounded-xl p-6 space-y-4">
        <h1 className="font-serif text-2xl">Admin Login</h1>
        <p className="text-sm text-muted-foreground">Enter your email for a secure magic link.</p>
        <input className="w-full bg-secondary rounded p-3" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button className="w-full bg-accent text-accent-foreground rounded p-3">Send Magic Link</button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </form>
    </main>
  );
}
