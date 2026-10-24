import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  NEWSLETTER_ASSETS,
  NEWSLETTER_ASSET_GROUPS,
  type NewsletterAsset,
} from "@/lib/newsletter-assets";

export const Route = createFileRoute("/newsletter-assets")({
  head: () => ({
    meta: [
      { title: "Assets newsletter — liens HTTPS | Medicilline" },
      { name: "description", content: "Bibliothèque des visuels et documents des newsletters Medicilline." },
      { property: "og:title", content: "Visuels newsletter — Medicilline" },
      { property: "og:description", content: "Bibliothèque des visuels et documents des newsletters Medicilline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewsletterAssetsPage,
});

const STORAGE_KEY = "medicilline:newsletter-assets-base";
const FOLDER = "/newsletter-assets";

/** Enlève le slash final pour que base + path ne produise jamais de double slash. */
function normalizeBase(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function fullUrl(base: string, asset: NewsletterAsset) {
  return `${normalizeBase(base)}${asset.path}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Repli pour les contextes sans permission clipboard (http, iframe).
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(id);
  }

  return { copied, copy };
}

function emailTag(url: string, asset: NewsletterAsset) {
  if (asset.type === "video") {
    const poster = url.replace(/\.[^.]+$/, "-poster.jpg");
    return `<a href="${url}"><img src="${poster}" alt="${asset.label}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></a>`;
  }
  return `<img src="${url}" alt="${asset.label}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />`;
}

function NewsletterAssetsPage() {
  const [base, setBase] = useState("");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const { copied, copy } = useCopy();

  // Origine réelle côté client : ouverte sur le site en ligne, la page donne
  // directement les bonnes URLs sans rien configurer.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setBase(saved ?? window.location.origin);
  }, []);

  useEffect(() => {
    if (base) localStorage.setItem(STORAGE_KEY, base);
  }, [base]);

  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(normalizeBase(base));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NEWSLETTER_ASSETS.filter(
      (a) =>
        (group === "all" || a.group === group) &&
        (q === "" || a.name.toLowerCase().includes(q) || a.label.toLowerCase().includes(q)),
    );
  }, [query, group]);

  const groups = NEWSLETTER_ASSET_GROUPS.filter((g) => visible.some((a) => a.group === g.id));

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Interne · non indexé
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Assets newsletter — liens HTTPS
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Les fichiers de <code className="rounded bg-muted px-1 py-0.5">public{FOLDER}/</code>{" "}
            sont servis tels quels par le site. Choisissez le domaine, copiez l&apos;URL et
            collez-la dans le HTML de la newsletter.
          </p>
        </header>

        <section className="mb-8 rounded-xl border border-border bg-card p-5">
          <label htmlFor="base" className="block text-sm font-medium text-card-foreground">
            Domaine de base
          </label>
          <input
            id="base"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="https://mon-domaine.fr"
            spellCheck={false}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBase(window.location.origin)}
              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              Origine actuelle
            </button>
            <button
              type="button"
              onClick={() => setBase("https://medicilline.fr")}
              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              medicilline.fr
            </button>
          </div>

          {isLocal && (
            <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
              Domaine local : ces URLs ne s&apos;afficheront pas dans une boîte mail. Commitez{" "}
              <code>public{FOLDER}/</code>, déployez, puis remplacez le domaine ci-dessus par celui
              du site en ligne. Le dépôt GitHub étant privé, les liens{" "}
              <code>raw.githubusercontent.com</code> ne fonctionnent pas non plus en e-mail.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy("all", visible.map((a) => fullUrl(base, a)).join("\n"))}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copied === "all" ? "Copié ✓" : `Copier les ${visible.length} URLs`}
            </button>
            <button
              type="button"
              onClick={() =>
                copy(
                  "json",
                  JSON.stringify(
                    Object.fromEntries(visible.map((a) => [a.name, fullUrl(base, a)])),
                    null,
                    2,
                  ),
                )
              }
              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              {copied === "json" ? "Copié ✓" : "Copier en JSON"}
            </button>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer par nom…"
            className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => setGroup("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              group === "all"
                ? "bg-foreground text-background"
                : "border border-input hover:bg-accent"
            }`}
          >
            Tout
          </button>
          {NEWSLETTER_ASSET_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                group === g.id
                  ? "bg-foreground text-background"
                  : "border border-input hover:bg-accent"
              }`}
            >
              {g.label}
            </button>
          ))}
        </section>

        {groups.map((g) => (
          <section key={g.id} className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {g.label}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {visible
                .filter((a) => a.group === g.id)
                .map((asset) => {
                  const url = fullUrl(base, asset);
                  return (
                    <li
                      key={asset.name}
                      className="overflow-hidden rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-center bg-muted p-3">
                        {asset.type === "video" ? (
                          <video
                            src={asset.path}
                            controls
                            preload="metadata"
                            className="max-h-44 w-full rounded"
                          />
                        ) : (
                          <img
                            src={asset.path}
                            alt={asset.label}
                            loading="lazy"
                            className="max-h-44 w-auto max-w-full rounded object-contain"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold">{asset.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {asset.name} · {formatBytes(asset.bytes)}
                        </p>
                        <p className="mt-3 break-all rounded bg-muted px-2 py-1.5 font-mono text-[11px] leading-relaxed">
                          {url}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => copy(asset.name, url)}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            {copied === asset.name ? "Copié ✓" : "Copier l'URL"}
                          </button>
                          <button
                            type="button"
                            onClick={() => copy(`${asset.name}:tag`, emailTag(url, asset))}
                            className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                          >
                            {copied === `${asset.name}:tag` ? "Copié ✓" : "Copier la balise"}
                          </button>
                          <a
                            href={asset.path}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                          >
                            Ouvrir
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun asset ne correspond au filtre.</p>
        )}

        <footer className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          Ajouter un visuel : déposer le fichier dans{" "}
          <code className="rounded bg-muted px-1 py-0.5">public{FOLDER}/</code> puis lancer{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            node scripts/gen-newsletter-assets.mjs
          </code>
          .
        </footer>
      </div>
    </main>
  );
}
