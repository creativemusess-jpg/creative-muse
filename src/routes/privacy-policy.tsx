import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

function makePolicy(title: string, eyebrow: string, body: string[]) {
  return () => (
    <PageShell>
      <PageHeader eyebrow={eyebrow} title={title} />
      <section className="mx-auto max-w-[760px] px-6 py-16">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
          <div className="space-y-5 text-[15px] leading-[1.8] text-[#3a3028]">
            {body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Creative Muse" }] }),
  component: makePolicy("Privacy Policy", "Legal", [
    "Creative Muse Fine Jewellery values your privacy. We collect only the information necessary to process your orders, deliver your jewellery, and improve your experience on our site.",
    "We never sell your personal data. We share information only with trusted partners (logistics, payment processing) under strict confidentiality agreements.",
    "You may request access, correction or deletion of your data at any time by writing to hello@creativemuse.in.",
    "This policy was last updated on June 28, 2026.",
  ]),
});
