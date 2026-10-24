/**
 * Les blocs JSON-LD du site.
 *
 * Objectif : cohérence d'entité. Les moteurs et les IA associent un nom, une
 * catégorie et une description à un domaine quand ils les retrouvent identiques
 * partout. Les valeurs ci-dessous reprennent donc mot pour mot la copy du site
 * et le profil GEO ; les changer ici sans les changer là-bas casse le signal.
 */
import type { BlogArticle } from "./blog-articles";
import { SITE_ORIGIN } from "./sitemap";

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

/** L'éditeur, au niveau du site. Rendu sur toutes les pages. */
export function organizationJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Medicilline",
    alternateName: "Médicilline, éditions médicales",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/favicon.png`,
    description:
      "Medicilline publie depuis 2005 des ouvrages médicaux et paramédicaux pédagogiques pour étudiants et soignants : ECNi, internat, infirmier, mémos, protocoles.",
    slogan: "Éditions médicales qui réveillent la médecine",
    address: {
      "@type": "PostalAddress",
      streetAddress: "599 rue de la Nivelle",
      postalCode: "45200",
      addressLocality: "Amilly",
      addressCountry: "FR",
    },
    founder: [
      { "@type": "Person", name: "Dr Guillaume Zagury" },
      { "@type": "Person", name: "Dr Frédérick Georget" },
    ],
    knowsAbout: [
      "intelligence artificielle en médecine",
      "édition médicale",
      "préparation ECNi",
      "formation médicale continue",
    ],
  });
}

/** Un article du blog. Le champ `author` reste la maison tant qu'il n'y a pas de page auteur. */
export function blogPostingJsonLd(article: BlogArticle): string {
  const url = `${SITE_ORIGIN}/blog/${article.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_ORIGIN}${article.cover.src}`,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "fr-FR",
    author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Medicilline" },
    publisher: { "@id": ORGANIZATION_ID },
    citation: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.label,
      url: source.url,
    })),
  });
}
