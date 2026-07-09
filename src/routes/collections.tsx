import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

const COLLECTIONS = [
  { slug: "bridal", name: "Bridal Edit", count: "120 pieces", emoji: "👑", bg: "from-[#fdf2e0] via-[#e8c0a0] to-[#8b1a4a]" },
  { slug: "solitaires", name: "Solitaire Story", count: "48 pieces", emoji: "💎", bg: "from-[#f0f4f8] via-[#e2eaf2] to-[#cdd8e6]" },
  { slug: "everyday", name: "Everyday Elegance", count: "210 pieces", emoji: "✨", bg: "from-[#fdf8f3] via-[#f5e8d0] to-[#e8c98a]" },
  { slug: "festive", name: "Festive Heirlooms", count: "85 pieces", emoji: "📿", bg: "from-[#fdf2e0] via-[#f0d8a8] to-[#c9a96e]" },
  { slug: "men", name: "For Him", count: "62 pieces", emoji: "🔮", bg: "from-[#f0f0f0] via-[#d0d0d0] to-[#7a7a7a]" },
  { slug: "gifting", name: "The Gift Edit", count: "95 pieces", emoji: "🎁", bg: "from-[#fdf0e8] via-[#f0c8b0] to-[#a85040]" },
];

export const Route = createFileRoute("/collections")({
  head: () => ({ meta: [{ title: "Collections — Creative Muse" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Edits" title="Our Collections" subtitle="Curated journeys through the Creative Muse archive." />
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.bg}`} />
              <div className="absolute inset-0 flex items-center justify-center text-[140px] transition-transform duration-700 group-hover:scale-110">
                {c.emoji}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-white">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#E8C98A] uppercase">{c.count}</p>
                <h3 className="font-display mt-1 text-2xl font-semibold">{c.name}</h3>
                <p className="mt-2 inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
