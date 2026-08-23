import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageHeader";
import { Link } from "@tanstack/react-router";
import heroRing from "@/assets/hero-ring.jpg";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Creative Muse" }] }),
  component: FAQPage,
});

const CATEGORIES = [
  { key: "care", label: "Care Instructions" },
  { key: "shipping", label: "Shipping & Delivery" },
  { key: "refund", label: "Refunds" },
  { key: "returns", label: "Returns & Exchanges" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const CARE_CONTENT = [
  "Your Creative Muse jewellery is designed for everyday elegance. With the right care, you can help preserve its shine and beauty for longer.",
  "• Store your jewellery in a cool, dry place, preferably in the packaging provided with your order.",
  "• Avoid prolonged exposure to water, perfumes, lotions, harsh chemicals, chlorine and excessive sunlight.",
  "• Keep your jewellery away from moisture and humidity when not in use.",
  "• We recommend storing individual pieces separately to help prevent scratches, tangling or unnecessary friction.",
  "• After wearing, gently wipe your jewellery with a soft, dry cloth before storing it.",
  "• Regular and gentle cleaning helps maintain the shine and finish of your jewellery.",
];

const CARE_SUBHEADING = "For long-lasting shine:";

const CARE_SUBTEXT =
  "Although our jewellery is designed for everyday wear, proper care is important to maintain its appearance. Avoid wearing your jewellery while swimming, bathing, exercising or when applying perfumes and other cosmetic products.";

const CARE_FINAL =
  "Your Creative Muse jewellery is made to become part of your everyday story — care for it well, and let it shine with you.";

const SHIPPING_FAQS = [
  {
    q: "Is shipping free on my Creative Muse order?",
    a: "Shipping availability and charges may vary depending on your order value, delivery location and the shipping option selected at checkout.\n\nAny applicable shipping charges will be clearly displayed before you complete your order.",
  },
  {
    q: "How long will my order take to ship?",
    a: "Orders are processed and dispatched according to the timeline mentioned on our website.\n\nOnce your order has been dispatched, tracking information will be shared with you so you can follow your delivery.\n\nDelivery timelines may vary depending on:\n\n• Your delivery location\n• Courier availability\n• Order processing time\n• Weekends and public holidays\n• Unexpected courier or logistical delays",
  },
  {
    q: "What if my order arrives damaged?",
    a: "We take care to package every order securely before dispatch.\n\nIf your package or jewellery arrives damaged, please contact Creative Muse customer support as soon as possible with your order details and supporting photographs/videos so our team can review the issue and assist you.",
  },
  {
    q: "I entered incorrect shipping details. What should I do?",
    a: "Please carefully verify your shipping and billing information before completing your order.\n\nIf you notice that you have entered incorrect information, contact Creative Muse customer support as soon as possible with your order number and the correct details.\n\nWe will do our best to assist you, subject to the status of your order.",
  },
];

const REFUND_FAQS = [
  {
    q: "Do you offer refunds?",
    a: "Refund eligibility depends on the product and the circumstances of the request and is subject to the Creative Muse Returns & Exchange Policy.\n\nIf your order qualifies for a refund, our team will guide you through the applicable process after reviewing your request.",
  },
  {
    q: "What happens if my order arrives damaged or defective?",
    a: "If your jewellery arrives damaged or has a manufacturing defect, please contact us as soon as possible after receiving your order.\n\nOur team will review the issue and, where applicable, provide an appropriate resolution according to our policy.",
  },
  {
    q: "How do I request assistance for a refund?",
    a: "Please contact the Creative Muse support team with:\n\n• Order number\n• Registered contact details\n• Reason for the request\n• Relevant photographs/videos, where applicable\n\nOur team will review your request and guide you through the next steps.",
  },
];

const RETURNS_FAQS = [
  {
    q: "Can I return or exchange my jewellery?",
    a: "Eligible products may be returned or exchanged in accordance with the Creative Muse Returns & Exchange Policy.\n\nBefore sending any product back, please contact our support team and receive confirmation of the return/exchange process.",
  },
  {
    q: "What condition should the product be in?",
    a: "Returned or exchanged jewellery should be:\n\n• Unworn\n• In its original condition\n• Free from damage or signs of use\n• Accompanied by the original packaging and tags, where applicable\n• Supported by the original order details",
  },
  {
    q: "What if my item arrives damaged or defective?",
    a: "If your item arrives damaged or defective, please contact us promptly after delivery.\n\nOur team will review the issue and guide you through the appropriate resolution.",
  },
  {
    q: "How do I request a return or exchange?",
    a: "You can contact Creative Muse customer support with your order number and reason for the request.\n\nOur team will provide the necessary instructions for the return or exchange process.",
  },
];

const RETURNS_NOTES = [
  "• Return and exchange eligibility is subject to the Creative Muse Returns & Exchange Policy.",
  "• Products that show signs of wear, damage or misuse may not qualify.",
  "• Certain products or promotional purchases may have specific return/exchange conditions.",
  "• Please contact Creative Muse before shipping any item back.",
];

const RETURNS_REFUND_NOTE =
  "Please note that refunds, where applicable, will be processed according to the Creative Muse Refund and Returns Policy. Please contact our support team if you need assistance with a specific order.";

function FAQPage() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("care");

  return (
    <PageShell>
      <section className="mx-auto max-w-[960px] px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Large heading */}
        <h1 className="font-display text-[42px] leading-none font-medium text-[#1a1a2e] md:text-[56px]">
          FAQ&apos;s
        </h1>

        {/* Category tabs */}
        <div className="mt-10 md:mt-14">
          <div
            className="flex gap-6 overflow-x-auto md:gap-10"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`shrink-0 whitespace-nowrap pb-3 text-[22px] md:text-[28px] transition-colors duration-200 ${
                    isActive
                      ? "font-display font-medium text-[#1a1a2e] border-b-2 border-[#1a1a2e]"
                      : "font-display text-[#b0a89e] hover:text-[#7a6e64]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="mt-0 h-px w-full bg-[#e0d8cc]" />
        </div>

        {/* Content area */}
        <div className="mt-10 md:mt-14">
          {activeTab === "care" && (
            <div className="space-y-5">
              {CARE_CONTENT.map((line, i) => (
                <p key={i} className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                  {line}
                </p>
              ))}
              <div className="pt-4">
                <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                  {CARE_SUBHEADING}
                </p>
                <p className="mt-2 text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                  {CARE_SUBTEXT}
                </p>
              </div>
              <p className="pt-2 text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                {CARE_FINAL}
              </p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-8">
              {SHIPPING_FAQS.map((faq, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                    {faq.q}
                  </p>
                  {faq.a.split("\n").map((paragraph, j) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={j} className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {activeTab === "refund" && (
            <div className="space-y-8">
              {REFUND_FAQS.map((faq, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                    {faq.q}
                  </p>
                  {faq.a.split("\n").map((paragraph, j) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={j} className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {activeTab === "returns" && (
            <div className="space-y-8">
              {RETURNS_FAQS.map((faq, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                    {faq.q}
                  </p>
                  {faq.a.split("\n").map((paragraph, j) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={j} className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                  Important Notes
                </p>
                {RETURNS_NOTES.map((line, i) => (
                  <p key={i} className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                    {line}
                  </p>
                ))}
              </div>
              <div className="pt-2 space-y-2">
                <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1a2e] leading-[1.75]">
                  Refund Policy
                </p>
                <p className="text-[14px] md:text-[15px] text-[#4a4540] leading-[1.75]">
                  {RETURNS_REFUND_NOTE}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA — Full-width image with text overlay */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroRing})` }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[960px] px-6 md:px-10">
            <h2 className="font-display text-[32px] md:text-[48px] font-medium text-white leading-tight">
              Reach Out To Us
            </h2>
            <p className="mt-4 text-[14px] md:text-[16px] text-white/80 max-w-[420px] leading-relaxed">
              Need assistance or have questions? We&apos;re just a message away.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-[#1a1a2e] uppercase tracking-wider transition-colors hover:bg-[#f0e8de]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
