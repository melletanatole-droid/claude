/**
 * Le sitemap du site, construit depuis les modules de contenu.
 *
 * Il est servi dynamiquement par `src/server.ts` sur /sitemap.xml, et non écrit
 * dans public/ : le contenu vit dans des modules TypeScript versionnés, donc un
 * fichier statique serait périmé dès le prochain article.
 *
 * Ce qui est volontairement absent :
 * - `/ressources/*` : ces pages sont volontairement non référencées (voir le
 *   commentaire de `ressourceSlug` dans prompts.ts). On ne les promeut pas.
 * - `/academie` : page en construction.
 * - `/admin`, `/auth`, `/newsletter-assets` : hors périmètre public.
 */
import { BLOG_ARTICLES } from "./blog-articles";
import { PROMPTS } from "./prompts";
import { TUTORIELS } from "./tutoriels";

export const SITE_ORIGIN = "https://medicilline.ai";

type Entree = {
  path: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
};

/** Ramène une date du contenu à la forme AAAA-MM-JJ, ou rien si elle est inexploitable. */
function jourIso(valeur: string | undefined): string | undefined {
  if (!valeur) return undefined;
  const parse = new Date(valeur);
  if (Number.isNaN(parse.getTime())) return undefined;
  return parse.toISOString().slice(0, 10);
}

function echapper(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function entreesSitemap(): Entree[] {
  const derniereParution = jourIso(
    [...BLOG_ARTICLES].map((a) => a.publishedAt).sort().at(-1),
  );

  const entrees: Entree[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/blog", lastmod: derniereParution, changefreq: "daily", priority: "0.9" },
    { path: "/prompts", changefreq: "weekly", priority: "0.8" },
    { path: "/tutoriels", changefreq: "weekly", priority: "0.8" },
    { path: "/ia-minute", changefreq: "monthly", priority: "0.8" },
  ];

  for (const article of BLOG_ARTICLES) {
    entrees.push({
      path: `/blog/${article.slug}`,
      lastmod: jourIso(article.publishedAt),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  for (const prompt of PROMPTS) {
    entrees.push({
      path: `/prompts/${prompt.slug}`,
      lastmod: jourIso(prompt.updatedAt),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  for (const tutoriel of TUTORIELS) {
    entrees.push({
      path: `/tutoriels/${tutoriel.slug}`,
      lastmod: jourIso(tutoriel.capturedAt),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  return entrees;
}

export function rendreSitemap(): string {
  const urls = entreesSitemap()
    .map((entree) => {
      const lignes = [
        `    <loc>${echapper(`${SITE_ORIGIN}${entree.path}`)}</loc>`,
        entree.lastmod ? `    <lastmod>${entree.lastmod}</lastmod>` : undefined,
        `    <changefreq>${entree.changefreq}</changefreq>`,
        `    <priority>${entree.priority}</priority>`,
      ].filter(Boolean);
      return `  <url>\n${lignes.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function rendreRobots(): string {
  return [
    "# Médicilline — https://medicilline.ai",
    "# Les robots des moteurs et des IA sont les bienvenus : être lu, puis cité,",
    "# est l'objectif du site. Seules les zones privées sont fermées.",
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /auth",
    "Disallow: /newsletter-assets",
    "",
    "# Robots des IA, déclarés explicitement pour lever toute ambiguïté.",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Claude-Web",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: Applebot-Extended",
    "Allow: /",
    "",
    "User-agent: CCBot",
    "Allow: /",
    "",
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");
}
