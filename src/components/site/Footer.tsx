import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-[40px] bg-[#1A1715] px-6 pt-20 pb-8 text-[#cfc6b6] sm:px-10">
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#cfc6b6] transition-colors hover:bg-[#C9A96E]/20 hover:text-[#C9A96E]"
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
        <div className="text-xs text-[#A09686]">
          <p>© 2026 All Rights Reserved By Creative Muse</p>
          <p className="mt-1">
            Designed &amp; Developed By{" "}
            <a
              href="https://apfpuniversal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A96E] hover:underline"
            >
              APFP UNIVERSAL
            </a>
          </p>
        </div>
        <div className="grid grid-cols-2 place-items-center gap-x-8 gap-y-4 sm:flex sm:items-center sm:justify-end sm:gap-6">
          <img
            src="/payment-methods/razorpay.svg"
            alt="Razorpay"
            className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
          />
          <img
            src="/payment-methods/upi.svg"
            alt="UPI"
            className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
          />
          <img
            src="/payment-methods/visa.svg"
            alt="Visa"
            className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
          />
          <img
            src="/payment-methods/mastercard.svg"
            alt="Mastercard"
            className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display text-base text-[#C9A96E]">{title}</h4>
      <span className="gold-divider mt-3" />
      <ul className="mt-5 space-y-2.5 text-[13px] text-[#cfc6b6]">
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
