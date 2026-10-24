import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace rédaction — Medicilline" },
      {
        name: "description",
        content:
          "Connexion à l'espace rédaction Medicilline pour écrire et publier les articles du blog IA médicale.",
      },
      { property: "og:title", content: "Espace rédaction — Medicilline" },
      {
        property: "og:description",
        content: "Connexion à l'espace rédaction du blog Medicilline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    navigate({ to: "/admin" });
  }

  async function google() {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Connexion Google indisponible.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-[2rem] border-2 border-ink bg-card p-8 chip-shadow-lg">
          <h1 className="font-display text-3xl">Espace rédaction</h1>
          <p className="mt-2 text-sm text-[var(--ink)]/70">
            Accès sur invitation uniquement.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border-2 border-ink bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--yellow)]"
            />
            <input
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe (8 caractères min.)"
              className="w-full rounded-xl border-2 border-ink bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--yellow)]"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full border-2 border-ink bg-[var(--pink)] px-6 py-3 font-semibold text-white chip-shadow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "…" : "Se connecter"}
            </button>
          </form>

          <button
            onClick={google}
            className="mt-3 w-full rounded-full border-2 border-ink bg-white px-6 py-3 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-0.5"
          >
            Continuer avec Google
          </button>

          {error && <p className="mt-4 text-sm font-medium text-[var(--pink)]">{error}</p>}

          <div className="mt-6 border-t border-ink/10 pt-4 text-sm">
            <Link to="/blog" className="text-[var(--blue)] hover:underline">
              ← Retour au blog
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
