import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { newsletterApi } from "@/lib/api/newsletter";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await newsletterApi.subscribeToNewsletter({ email: trimmed, source: "footer_newsletter", consent: true });
      if (!res.success) {
        setStatus(res.status === "already_active" ? "success" : "error");
        setMessage(res.message);
        return;
      }
      setStatus("success");
      setMessage("Welcome to the Circle!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-[#0F0E0D] text-[#E8DDD3]">
      <div className="mx-auto box-border w-full max-w-[1280px] px-4 sm:px-8 lg:px-10">
        <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block">
              <img src="/favicon.ico" alt="Creative Muse" className="h-[64px] w-[64px] object-contain brightness-0 invert md:h-[72px] md:w-[72px]" />
            </Link>
            <p className="mt-6 font-display text-[15px] leading-relaxed text-[#F5EFE8]">Where every gem tells your story.</p>
            <p className="mt-2 max-w-[320px] text-[13px] leading-relaxed text-white/50">Handcrafted fine jewellery from Vadodara.</p>
            <ul className="mt-7 space-y-3 text-[13px] leading-relaxed">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9C544D]" />
                <span>GF-3/4, Vidhi Square, BPC Road, Vadodara 390020</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#9C544D]" />
                <a href="tel:+919033779867" className="text-white/70 transition-colors hover:text-white">+91 90337 79867</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#9C544D]" />
                <a href="mailto:hello@creativemuse.in" className="text-white/70 transition-colors hover:text-white">hello@creativemuse.in</a>
              </li>
            </ul>
            <div className="mt-7 flex gap-2">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 backdrop-blur transition-all hover:border-[#9C544D]/30 hover:bg-[#9C544D]/10 hover:text-white hover:scale-[1.04] active:scale-[0.98]">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid w-full max-w-full grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:col-span-5 lg:grid-cols-3 lg:gap-6">
            <FooterCol title="Shop" links={[["Rings","/shop"],["Necklaces","/shop"],["Earrings","/shop"],["Bracelets","/shop"],["Bangles","/shop"],["Wedding Sets","/shop"]]} />
            <FooterCol title="Company" links={[["About","/about"],["Blog","/blog"],["Collections","/collections"]]} />
            <FooterCol title="Support" links={[["FAQs","/faq"],["Track Order","/track-order"],["Returns","/refund-policy"],["Shipping","/shipping-policy"],["Privacy","/privacy-policy"],["Contact","/contact"]]} />
          </div>

          <div className="min-w-0 lg:col-span-3">
            <div className="box-border w-full max-w-full rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm lg:p-7">
              <h4 className="font-display text-[15px] font-medium tracking-[0.04em] text-white">Stay in the know.</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">Be the first to discover new collections, private offers and jewellery inspiration.</p>
              <form onSubmit={handleSubscribe} className="mt-5 w-full max-w-full">
                <div className="flex w-full max-w-full flex-col gap-2 rounded-[20px] border border-white/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] focus-within:border-[#9C544D]/40 sm:flex-row sm:items-center sm:gap-1.5 sm:rounded-full">
                  <input value={email} onChange={(e)=>{ setEmail(e.target.value); if(status!=="idle") setStatus("idle"); }} placeholder="Enter your email address" type="email" className="min-w-0 w-full flex-1 bg-transparent px-4 py-2.5 text-[13px] text-[#1a1a2e] placeholder:text-[#9a8e85] focus:outline-none sm:py-2" />
                  <button type="submit" disabled={status==="loading"} className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#9C544D] px-5 text-[12px] font-semibold tracking-wide text-white transition-colors hover:bg-[#8a4b45] disabled:opacity-60 sm:h-9 sm:w-auto">
                    {status==="loading" ? "..." : "Subscribe"} <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-80" />
                  </button>
                </div>
                {message && <p className={`mt-3 text-xs ${status==="success" ? "text-emerald-300/90" : "text-red-300/90"}`}>{message}</p>}
                <p className="mt-3 text-[11px] leading-relaxed text-white/30">By subscribing you agree to our Privacy Policy. No spam, unsubscribe anytime.</p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-full flex-col gap-6 border-t border-white/[0.07] py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-full px-2 text-center text-xs leading-relaxed text-white/45 sm:px-0 lg:w-auto lg:text-left">
            <p className="break-words">© 2026 All Rights Reserved By Creative Muse</p>
            <p className="mt-1 break-words">Designed &amp; Developed By <a href="https://apfpuniversal.com" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/40">APFP UNIVERSAL</a></p>
          </div>
          <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-4 sm:gap-5 opacity-90 lg:w-auto lg:justify-end">
            <img src="/payment-methods/razorpay.png" alt="Razorpay" className="h-[20px] w-auto max-w-[6.5rem] shrink-0 object-contain brightness-0 invert opacity-80 sm:h-[22px] sm:max-w-[7rem]" />
            <img src="/payment-methods/upi.svg" alt="UPI" className="h-4 w-auto shrink-0 object-contain opacity-80 sm:h-5" />
            <img src="/payment-methods/visa.svg" alt="Visa" className="h-4 w-auto shrink-0 object-contain opacity-80 sm:h-5" />
            <img src="/payment-methods/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto shrink-0 object-contain opacity-80 sm:h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="min-w-0">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">{title}</h4>
      <div className="mt-4 h-px w-7 bg-[#9C544D]/60" />
      <ul className="mt-5 space-y-3 text-[13px]">
        {links.map(([label, to]) => (
          <li key={label} className="min-w-0">
            <Link to={to} className="group inline-flex min-w-0 items-center gap-1.5 break-words text-white/60 transition-colors hover:text-white">
              <span className="h-px w-0 shrink-0 bg-white/60 transition-all duration-300 group-hover:w-3" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
