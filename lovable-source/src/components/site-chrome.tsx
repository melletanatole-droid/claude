import { Link } from "@tanstack/react-router";

import logoAsset from "@/assets/logo_v3.png.asset.json";
import { MobileNav } from "@/components/mobile-nav";
import { ContactButton, DesktopNav, NAV_MOBILE_ITEMS } from "@/components/nav-menu";

export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-[var(--cream)]/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="Medicilline" className="h-10 w-auto" />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <DesktopNav />
          <ContactButton />
          {right}
        </div>
        <div className="flex items-center gap-3 md:hidden">
          {right}
          <MobileNav items={NAV_MOBILE_ITEMS} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-[var(--cream)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-[var(--ink)]/70 md:flex-row">
        <span>Medicilline · Éditions médicales · depuis 2005</span>
        <div className="flex items-center gap-5">
          <Link to="/blog" className="hover:text-[var(--pink)]">
            Blog
          </Link>
          <Link to="/prompts" className="hover:text-[var(--pink)]">
            Prompts
          </Link>
          <Link to="/tutoriels" className="hover:text-[var(--blue)]">
            Tutoriels
          </Link>
          <Link to="/academie" className="hover:text-[var(--blue)]">
            Académie
          </Link>
          <Link to="/auth" className="hover:text-[var(--purple)]">
            Espace rédaction
          </Link>
        </div>
      </div>
    </footer>
  );
}
