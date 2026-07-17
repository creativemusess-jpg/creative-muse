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
        <div className="text-xs text-[#7a6e64]">
          <p>© 2026 All Rights Reserved By Creative Muse</p>
          <p className="mt-1">
            Designed &amp; Developed By{" "}
            <a href="https://apfpuniversal.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A96E] hover:underline">
              APFP UNIVERSAL
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center rounded-[6px] bg-[#0a0a2e] px-2.5 py-1.5">
            <svg viewBox="0 0 72 18" className="h-[18px] w-[72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="18" height="18" rx="4" fill="#7c7cf8"/>
              <path d="M5 13V5h3.2c1.2 0 2 .6 2 1.8 0 .8-.4 1.3-1 1.5.8.2 1.3.8 1.3 1.7C10.5 11.6 9.5 13 8 13H5zm1.5-4.5h1.2c.7 0 1.1-.4 1.1-1s-.4-.9-1.1-.9H6.5v1.9zm0 3h1.4c.8 0 1.3-.5 1.3-1.3 0-.7-.5-1.1-1.3-1.1H6.5v2.4z" fill="white"/>
              <text x="22" y="13" fill="white" fontFamily="system-ui" fontWeight="600" fontSize="10">Razorpay</text>
            </svg>
          </span>
          <span className="flex items-center rounded-[6px] bg-[#097b3a] px-2.5 py-1.5">
            <svg viewBox="0 0 72 18" className="h-[18px] w-[72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="18" height="18" rx="4" fill="white"/>
              <text x="9" y="13" textAnchor="middle" fill="#097b3a" fontFamily="system-ui" fontWeight="bold" fontSize="11">U</text>
              <text x="22" y="13" fill="white" fontFamily="system-ui" fontWeight="600" fontSize="10">UPI</text>
            </svg>
          </span>
          <span className="flex items-center rounded-[6px] bg-[#1a1f71] px-2.5 py-1.5">
            <svg viewBox="0 0 48 18" className="h-[18px] w-[48px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="14" fill="#f7b600" fontFamily="system-ui" fontWeight="bold" fontSize="12" letterSpacing="1.5">VISA</text>
            </svg>
          </span>
          <span className="flex items-center rounded-[6px] bg-[#1a1a2e] px-2.5 py-1.5">
            <svg viewBox="0 0 88 18" className="h-[18px] w-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="9" r="6" fill="#eb001b" opacity="0.7"/>
              <circle cx="13" cy="9" r="6" fill="#f79e1b" opacity="0.7"/>
              <text x="24" y="14" fill="#cfc6b6" fontFamily="system-ui" fontWeight="bold" fontSize="10" letterSpacing="1.5">MASTERCARD</text>
            </svg>
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
