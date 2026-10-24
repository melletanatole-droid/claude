// Regenerates src/lib/newsletter-assets.ts from the files present in
// public/newsletter-assets/. Run after dropping new files in that folder:
//   node scripts/gen-newsletter-assets.mjs
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "newsletter-assets");
const out = join(root, "src", "lib", "newsletter-assets.ts");

const VIDEO = new Set([".mp4", ".webm", ".mov"]);
const IMAGE = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"]);

const GROUPS = [
  { id: "actu", label: "Actualité IA", match: (n) => n.startsWith("actu-") },
  { id: "demain", label: "La médecine de demain", match: (n) => n.startsWith("demain-") },
  { id: "pratique", label: "Fiche pratique IA", match: (n) => n.startsWith("pratique-") },
  { id: "commun", label: "Éléments communs (logo, icônes, defaults)", match: () => true },
];

const KIND_LABELS = {
  photo: "Photo d'illustration",
  schema: "Schéma",
  kpi: "Chiffres clés",
  graphique: "Graphique de données",
  publications: "Courbe publications",
  poster: "Poster vidéo",
};

function label(name) {
  const base = name.replace(/\.[^.]+$/, "");
  const suffix = base.split("-").pop();
  if (KIND_LABELS[suffix]) return KIND_LABELS[suffix];
  if (VIDEO.has(extname(name).toLowerCase())) return "Vidéo";
  return base.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

const files = readdirSync(dir)
  .filter((n) => !n.startsWith(".") && n !== "manifest.json")
  .filter((n) => VIDEO.has(extname(n).toLowerCase()) || IMAGE.has(extname(n).toLowerCase()))
  .sort();

const assets = files.map((name) => {
  const ext = extname(name).toLowerCase();
  const group = GROUPS.find((g) => g.match(name));
  return {
    name,
    path: `/newsletter-assets/${name}`,
    type: VIDEO.has(ext) ? "video" : "image",
    bytes: statSync(join(dir, name)).size,
    group: group.id,
    label: label(name),
  };
});

const body = `// GÉNÉRÉ — ne pas éditer à la main.
// Source : public/newsletter-assets/ · régénérer avec \`node scripts/gen-newsletter-assets.mjs\`

export type NewsletterAsset = {
  name: string;
  path: string;
  type: "image" | "video";
  bytes: number;
  group: string;
  label: string;
};

export const NEWSLETTER_ASSET_GROUPS: { id: string; label: string }[] = ${JSON.stringify(
  GROUPS.map(({ id, label }) => ({ id, label })),
  null,
  2,
)};

export const NEWSLETTER_ASSETS: NewsletterAsset[] = ${JSON.stringify(assets, null, 2)};
`;

writeFileSync(out, body, "utf8");
console.log(`${assets.length} assets → src/lib/newsletter-assets.ts`);
