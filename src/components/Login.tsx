"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
      <div className="w-full rounded-xl border border-line bg-panel p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Budget</h1>
        <p className="mt-1 text-sm text-mute">Sign in with a magic link to continue.</p>

        {sent ? (
          <p className="mt-6 rounded-md border border-good/40 bg-good/10 px-4 py-3 text-sm text-good">
            Check your inbox for a sign-in link.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-mute">
                Email
              </span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-base outline-none focus:border-accent"
              />
            </label>
            {error && (
              <div className="rounded-md border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={busy || !email}
              className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
