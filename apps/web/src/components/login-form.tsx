'use client';

import { FormEvent, useState } from 'react';
import { createClient, hasSupabasePublicEnv } from '@/lib/supabase/client';

export function LoginForm({
  labels,
}: {
  labels: {
    email: string;
    send: string;
    google: string;
    hint: string;
    magicSent: string;
    failed: string;
  };
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ready = hasSupabasePublicEnv();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!ready) {
      setMessage(labels.hint);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setMessage(error.message);
      else setMessage(labels.magicSent);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : labels.failed);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setMessage(null);
    if (!ready) {
      setMessage(labels.hint);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : labels.failed);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{labels.email}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink/15 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-plateau px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {labels.send}
        </button>
      </form>
      <button
        type="button"
        onClick={onGoogle}
        className="w-full rounded-full border border-ink/15 px-4 py-2.5 text-sm font-medium"
      >
        {labels.google}
      </button>
      <p className="text-xs text-ink/50">{labels.hint}</p>
      {message ? <p className="text-sm text-ink/70">{message}</p> : null}
    </div>
  );
}
