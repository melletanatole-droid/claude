import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, type LinkProps } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export type MobileNavItem = {
  label: string;
  /** Lien interne (router) */
  to?: LinkProps["to"];
  /** Lien ancre ou externe */
  href?: string;
  /** Couleur d'accent au survol, ex: "--pink" */
  color?: string;
  /** Affiché en bouton plein plutôt qu'en lien simple */
  cta?: boolean;
};

/**
 * Menu hamburger affiché uniquement en dessous du breakpoint md.
 * Le bouton reste dans le flux du header, le panneau se déploie juste dessous.
 */
export function MobileNav({
  items,
  className = "",
}: {
  items: MobileNavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Le panneau ne concerne que le mobile : on referme si on repasse en desktop.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Pas de scroll de fond quand le menu est ouvert.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    // Libéré tout de suite : sinon le verrou empêche le saut vers l'ancre du lien cliqué.
    document.body.style.overflow = "";
    setOpen(false);
  };

  return (
    <div className={`md:hidden ${className}`}>
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-[var(--cream)] text-[var(--ink)] chip-shadow transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open &&
        createPortal(
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={close}
              className="fixed inset-0 z-30 cursor-default bg-[var(--ink)]/25 backdrop-blur-[2px] animate-in fade-in duration-200"
            />
            <nav
              id="mobile-nav-panel"
              className="fixed inset-y-0 right-0 z-40 flex w-[min(78vw,17rem)] flex-col gap-1 overflow-y-auto border-l-2 border-ink bg-[var(--cream)] p-5 pt-20 chip-shadow-lg animate-in slide-in-from-right duration-300 ease-out"
            >
              <ul className="flex flex-col gap-1">
                {items.map((item) => {
                  const accent = item.color ? `var(${item.color})` : "var(--pink)";
                  const base =
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.95rem] font-semibold transition";
                  const content = item.cta ? (
                    <span
                      className="mt-2 block rounded-full border-2 border-ink px-4 py-2.5 text-center text-sm font-semibold text-white chip-shadow"
                      style={{ backgroundColor: accent }}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <span className={`${base} hover:bg-[var(--ink)]/5`}>
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      <span style={{ color: accent }}>{item.label}</span>
                    </span>
                  );

                  return (
                    <li key={item.label}>
                      {item.to ? (
                        <Link to={item.to} onClick={close}>
                          {content}
                        </Link>
                      ) : (
                        <a href={item.href} onClick={close}>
                          {content}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>,
          document.body,
        )}
    </div>
  );
}
