import type { ReactNode } from "react";

/**
 * Bandeau des IA décryptées dans les ouvrages Medicilline.
 * Les marques sont des SVG inline (aucun asset externe, aucun appel réseau).
 */

type AiBrand = {
  name: string;
  tint: string;
  mark: ReactNode;
};

const svgProps = {
  viewBox: "0 0 24 24",
  className: "h-5 w-5 shrink-0",
  "aria-hidden": true,
} as const;

// Rayons du burst Claude : 10 branches réparties sur 360°.
const CLAUDE_RAYS = Array.from({ length: 10 }, (_, i) => {
  const a = (i * 36 * Math.PI) / 180;
  const len = i % 2 === 0 ? 9 : 6.6;
  return {
    x: +(12 + len * Math.cos(a)).toFixed(2),
    y: +(12 + len * Math.sin(a)).toFixed(2),
  };
});

// Tuiles Mistral : grille 5x5, une couleur de la charte par ligne.
const MISTRAL_ROWS = ["11111", "10101", "11111", "10101", "11111"];
const MISTRAL_COLORS = [
  "var(--yellow)",
  "var(--orange)",
  "var(--pink)",
  "var(--purple)",
  "var(--blue)",
];

const BRANDS: AiBrand[] = [
  {
    name: "OpenAI",
    tint: "var(--ink)",
    mark: (
      <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 2.6 20.1 7.3v9.4L12 21.4 3.9 16.7V7.3L12 2.6Z" />
        <path d="M12 7.1v9.8M12 12 3.9 7.3M12 12l8.1-4.7" />
      </svg>
    ),
  },
  {
    name: "Claude",
    tint: "var(--orange)",
    mark: (
      <svg {...svgProps} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        {CLAUDE_RAYS.map((r, i) => (
          <line key={i} x1="12" y1="12" x2={r.x} y2={r.y} />
        ))}
      </svg>
    ),
  },
  {
    name: "Gemini",
    tint: "var(--blue)",
    mark: (
      <svg {...svgProps} fill="currentColor">
        <path d="M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.7-10 10-.7-5.3-4.7-9.3-10-10 5.3-.7 9.3-4.7 10-10Z" />
      </svg>
    ),
  },
  {
    name: "Mistral AI",
    tint: "var(--ink)",
    mark: (
      <svg {...svgProps}>
        {MISTRAL_ROWS.map((row, y) =>
          row.split("").map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={2 + x * 4}
                y={2 + y * 4}
                width="3.4"
                height="3.4"
                fill={MISTRAL_COLORS[y]}
              />
            ) : null,
          ),
        )}
      </svg>
    ),
  },
  {
    name: "Copilot",
    tint: "var(--purple)",
    mark: (
      <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M3.5 13.8c0-3.9 2.6-6.8 6.1-6.8 2.9 0 4.2 1.9 5 4.4.6 1.9 1.2 2.9 2.3 2.9 1.2 0 2-1 2-2.4" />
        <path d="M20.5 10.2c0 3.9-2.6 6.8-6.1 6.8-2.9 0-4.2-1.9-5-4.4-.6-1.9-1.2-2.9-2.3-2.9-1.2 0-2 1-2 2.4" />
      </svg>
    ),
  },
  {
    name: "Llama",
    tint: "var(--blue)",
    mark: (
      <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <path d="M4 12c0-2.8 1.6-4.8 3.7-4.8 3.5 0 5 9.6 8.5 9.6 2.1 0 3.8-2 3.8-4.8s-1.7-4.8-3.8-4.8c-3.5 0-5 9.6-8.5 9.6C5.6 16.8 4 14.8 4 12Z" />
      </svg>
    ),
  },
  {
    name: "Hugging Face",
    tint: "var(--yellow)",
    mark: (
      <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="6.6" />
        <circle cx="9.7" cy="10.6" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.3" cy="10.6" r="1" fill="currentColor" stroke="none" />
        <path d="M9.2 14.1c.8 1.2 1.7 1.8 2.8 1.8s2-.6 2.8-1.8" />
        <path d="M5.1 12.6c-1.1.6-1.7 1.6-1.3 2.4.4.8 1.6.9 2.7.4" />
        <path d="M18.9 12.6c1.1.6 1.7 1.6 1.3 2.4-.4.8-1.6.9-2.7.4" />
      </svg>
    ),
  },
  {
    name: "Perplexity",
    tint: "var(--pink)",
    mark: (
      <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 4.2v15.6" />
        <path d="M12 9 5.6 4.2v5.5H3.2v6.6h2.4v3.5L12 15" />
        <path d="M12 9l6.4-4.8v5.5h2.4v6.6h-2.4v3.5L12 15" />
      </svg>
    ),
  },
];

function BrandChip({ brand }: { brand: AiBrand }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-1.5 chip-shadow transition motion-safe:hover:-translate-y-0.5">
      <span style={{ color: brand.tint }}>{brand.mark}</span>
      <span className="whitespace-nowrap font-display text-sm font-bold tracking-normal">
        {brand.name}
      </span>
    </div>
  );
}

function BrandRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 px-1 pb-1">
      {BRANDS.map((b) => (
        <BrandChip key={b.name} brand={b} />
      ))}
    </div>
  );
}

export function AiLogosBanner() {
  return (
    <section
      aria-label="Les intelligences artificielles décryptées dans nos ouvrages"
      className="border-y-2 border-ink bg-card py-4"
    >
      <div className="mx-auto max-w-7xl px-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider chip-shadow">
          <span className="h-2 w-2 shrink-0 rounded-full bg-pink" />
          Les IA décryptées dans nos ouvrages
        </span>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-ink/70">
          Nos auteurs testent, comparent et documentent les outils que vous
          utiliserez au cabinet — cas d&apos;usage, limites et prompts prêts à l&apos;emploi.
        </p>
      </div>

      <div className="mx-auto mt-4 max-w-7xl px-5">
          <BrandRow />
      </div>
    </section>
  );
}
