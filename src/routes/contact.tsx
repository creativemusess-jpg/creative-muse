import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { enquiriesApi } from "@/lib/api/enquiries";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      await enquiriesApi.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong while submitting your enquiry. Please try again.");
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <h3 className="font-display text-xl font-semibold text-[#1a1a2e]">Send us a message</h3>

          <Field
            label="Name"
            type="text"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            error={errors.name}
            disabled={status === "submitting"}
          />
          <Field
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
            error={errors.email}
            disabled={status === "submitting"}
          />
          <Field
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })}
            error={errors.phone}
            disabled={status === "submitting"}
          />
          <Field
            label="Subject (optional)"
            type="text"
            value={formData.subject}
            onChange={(v) => setFormData({ ...formData, subject: v })}
            disabled={status === "submitting"}
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase">Message</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-[20px] border border-[#e0d8cc] bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#9C544D] focus:outline-none"
              disabled={status === "submitting"}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          {status === "success" && (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 animate-fade-in">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Enquiry submitted successfully</p>
                <p className="text-sm">We will get back to you shortly.</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={status === "submitting" || status === "success"}>
            {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "submitting" ? "Submitting..." : status === "success" ? (
              <>
                <CheckCircle className="h-4 w-4" /> Sent — we'll reply soon
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Message
              </>
            )}
          </button>
        </form>
      </section>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageShell>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={!label.includes("optional")}
        disabled={disabled}
        className={`w-full rounded-full border bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#9C544D] focus:outline-none transition-colors ${
          error ? "border-red-300" : "border-[#e0d8cc]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Info({ icon: Ic, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-[24px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
        <Ic className="h-5 w-5 text-[#9C544D]" />
      </div>
      <div>
        <p className="font-display text-base font-semibold text-[#1a1a2e]">{title}</p>
        <p className="mt-1 text-sm text-[#7a6e64]">{text}</p>
      </div>
    </div>
  );
}