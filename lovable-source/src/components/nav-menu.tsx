import { useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

import type { MobileNavItem } from "@/components/mobile-nav";

export type NavLink = {
  label: string;
  description?: string;
  to?: LinkProps["to"];
  href?: string;
  color: string;
};

export type NavGroup = {
  label: string;
  color: string;
  links: NavLink[];
};

/** Tous les accès du site, regroupés en sous-menus. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Collections & catalogue",
    color: "--purple",
    links: [
      {
        label: "IA Minute",
        description: "La collection qui explique l'IA médicale en couleur",
        href: "/#ia-minute",
        color: "--purple",
      },
      {
        label: "Digidoc 2030",
        description: "Les innovations qui changent la pratique",
        href: "/#digidocs-2030",
        color: "--blue",
      },

      {
        label: "Catalogue 2026",
        description: "Tous les titres de la maison",
        href: "/#catalogue",
        color: "--pink",
      },
    ],
  },
  {
    label: "Apprendre",
    color: "--yellow",
    links: [
      {
        label: "Banque de prompts",
        description: "Des prompts prêts à l'emploi pour la clinique",
        to: "/prompts",
        color: "--pink",
      },
      {
        label: "Tutoriels IA",
        description: "Prendre en main les outils pas à pas",
        to: "/tutoriels",
        color: "--yellow",
      },
      {
        label: "Académie",
        description: "Les formations Medicilline",
        to: "/academie",
        color: "--blue",
      },
    ],
  },
  {
    label: "Blog & newsletter",
    color: "--blue",
    links: [
      {
        label: "Blog",
        description: "Les nouveautés de l'IA médicale",
        to: "/blog",
        color: "--blue",
      },
      {
        label: "Newsletter",
        description: "Nos 3 newsletters IA médicale, chaque semaine",
        href: "/#newsletter",
        color: "--pink",
      },
    ],
  },
  {
    label: "La maison",
    color: "--orange",
    links: [
      {
        label: "Nous contacter",
        description: "Une question, une commande",
        href: "/#contact",
        color: "--orange",
      },
      {
        label: "Espace rédaction",
        description: "Accès équipe",
        to: "/auth",
        color: "--purple",
      },
    ],
  },
];

/** Liste à plat (avec intertitres) pour le menu mobile. */
export const NAV_MOBILE_ITEMS: MobileNavItem[] = [
  { label: "Accueil", to: "/", color: "--ink" },
  ...NAV_GROUPS.flatMap((group) =>
    group.links.map((link) => ({
      label: link.label,
      to: link.to,
      href: link.href,
      color: link.color,
    })),
  ),
  { label: "Nous contacter", href: "/#contact", color: "--orange", cta: true },
  { label: "Voir les livres", href: "/#catalogue", color: "--pink", cta: true },
];

function GroupMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 whitespace-nowrap rounded-full px-1 py-1 text-sm font-medium transition hover:opacity-80"
        style={{ color: open ? `var(${group.color})` : undefined }}
      >
        {group.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="rounded-2xl border-2 border-ink bg-[var(--cream)] p-2 chip-shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
            {group.links.map((link) => {
              const body = (
                <span className="block rounded-xl px-3 py-2 transition hover:bg-[var(--ink)]/5">
                  <span
                    className="block text-sm font-semibold"
                    style={{ color: `var(${link.color})` }}
                  >
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="mt-0.5 block text-xs text-[var(--ink)]/65">
                      {link.description}
                    </span>
                  )}
                </span>
              );
              return link.to ? (
                <Link key={link.label} to={link.to} onClick={() => setOpen(false)}>
                  {body}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
                  {body}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Navigation desktop à sous-menus : tout le site accessible en un clic. */
export function DesktopNav({ className = "" }: { className?: string }) {
  return (
    <nav className={`hidden items-center gap-6 md:flex ${className}`}>
      {NAV_GROUPS.map((group) => (
        <GroupMenu key={group.label} group={group} />
      ))}
    </nav>
  );
}

/** Bouton « Nous contacter » du header (desktop). */
export function ContactButton() {
  return (
    <a
      href="/#contact"
      className="hidden rounded-full border-2 border-ink bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--ink)] chip-shadow transition hover:-translate-y-0.5 md:inline-flex"
    >
      Nous contacter
    </a>
  );
}
