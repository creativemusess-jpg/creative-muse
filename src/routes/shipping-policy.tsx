import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({ meta: [{ title: "Shipping Policy — Creative Muse" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Shipping Policy" />
      <section className="mx-auto max-w-[760px] px-6 py-16">
        <div className="space-y-5 rounded-[28px] bg-white p-10 text-[15px] leading-[1.8] text-[#3a3028] shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p>All orders are shipped fully insured and tracked via trusted logistics partners. Standard delivery across India takes 2–5 business days.</p>
          <p>Shipping is complimentary on orders above ₹5,000. Below that, a flat ₹250 fee applies.</p>
          <p>You will receive a tracking link by SMS and email once your order has been dispatched from our Vadodara atelier.</p>
          <p>For express delivery or international shipping, please contact our concierge team.</p>
        </div>
      </section>
    </PageShell>
  ),
});
