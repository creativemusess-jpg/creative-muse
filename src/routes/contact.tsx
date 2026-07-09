import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Creative Muse" },
      { name: "description", content: "Visit our Vadodara atelier or write to us." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell>
      <PageHeader eyebrow="Reach Us" title="We'd Love to Hear From You" subtitle="Book an appointment, ask about custom pieces, or simply say hello." />

      <section className="mx-auto grid max-w-[1100px] gap-10 px-6 py-16 lg:grid-cols-2">
        <div className="space-y-5">
          <Info icon={MapPin} title="Visit Us" text="GF-3/4, Vidhi Square Complex, BPC Road, Anand Nagar, Vadodara – 390020" />
          <Info icon={Phone} title="Call / WhatsApp" text="+91 90337 79867" />
          <Info icon={Mail} title="Email" text="hello@creativemuse.in" />
          <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <p className="font-display text-lg font-semibold text-[#1a1a2e]">Showroom Hours</p>
            <div className="mt-3 space-y-1.5 text-sm text-[#7a6e64]">
              <p>Mon – Sat &nbsp;·&nbsp; 10:00 AM – 8:00 PM</p>
              <p>Sunday &nbsp;·&nbsp; 11:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-4 rounded-[28px] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
        >
          <h3 className="font-display text-xl font-semibold text-[#1a1a2e]">Send us a message</h3>
          <Field label="Name" type="text" />
          <Field label="Email" type="email" />
          <Field label="Phone" type="tel" />
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase">Message</label>
            <textarea rows={4} className="w-full rounded-[20px] border border-[#e0d8cc] bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#C9A96E] focus:outline-none" />
          </div>
          <button type="submit" className="btn-primary w-full">
            <Send className="h-4 w-4" /> {sent ? "Sent — we'll reply soon" : "Send Message"}
          </button>
        </form>
      </section>
    </PageShell>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase">{label}</label>
      <input type={type} required className="w-full rounded-full border border-[#e0d8cc] bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#C9A96E] focus:outline-none" />
    </div>
  );
}

function Info({ icon: Ic, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-[24px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
        <Ic className="h-5 w-5 text-[#C9A96E]" />
      </div>
      <div>
        <p className="font-display text-base font-semibold text-[#1a1a2e]">{title}</p>
        <p className="mt-1 text-sm text-[#7a6e64]">{text}</p>
      </div>
    </div>
  );
}
