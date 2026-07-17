import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import prodPolki from "@/assets/prod-polki-choker.jpg";
import prodAarav from "@/assets/prod-aarav-ring.jpg";
import prodLuna from "@/assets/prod-luna-pendant.jpg";
import prodPriya from "@/assets/prod-priya-necklace.jpg";
import prodSerene from "@/assets/prod-serene-bracelet.jpg";
import prodJhumka from "@/assets/prod-jhumka.jpg";

const COLLECTIONS = [
  { slug: "bridal", name: "Bridal Edit", image: prodPolki },
  { slug: "solitaires", name: "Solitaire Story", image: prodAarav },
  { slug: "everyday", name: "Everyday Elegance", image: prodLuna },
  { slug: "festive", name: "Festive Heirlooms", image: prodPriya },
  { slug: "men", name: "For Him", image: prodSerene },
  { slug: "gifting", name: "The Gift Edit", image: prodJhumka },
];

const COLORS = [
  "from-[#8b1a4a] to-[#e8c0a0]",
  "from-[#cdd8e6] to-[#f0f4f8]",
  "from-[#e8c98a] to-[#f5e8d0]",
  "from-[#c9a96e] to-[#f0d8a8]",
  "from-[#7a7a7a] to-[#d0d0d0]",
  "from-[#a85040] to-[#f0c8b0]",
];

export const Route = createFileRoute("/collections")({
  head: () => ({ meta: [{ title: "Collections — Creative Muse" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Edits" title="Our Curated Collections" subtitle="Discover handpicked jewellery stories — from everyday classics to bridal masterpieces." />
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[i]}`} />
              <img
                src={c.image}
                alt={`${c.name} jewellery collection`}
                className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.style.display = "none"; t.dataset.fallback = "1"; } }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-white">
                <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                <p className="mt-2 inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
