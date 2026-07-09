import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Search } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [{ title: "Track Order — Creative Muse" }] }),
  component: TrackPage,
});

function TrackPage() {
  const [id, setId] = useState("");
  const [show, setShow] = useState(false);

  return (
    <PageShell>
      <PageHeader eyebrow="Tracking" title="Track Your Order" subtitle="Enter your order ID to see its journey." />
      <section className="mx-auto max-w-[720px] px-6 py-16">
        <form
          onSubmit={(e) => { e.preventDefault(); setShow(true); }}
          className="flex gap-3 rounded-full border border-[#e0d8cc] bg-white p-2 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
        >
          <Search className="ml-4 h-5 w-5 self-center text-[#C9A96E]" />
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="CM-2025-001234" required className="flex-1 bg-transparent text-sm focus:outline-none" />
          <button className="btn-primary">Track</button>
        </form>

        {show && (
          <div className="mt-10 rounded-[28px] bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[#C9A96E]" />
              <p className="font-display text-lg font-semibold text-[#1a1a2e]">Order #{id || "CM-2025-001234"}</p>
            </div>
            <div className="mt-8 space-y-6">
              {[
                ["Order Placed", "Jun 25, 2026", true],
                ["Crafting Begun", "Jun 26, 2026", true],
                ["Quality Check", "Jun 27, 2026", true],
                ["Out for Delivery", "Jun 28, 2026", true],
                ["Delivered", "Expected Jun 30", false],
              ].map(([label, date, done], i, arr) => (
                <div key={label as string} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-gradient-to-r from-[#C9A96E] to-[#B8860B] text-white" : "border border-[#e0d8cc] text-[#7a6e64]"}`}>{i + 1}</div>
                    {i < arr.length - 1 && <div className={`mt-1 h-12 w-px ${done ? "bg-[#C9A96E]" : "bg-[#e0d8cc]"}`} />}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-[#1a1a2e]">{label as string}</p>
                    <p className="text-xs text-[#7a6e64]">{date as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
