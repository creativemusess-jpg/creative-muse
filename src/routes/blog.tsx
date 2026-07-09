import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

const POSTS = [
  { slug: "how-to-care-for-gold", title: "How to Care for Your Gold Jewellery", excerpt: "Simple rituals to keep your pieces glowing for generations.", emoji: "✨", bg: "from-[#fdf2e0] to-[#c9a96e]" },
  { slug: "choosing-bridal-set", title: "Choosing the Perfect Bridal Set", excerpt: "A bride's guide to building a lifetime collection.", emoji: "👑", bg: "from-[#fdf0e0] to-[#a87038]" },
  { slug: "diamond-4cs", title: "The 4Cs of Diamonds, Demystified", excerpt: "Cut, colour, clarity, carat — what actually matters.", emoji: "💎", bg: "from-[#f0f4f8] to-[#cdd8e6]" },
  { slug: "polki-vs-kundan", title: "Polki vs Kundan: A Closer Look", excerpt: "Two royal traditions, one timeless aesthetic.", emoji: "📿", bg: "from-[#fdf2e0] to-[#8b1a4a]" },
];

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog — Creative Muse Journal" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Journal" title="The Creative Muse Journal" subtitle="Stories, guides and conversations from our atelier." />
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-[28px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            >
              <div className={`flex aspect-[5/3] items-center justify-center bg-gradient-to-br text-[80px] ${p.bg}`}>
                {p.emoji}
              </div>
              <div className="p-6">
                <p className="eyebrow text-[10px]">Journal</p>
                <h3 className="font-display mt-2 text-lg font-semibold text-[#1a1a2e] transition-colors group-hover:text-[#C9A96E]">{p.title}</h3>
                <p className="mt-2 text-sm text-[#7a6e64]">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
