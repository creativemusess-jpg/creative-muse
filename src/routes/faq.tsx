import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { faqsApi, type FAQ } from "@/lib/api/faqs";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Creative Muse" }] }),
  component: FAQPage,
});

function getCategory(faq: FAQ): string | null {
  const lowerQ = faq.question.toLowerCase();
  if (
    lowerQ.includes("care") ||
    lowerQ.includes("polish") ||
    lowerQ.includes("clean") ||
    lowerQ.includes("wipe")
  ) {
    return "care";
  }
  if (
    lowerQ.includes("shipping") ||
    lowerQ.includes("delivery") ||
    lowerQ.includes("transit") ||
    lowerQ.includes("arrive")
  ) {
    return "shipping";
  }
  if (lowerQ.includes("refund") || lowerQ.includes("return")) {
    return "refund";
  }
  if (lowerQ.includes("exchange") || lowerQ.includes("resize")) {
    return "returns";
  }
  return null;
}

function getCategoriesForFaqs(faqs: FAQ[]): Record<string, FAQ[]> {
  const result: Record<string, FAQ[]> = {
    care: [],
    shipping: [],
    refund: [],
    returns: [],
  };
  faqs.forEach((faq) => {
    const cat = getCategory(faq);
    if (cat) {
      result[cat].push(faq);
    }
  });
  return result;
}

function FAQAccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-[#e0d8cc] transition-colors"
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${faq.id}`}
      tabindex={0}
    >
      <div className="p-6 flex items-start justify-between">
        <div className="flex-1 line-clamp-1">
          <p className="font-display text-sm font-medium text-[#1a1a2e]">
            {faq.question}
          </p>
        </div>
        <span
          className={`inline-flex items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? "bg-[#7A2533]/10 text-[#7A2533]" : "bg-transparent"} ${isOpen ? "scale-125" : "scale-100"}`}
        >
          {isOpen ? <Check className="h-4 w-4 text-[#7A2533]" /> : <X className="h-4 w-4 text-gray-400" />}
        </span>
      </div>
      {isOpen && (
        <div className="p-6 pt-0">
          <p className="text-base text-[#7a6e64] leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const autoCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await faqsApi.list(true);
        setFaqs(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load FAQs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  useEffect(() => {
    if (faqs.length > 0) {
      setActiveFaqId(faqs[0]?.id ?? null);
    }
  }, [faqs]);

  const toggleFaq = useCallback((id: string) => {
    if (activeFaqId && activeFaqId !== id) {
      setActiveFaqId(null);
    }
    setActiveFaqId(id);

    if (autoCloseTimeoutRef.current) clearTimeout(autoCloseTimeoutRef.current);
    autoCloseTimeoutRef.current = setTimeout(() => {
      setActiveFaqId(null);
    }, 3000);
  }, [activeFaqId]);

  const categories = getCategoriesForFaqs(faqs);

  if (loading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Help" title="Frequently Asked Questions" subtitle="Everything you wanted to know — and a few things you didn't." />
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="space-y-6" role="status" aria-label="Loading FAQs">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-[20px] bg-[#fdf8f3] animate-pulse" />
            ))}
          </div>
        </section>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <PageHeader eyebrow="Help" title="Frequently Asked Questions" subtitle="Everything you wanted to know — and a few things you didn't." />
        <section className="mx-auto max-w-[900px] px-6 py-16 text-center">
          <p className="text-[#7a6e64]">{error}</p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Help" title="Frequently Asked Questions" subtitle="Everything you wanted to know — and a few things you didn't." />
      <section className="mx-auto max-w-[900px] px-6 py-16" style={{ overflowX: "hidden" }}>
        <div className="mb-8 rounded-2xl bg-white border border-gray-200 overflow-hidden" style={{ flexShrink: 0 }}>
          <button
            onClick={() => setCategoriesOpen((c) => !c)}
            className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#fdf8f3]"
            aria-controls="categories-list"
            aria-expanded={categoriesOpen}
          >
            FAQ'S
            <X className="h-4 w-4" />
          </button>
          <div
            id="categories-list"
            className="hidden max-h-80 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
            role="menu"
            aria-label="FAQ categories"
          >
            {Object.entries(categories).map(([key, faqsInCategory]) => {
              const labelMap: Record<string, string> = {
                care: "Care Instructions",
                shipping: "Shipping & Delivery",
                refund: "Refunds",
                returns: "Returns & Exchanges",
              };
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveCategory(key as string);
                    setCategoriesOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A2533]"
                >
                  <span className="line-clamp-1">{labelMap[key]}</span>
                  <span className="ml-2 text-xs text-gray-400">{faqsInCategory.length} FAQs</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 mb-6 rounded-full bg-[#fdf8f3] overflow-hidden">
            {Object.keys(categories).map((key) => {
              const labelMap: Record<string, string> = {
                care: "Care",
                shipping: "Shipping",
                refund: "Refund",
                returns: "Returns",
              };
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveCategory(key as string);
                    setCategoriesOpen(false);
                  }}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${
                    activeCategory === key ? "text-[#1a1a2e] bg-[#7A2533]" : "text-gray-400 bg-transparent"
                  }`}
                >
                  {labelMap[key]}
                </button>
              );
            })}
          </div>

          <div className="grid max-w-[1200px] mx-auto space-y-3">
            {faqs.map((faq) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isOpen={activeFaqId === faq.id}
                onToggle={() => toggleFaq(faq.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
