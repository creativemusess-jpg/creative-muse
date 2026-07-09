import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-[#fdf8f3] via-[#f7ede0] to-[#f0dcc8] px-6 pt-16 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-3 text-[40px] leading-tight font-bold text-[#1a1a2e] sm:text-[56px]">
          {title}
        </h1>
        <div className="mt-5 flex justify-center">
          <span className="gold-divider" />
        </div>
        {subtitle && <p className="mt-5 text-[15px] text-[#7a6e64]">{subtitle}</p>}
      </motion.div>
    </section>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="bg-[#fdf8f3]">{children}</div>;
}
