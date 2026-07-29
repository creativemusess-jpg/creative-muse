import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

const FAQS = [
  ["What certifications do your diamonds carry?", "All Creative Muse diamonds are IGI or GIA certified, with a unique grading report detailing the 4Cs."],
  ["Do you offer hallmarked gold jewellery?", "Yes — every gold piece is BIS hallmarked with HUID number visible on each item."],
  ["What is your return and exchange policy?", "30-day returns on unworn pieces in original packaging. Custom orders are exchangeable for store credit."],
  ["Can I customise a piece for my wedding?", "Absolutely — book a private appointment at our Vadodara atelier or over video call."],
  ["Do you offer EMI options?", "No-cost EMI is available on major credit cards and via Razorpay at checkout."],
  ["How long does shipping take across India?", "2–5 business days, fully insured and tracked. Free shipping above ₹5,000."],
  ["Do you ship internationally?", "Currently we ship pan-India. International orders can be arranged on request via our concierge team."],
  ["Can I resize a ring after purchase?", "Yes — first resizing within 60 days is complimentary. Subsequent resizings are charged at material cost."],
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Creative Muse" }] }),
  component: () => {
    const [open, setOpen] = useState<number | null>(0);
    return (
      <PageShell>
        <PageHeader eyebrow="Help" title="Frequently Asked" subtitle="Everything you wanted to know — and a few things you didn't." />
        <section className="mx-auto max-w-[760px] px-6 py-16">
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <div key={q} className="overflow-hidden rounded-[20px] border border-[#e0d8cc] bg-white">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-[15px] font-semibold text-[#1a1a2e]">{q}</span>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#fdf8f3] text-[#7A2533] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <p className="px-6 pb-5 text-[14px] leading-relaxed text-[#7a6e64]">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </PageShell>
    );
  },
});
