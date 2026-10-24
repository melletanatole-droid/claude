import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { getBlogArticle, type BlogArticle, type BlogBlock } from "@/lib/blog-articles";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { blogPostingJsonLd } from "@/lib/structured-data";
import { CATEGORY_LABELS } from "./blog.index";

const SITE_ORIGIN = "https://medicilline.ai";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const article = getBlogArticle(params.slug);
    if (article) {
      const title = `${article.title} — Blog Medicilline`;
      const image = `${SITE_ORIGIN}${article.cover.src}`;
      return {
        meta: [
          { title },
          { name: "description", content: article.excerpt },
          { property: "og:title", content: title },
          { property: "og:description", content: article.excerpt },
          { property: "og:type", content: "article" },
          { property: "og:image", content: image },
          { property: "og:url", content: `${SITE_ORIGIN}/blog/${article.slug}` },
          { property: "article:published_time", content: article.publishedAt },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: image },
        ],
        scripts: [
          { type: "application/ld+json", children: blogPostingJsonLd(article) },
        ],
      };
    }
    return {
      meta: [
        { title: `${params.slug.replace(/-/g, " ")} — Blog Medicilline` },
        {
          name: "description",
          content:
            "Article du blog Medicilline sur les nouveautés de l'intelligence artificielle en médecine.",
        },
        { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Blog Medicilline` },
        {
          property: "og:description",
          content: "Article du blog Medicilline sur les nouveautés de l'IA médicale.",
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PostPage,
});

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CategoryChip({ category }: { category: string }) {
  return (
    <span className="rounded-full border-2 border-ink bg-[var(--yellow)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Article éditorial : blocs typés, figures, sources                    */
/* ------------------------------------------------------------------ */

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-lg leading-relaxed text-[var(--ink)]/85">{block.text}</p>;
    case "h2":
      return (
        <h2 className="pt-4 font-display text-2xl font-black leading-tight md:text-3xl">
          {block.text}
        </h2>
      );
    case "figure":
      return (
        <figure className="my-2">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-3xl border-2 border-ink bg-white chip-shadow"
          />
          {block.caption ? (
            <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--ink)]/55">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-[var(--ink)]/85">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="rounded-3xl border-2 border-ink bg-[var(--yellow)] p-6 chip-shadow">
          <p className="text-xs font-bold uppercase tracking-widest">{block.title}</p>
          <ul className="mt-3 space-y-2 text-base leading-relaxed">
            {block.items.map((it) => (
              <li key={it} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--ink)]" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </aside>
      );
    case "link":
      return (
        <p>
          <Link
            to={block.to}
            className="inline-block rounded-full border-2 border-ink bg-[var(--pink)] px-5 py-3 text-sm font-semibold text-white chip-shadow transition hover:-translate-y-0.5"
          >
            {block.label}
          </Link>
        </p>
      );
    default:
      return null;
  }
}

function EditorialArticle({ article }: { article: BlogArticle }) {
  return (
    <article className="fade-in-pop mt-8">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryChip category={article.category} />
        <span className="text-xs uppercase tracking-widest text-[var(--ink)]/50">
          {article.readingMinutes} min de lecture
        </span>
      </div>
      <h1 className="mt-5 font-display text-4xl font-black leading-tight md:text-5xl">
        {article.title}
      </h1>
      <p className="mt-3 text-sm uppercase tracking-widest text-[var(--ink)]/50">
        {formatDate(article.publishedAt)} · La rédaction Médicilline
      </p>
      <p className="mt-6 text-lg text-[var(--ink)]/75">{article.excerpt}</p>

      <figure className="mt-8">
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          width={1200}
          height={675}
          className="w-full rounded-3xl border-2 border-ink object-cover chip-shadow"
        />
        <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--ink)]/55">
          {article.cover.credit}
        </figcaption>
      </figure>

      <div className="mt-8 space-y-6">
        {article.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      <section className="mt-12 rounded-3xl border-2 border-ink bg-white p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--purple)]">
          Sources
        </h2>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--ink)]/80">
          {article.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-[var(--purple)] hover:underline"
              >
                {s.label}
              </a>
              <span className="text-[var(--ink)]/55"> — {s.date}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink)]/55">
          Les visuels de données et de méthode sont produits par Médicilline à partir des sources
          ci-dessus ; chacun porte sa source et sa limite d&apos;interprétation. Les photographies
          proviennent de Pexels, créditées sous l&apos;image.
        </p>
      </section>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Billet rédigé depuis /admin (table Supabase `posts`)                 */
/* ------------------------------------------------------------------ */

function SupabasePost({ slug }: { slug: string }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, content, cover_url, category, published_at, published")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="mt-10 text-[var(--ink)]/60">Chargement…</p>;

  if (!post) {
    return (
      <div className="mt-10 rounded-2xl border-2 border-dashed border-ink/30 p-8">
        <h1 className="font-display text-3xl">Article introuvable</h1>
        <p className="mt-2 text-[var(--ink)]/70">
          Cet article n&apos;existe pas ou n&apos;est pas encore publié.
        </p>
      </div>
    );
  }

  return (
    <article className="fade-in-pop mt-8">
      <CategoryChip category={post.category} />
      {!post.published && (
        <span className="ml-2 rounded-full border-2 border-ink bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
          Brouillon
        </span>
      )}
      <h1 className="mt-5 font-display text-4xl font-black leading-tight md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm uppercase tracking-widest text-[var(--ink)]/50">
        {formatDate(post.published_at) ?? "Non publié"}
      </p>
      {post.excerpt && <p className="mt-6 text-lg text-[var(--ink)]/75">{post.excerpt}</p>}
      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="mt-8 w-full rounded-3xl border-2 border-ink object-cover chip-shadow"
        />
      )}
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--ink)]/85">
        {post.content.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const article = getBlogArticle(slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pt-12">
        <Link to="/blog" className="text-sm font-semibold text-[var(--purple)] hover:underline">
          ← Tous les articles
        </Link>

        {article ? <EditorialArticle article={article} /> : <SupabasePost slug={slug} />}

        <section className="mt-16">
          <NewsletterForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
