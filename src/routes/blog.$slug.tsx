import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Creative Muse Journal` }],
  }),
  component: () => {
    const { slug } = Route.useParams();
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    return (
      <PageShell>
        <article className="mx-auto max-w-[760px] px-6 py-20">
          <Link to="/blog" className="text-[11px] font-semibold tracking-[0.18em] text-[#9C544D] uppercase">
            ← Back to Journal
          </Link>
          <h1 className="font-display mt-4 text-[40px] leading-tight font-bold text-[#1a1a2e]">
            {title}
          </h1>
          <p className="mt-3 text-xs tracking-[0.18em] text-[#7a6e64] uppercase">June 28, 2026 · 4 min read</p>
          <div className="my-8 flex aspect-[16/9] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#fdf2e0] to-[#c9a96e] text-[100px]">
            ✨
          </div>
          <div className="prose prose-lg space-y-5 text-[16px] leading-[1.8] text-[#3a3028]">
            <p>This is a placeholder article body. In production, your editorial team would compose long-form essays on craftsmanship, gem origin stories, bridal styling and atelier news.</p>
            <p>Creative Muse believes content should feel as considered as the jewellery itself — written slowly, illustrated beautifully, and worth saving.</p>
            <p>Stay tuned for our next piece, where we sit down with our master goldsmith to talk about the lost art of granulation.</p>
          </div>
        </article>
      </PageShell>
    );
  },
});
