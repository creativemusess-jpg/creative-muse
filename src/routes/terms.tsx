import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Creative Muse" }] }),
  component: () => (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Terms of Service" />
      <section className="mx-auto max-w-[760px] px-6 py-16">
        <div className="space-y-5 rounded-[28px] bg-white p-10 text-[15px] leading-[1.8] text-[#3a3028] shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p>By accessing creativemuse.in, you agree to these terms in full. If you disagree with any part, please discontinue use of the site.</p>
          <p>All content — including text, images, designs and trademarks — is the property of Creative Muse Fine Jewellery and may not be reproduced without written permission.</p>
          <p>Product prices, availability and specifications are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion.</p>
          <p>Any disputes are subject to the exclusive jurisdiction of the courts at Vadodara, Gujarat, India.</p>
        </div>
      </section>
    </PageShell>
  ),
});
