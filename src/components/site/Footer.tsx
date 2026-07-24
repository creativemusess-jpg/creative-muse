import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-[40px] bg-[#0d0d1a] px-6 pt-20 pb-8 text-[#cfc6b6] sm:px-10">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <img
            src="/favicon.ico"
            alt="Creative Muse"
            className="h-[64px] w-[64px] object-contain brightness-0 invert md:h-[80px] md:w-[80px]"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#9b9082]">
            Where every gem tells your story. Handcrafted fine jewellery from Vadodara.
          </p>
          <ul className="mt-6 space-y-2.5 text-[13px] text-[#cfc6b6]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4c5a9]" />
              <span>GF-3/4, Vidhi Square, BPC Road, Vadodara 390020</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#e8d5b8]" />
              <a href="tel:+919033779867">+91 90337 79867</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#e8d5b8]" />
              <a href="mailto:hello@creativemuse.in">hello@creativemuse.in</a>
            </li>
          </ul>
          <div className="mt-6 flex gap-2.5">
            {[Instagram, Facebook, Youtube].map((Ic, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#cfc6b6] transition-colors hover:bg-[#e8d5b8] hover:text-[#0d0d1a]"
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

      <div className="mx-auto mt-16 flex max-w-[1280px] flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:gap-4">
        <div className="text-xs text-[#7a6e64]">
          <p>© 2026 All Rights Reserved By Creative Muse</p>
          <p className="mt-1">
            Designed &amp; Developed By{" "}
            <a href="https://apfpuniversal.com" target="_blank" rel="noopener noreferrer" className="text-[#e8d5b8] hover:underline">
              APFP UNIVERSAL
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-2 rounded-[6px] bg-[#0a0a2e] px-3 py-2" aria-label="Razorpay payment">
            <img src="/payment-methods/razorpay.svg" alt="" className="h-[22px] w-[80px]" />
            <span className="text-[10px] font-medium tracking-[0.06em] text-[#e8d5b8]">Razorpay</span>
          </span>
          <span className="flex items-center gap-2 rounded-[6px] bg-[#0a3320] px-3 py-2" aria-label="UPI payment">
            <img src="/payment-methods/upi.svg" alt="" className="h-[22px] w-[72px]" />
            <span className="text-[10px] font-medium tracking-[0.06em] text-[#e8d5b8]">UPI</span>
          </span>
          <span className="flex items-center gap-2 rounded-[6px] bg-[#1A1F71] px-3 py-2" aria-label="Visa payment">
            <img src="/payment-methods/visa.svg" alt="" className="h-[22px] w-[62px]" />
            <span className="text-[10px] font-medium tracking-[0.06em] text-[#e8d5b8]">Visa</span>
          </span>
          <span className="flex items-center gap-2 rounded-[6px] bg-[#1A1A2E] px-3 py-2" aria-label="Mastercard payment">
            <img src="/payment-methods/mastercard.svg" alt="" className="h-[22px] w-[110px]" />
            <span className="text-[10px] font-medium tracking-[0.06em] text-[#e8d5b8]">Mastercard</span>
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
            <Link to={to} className="transition-colors hover:text-[#e8d5b8]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
