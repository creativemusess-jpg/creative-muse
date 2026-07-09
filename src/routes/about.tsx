import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Award, Diamond, Hand, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Creative Muse Fine Jewellery" },
      { name: "description", content: "Our story, our craft, our promise — from Vadodara to your forever." },
    ],
  }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Our Story" title="Crafted in Vadodara, Worn Forever" subtitle="Five generations of artistry, one timeless promise." />
      <section className="mx-auto max-w-[920px] px-6 py-16">
        <div className="rounded-[28px] bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <p className="text-[16px] leading-[1.8] text-[#3a3028]">
            Creative Muse began in a small Vadodara workshop, with a single goldsmith and a belief
            that every gem deserves to tell a story. Today, our atelier blends five generations of
            craft with modern design — creating jewellery that feels personal, never mass-produced.
          </p>
          <p className="mt-5 text-[16px] leading-[1.8] text-[#3a3028]">
            Every piece is certified, hallmarked, and assembled by hand. We source ethically, design
            quietly, and serve each customer the way we'd serve our own family.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Award, "Certified Purity"],
            [Diamond, "Ethically Sourced"],
            [Hand, "Handcrafted"],
            [Heart, "Made with Care"],
          ].map(([Ic, label]) => (
            <div key={label as string} className="rounded-[24px] border border-[#e0d8cc] bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
                <Ic className="h-5 w-5 text-[#C9A96E]" />
              </div>
              <p className="font-display mt-3 text-sm font-semibold text-[#1a1a2e]">{label as string}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
