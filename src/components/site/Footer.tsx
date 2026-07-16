import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-[40px] bg-[#0d0d1a] px-6 pt-20 pb-8 text-[#cfc6b6] sm:px-10">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <span className="flex items-center gap-4">
            <img
              src="/favicon.ico"
              alt=""
              aria-hidden="true"
              className="h-[64px] w-[64px] object-contain brightness-0 invert md:h-[80px] md:w-[80px]"
            />
            <span className="leading-tight">
              <span className="block font-display text-[20px] font-semibold text-white md:text-[24px]">
                Creative Muse
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A96E] md:text-[11px]">
                Fine Jewellery
              </span>
            </span>
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#9b9082]">
            Where every gem tells your story. Handcrafted fine jewellery from Vadodara.
          </p>
          <ul className="mt-6 space-y-2.5 text-[13px] text-[#cfc6b6]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" />
              <span>GF-3/4, Vidhi Square, BPC Road, Vadodara 390020</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#C9A96E]" />
              <a href="tel:+919033779867">+91 90337 79867</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#C9A96E]" />
              <a href="mailto:hello@creativemuse.in">hello@creativemuse.in</a>
            </li>
          </ul>
          <div className="mt-6 flex gap-2.5">
            {[Instagram, Facebook, Youtube].map((Ic, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#cfc6b6] transition-colors hover:bg-[#C9A96E] hover:text-white"
              >
                <Ic className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            ["Rings", "/shop"],
            ["Necklaces", "/shop"],
            ["Earrings", "/shop"],
            ["Bracelets", "/shop"],
            ["Bangles", "/shop"],
            ["Wedding Sets", "/shop"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About", "/about"],
            ["Blog", "/blog"],
            ["Careers", "/about"],
            ["Store Locator", "/contact"],
            ["Press", "/about"],
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ["FAQ", "/faq"],
            ["Track Order", "/track-order"],
            ["Returns", "/refund-policy"],
            ["Shipping", "/shipping-policy"],
            ["Privacy", "/privacy-policy"],
            ["Contact", "/contact"],
          ]}
        />
      </div>

      <div className="mx-auto mt-16 flex max-w-[1280px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-xs text-[#7a6e64]">© 2025 Creative Muse. All rights reserved. Built by MysticMuse.</p>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 rounded-[8px] bg-[#0a0a2e] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#8a8aff] uppercase">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">R</text></svg>
            Razorpay
          </span>
          <span className="flex items-center gap-1.5 rounded-[8px] bg-[#097b3a] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-white uppercase">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">U</text></svg>
            UPI
          </span>
          <span className="flex items-center gap-1.5 rounded-[8px] bg-[#1a1f71] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#f7b600] uppercase">
            VISA
          </span>
          <span className="relative flex items-center gap-1.5 rounded-[8px] bg-[#1a1a2e] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#cfc6b6] uppercase">
            <span className="relative flex h-3.5 w-3.5">
              <span className="absolute left-0 h-3.5 w-2 rounded-full bg-[#eb001b] opacity-70" />
              <span className="absolute right-0 h-3.5 w-2 rounded-full bg-[#f79e1b] opacity-70" />
            </span>
            MC
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display text-base text-white">{title}</h4>
      <span className="gold-divider mt-3" />
      <ul className="mt-5 space-y-2.5 text-[13px] text-[#9b9082]">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="transition-colors hover:text-[#C9A96E]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
