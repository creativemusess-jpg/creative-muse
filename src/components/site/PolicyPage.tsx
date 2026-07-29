import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/components/site/PageHeader";
import { ChevronUp } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function PolicyPage({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  const [showTop, setShowTop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowTop(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-200px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <PageShell>
      <div className="mx-auto flex max-w-[1100px] items-start gap-10 px-6 py-12 sm:py-16 lg:py-20">
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <p className="eyebrow text-[10px] tracking-[0.18em] uppercase">
              {eyebrow}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold text-[#1a1a2e] sm:text-4xl">
              {title}
            </h1>
            {lastUpdated && (
              <p className="mt-2 text-sm text-[#7a6e64]">
                Last Updated: {lastUpdated}
              </p>
            )}
          </div>
          <div
            ref={ref}
            className="space-y-6 rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10"
          >
            {children}
          </div>
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a2e] text-white shadow-lg transition-colors hover:bg-[#8B1A1A]"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </PageShell>
  );
}

export function PolicySection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display mb-4 text-xl font-bold text-[#1a1a2e]">{title}</h2>
      {children}
    </section>
  );
}

export function PolicySubsection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="font-display mb-3 text-lg font-semibold text-[#1a1a2e]">{title}</h3>
      {children}
    </section>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-[1.8] text-[#3a3028] marker:text-[#7A2533]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function PolicyPara({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-[1.8] text-[#3a3028]">{children}</p>;
}

export function PolicyDivider() {
  return <hr className="my-8 border-[#e0d8cc]" />;
}

export function PolicyContact() {
  return (
    <address className="not-italic text-[15px] leading-[1.8] text-[#3a3028]">
      <strong className="text-[#1a1a2e]">Creative Muse</strong>
      <br />
      GF-3/4, Vidhi Square Complex,
      <br />
      BPC Road, Next to Govardhan Nathji Haveli,
      <br />
      Laxmi Colony, Anand Nagar, Haripura,
      <br />
      Vadodara, Gujarat – 390020, India
      <br />
      <strong>Phone:</strong> +91 90337 79867
      <br />
      <strong>Email:</strong>{" "}
      <a href="mailto:support@creativemusee.com" className="text-[#8B1A1A] hover:underline">
        support@creativemusee.com
      </a>
      <br />
      <strong>Website:</strong>{" "}
      <a href="https://creativemusee.com" target="_blank" rel="noopener noreferrer" className="text-[#8B1A1A] hover:underline">
        https://creativemusee.com
      </a>
    </address>
  );
}
