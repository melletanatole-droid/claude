import { useState } from "react";

import { useServerFn } from "@tanstack/react-start";

import { subscribeToNewsletter } from "@/lib/newsletter.functions";

const NEWSLETTER_TRACKS = [
  {
    id: "pratique",
    title: "Fiche pratique IA",
    freq: "Chaque semaine",
    desc: "Un outil concret, prompt prêt à l'emploi, ou workflow à implémenter en consultation.",
    color: "var(--pink)",
  },
  {
    id: "demain",
    title: "La médecine de demain",
    freq: "1× par semaine",
    desc: "Innovations, études et usages qui redessinent la pratique médicale.",
    color: "var(--blue)",
  },
  {
    id: "actu",
    title: "Actualité IA",
    freq: "1× par semaine",
    desc: "Le meilleur de l'actualité IA médicale, décrypté sans jargon.",
    color: "var(--purple)",
  },
];

const SLOGANS = [
  "Prenez une longueur d'avance sur tout le monde grâce à nos 3 newsletters.",
];

// `dense` : même bloc, sans la description sous chaque newsletter (accueil).
export function NewsletterForm({
  compact = false,
  dense = false,
}: {
  compact?: boolean;
  dense?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["pratique", "demain", "actu"]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const subscribe = useServerFn(subscribeToNewsletter);

  const activeSlogan = SLOGANS[0];
  const highlight = activeSlogan.includes("apprendre vite, bien, en couleur");
  const before = highlight
    ? activeSlogan.split("apprendre vite, bien, en couleur")[0]
    : activeSlogan;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setState("error");
      setMessage("Adresse email invalide.");
      return;
    }
    if (selected.length === 0) {
      setState("error");
      setMessage("Sélectionne au moins une newsletter.");
      return;
    }
    setState("loading");
    let ok = false;
    try {
      const result = await subscribe({ data: { email: value, tracks: selected } });
      ok = result.ok;
    } catch (e) {
      console.error("newsletter subscription failed", e);
    }
    if (!ok) {
      setState("error");
      setMessage("Inscription impossible pour le moment.");
      return;
    }
    setState("done");
    const count = selected.length;
    setMessage(
      `C'est fait — tu recevras ${count === 1 ? "cette newsletter" : "ces " + count + " newsletters"} chaque semaine. Un email de confirmation vient de partir.`
    );
    setEmail("");
  }

  return (
    <div
      className={
        compact
          ? ""
          : "rounded-[1.5rem] border-2 border-ink bg-[linear-gradient(135deg,var(--pink),var(--purple),var(--blue))] gradient-pan p-3 chip-shadow-lg sm:rounded-[2rem] sm:p-5"
      }
    >
      {!compact && (
        <>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="font-display text-xl text-white sm:text-3xl">
              La newsletter IA médicale
            </h2>
            <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] sm:px-3 sm:py-1 sm:text-xs">
              + l&apos;actu IA en 1 minute
            </span>
          </div>
          <p className="mt-2 max-w-2xl font-display text-base leading-snug text-white sm:text-xl">
            {highlight ? (
              <span>
                {before}
                apprendre vite, bien,{" "}
                <span className="relative inline-block italic text-[var(--yellow)]">
                  <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded-full bg-[var(--yellow)] opacity-40" />
                  <span className="relative">en couleur</span>
                </span>
                .
              </span>
            ) : (
              <span>{activeSlogan}</span>
            )}
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            {NEWSLETTER_TRACKS.map((t) => {
              const checked = selected.includes(t.id);
              return (
                <label
                  key={t.id}
                  className={`relative grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-2 rounded-xl border-2 p-2.5 transition duration-300 sm:block sm:rounded-2xl sm:p-3 ${
                    checked
                      ? "border-ink bg-white text-[var(--ink)] chip-shadow -translate-y-1"
                      : "border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={() => toggle(t.id)}
                  />
                   <div className="contents sm:flex sm:flex-wrap sm:items-start sm:justify-between sm:gap-2">
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-ink transition"
                      style={{ background: checked ? t.color : "transparent" }}
                    >
                      {checked && (
                        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                     <span className="col-start-3 row-start-1 max-w-full truncate rounded-full border-2 border-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--ink)] sm:text-[10px]" style={{ background: t.color }}>
                      {t.freq}
                    </span>
                  </div>

                   <p className="col-start-2 row-start-1 font-display text-base sm:mt-2 sm:text-lg">{t.title}</p>
                   {!dense && (
                     <p className="col-span-3 mt-1 text-xs leading-snug opacity-80 sm:text-sm">{t.desc}</p>
                   )}
                </label>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSelected(["pratique", "demain", "actu"])}
              className="text-sm font-semibold text-white underline decoration-2 underline-offset-4 hover:text-[var(--yellow)]"
            >
              Tout sélectionner
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm font-semibold text-white/80 hover:text-white"
            >
              Tout désélectionner
            </button>
          </div>
        </>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.fr"
          className="min-h-11 flex-1 rounded-full border-2 border-ink bg-white px-5 py-2 text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--yellow)]"
          aria-label="Adresse email"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="min-h-11 rounded-full border-2 border-ink bg-[var(--yellow)] px-6 py-2 font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "loading" ? "…" : "Je m'inscris"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            compact
              ? state === "error"
                ? "text-[var(--pink)]"
                : "text-[var(--ink)]/70"
              : "text-white"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
