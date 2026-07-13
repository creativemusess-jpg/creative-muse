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
              className="h-[64px] w-[64px] object-contain md:h-[80px] md:w-[80px]"
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
        <p className="text-xs text-[#7a6e64]">© 2025 Creative Muse Fine Jewellery · Vadodara, India</p>
        <div className="flex gap-2">
          {["Razorpay", "UPI", "Visa", "Mastercard"].map((p) => (
            <span
              key={p}
              className="rounded-[8px] border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#cfc6b6] uppercase"
            >
              {p}
            </span>
          ))}
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
