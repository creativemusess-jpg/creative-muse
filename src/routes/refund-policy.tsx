import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy — Creative Muse" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Refund Policy" />
      <section className="mx-auto max-w-[760px] px-6 py-16">
        <div className="space-y-5 rounded-[28px] bg-white p-10 text-[15px] leading-[1.8] text-[#3a3028] shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p>We offer 30-day returns on unworn jewellery in its original packaging, accompanied by the original certificate and invoice.</p>
          <p>Refunds are processed within 7–10 business days via the original payment method. A nominal handling fee may apply on returned items.</p>
          <p>Custom orders, engraved pieces and items altered at the customer's request are non-refundable but may be exchanged for store credit.</p>
          <p>For any concerns, please write to hello@creativemuse.in or call us at +91 90337 79867.</p>
        </div>
      </section>
    </PageShell>
  ),
});
