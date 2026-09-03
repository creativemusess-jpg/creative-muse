import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageHeader";
import prodAarav from "@/assets/prod-aarav-ring.jpg";
import prodCelestia from "@/assets/prod-celestia-earrings.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Creative Muse Fine Jewellery" },
      { name: "description", content: "Creative Muse began with a simple belief: every woman deserves to feel confident, beautiful, and effortlessly herself every single day. Discover our story curated for today and designed to last." },
      { property: "og:title", content: "About Us — Creative Muse Fine Jewellery" },
      { property: "og:description", content: "From Creative Corner to Creative Muse — jewelry with a purpose, crafted for everyday elegance." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <div className="w-full max-w-full overflow-x-clip bg-[#fdf8f3]">
        <section className="mx-auto box-border w-full max-w-[920px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#9C544D] uppercase">Our Story</p>
            <h1 className="font-display mx-auto mt-3 max-w-[720px] text-[32px] font-semibold leading-[1.1] text-[#1a1a2e] sm:text-[44px] lg:text-[48px]">WELCOME TO CREATIVE MUSE</h1>
            <p className="font-display mx-auto mt-4 max-w-[680px] text-[17px] font-medium leading-relaxed text-[#3a3028] sm:text-[19px]">From a Dream of Creativity to a Brand Designed for Everyday Elegance</p>
            <div className="mx-auto mt-6 h-px w-12 bg-[#9C544D]/60 sm:mt-7" />
          </div>
        </section>

        <section className="mx-auto box-border w-full max-w-[920px] px-4 sm:px-6">
          <div className="rounded-[24px] bg-white px-5 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px] sm:px-10 sm:py-10">
            <h2 className="font-display text-center text-[11px] font-semibold tracking-[0.18em] text-[#9C544D] uppercase">Jewelry with a Purpose</h2>
            <div className="mx-auto mt-4 max-w-[720px] space-y-4 text-[15px] leading-[1.85] text-[#3a3028] sm:text-[16px]">
              <p>Creative Muse began with a simple belief: every woman deserves to feel confident, beautiful, and effortlessly herself every single day.</p>
              <p>Our story started long before Creative Muse. Seven years ago, we founded Creative Corner, a gifting brand that celebrated life’s most special moments through thoughtfully curated hampers. As we became a part of thousands of celebrations, one question stayed with us:</p>
              <p className="font-display text-[17px] font-semibold italic text-[#1a1a2e]">Why should beautiful things only be reserved for special occasions?</p>
              <p>Three years ago, that idea became Creative Muse—a jewelry brand created to celebrate women every day with timeless pieces designed to inspire confidence and joy.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto box-border w-full max-w-[920px] px-4 py-8 sm:px-6 sm:py-10">
          <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px]">
            <img src={prodCelestia} alt="Creative Muse jewellery collection" loading="lazy" decoding="async" className="h-auto w-full max-w-full object-cover" width={800} height={600} />
          </div>
        </section>

        <section className="mx-auto box-border w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid items-center gap-8 rounded-[24px] bg-white px-5 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px] sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-10 lg:px-10">
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-[26px] font-semibold leading-tight text-[#1a1a2e] sm:text-[30px]">EVERYDAY JEWELRY, ELEVATED</h2>
              <div className="mt-3 h-px w-10 bg-[#9C544D]/50" />
              <div className="mt-5 space-y-4 text-[15px] leading-[1.85] text-[#3a3028] sm:text-[16px]">
                <p>Creative Muse is a woman-founded jewelry brand created for women who love timeless style with a modern touch.</p>
                <p>Whether you’re heading to work, meeting friends, travelling, celebrating milestones, or simply embracing everyday moments, our jewelry is designed to move with you.</p>
                <p>Crafted from premium PVD-plated stainless steel, our pieces are waterproof, anti-tarnish, hypoallergenic, and made for everyday wear.</p>
                <p>No complicated styling. No waiting for a special occasion. Just beautiful jewelry that fits effortlessly into your everyday life.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-[16px] bg-[#fdf8f3] sm:rounded-[20px]">
                <img src={prodAarav} alt="Everyday jewelry elevated - Creative Muse" loading="lazy" decoding="async" className="h-auto w-full max-w-full object-cover" width={800} height={800} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto box-border w-full max-w-[920px] px-4 py-8 sm:px-6 sm:py-12">
          <div className="rounded-[24px] bg-[#1a1a2e] px-5 py-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:rounded-[28px] sm:px-10 sm:py-10">
            <h2 className="font-display text-center text-[20px] font-semibold tracking-wide text-white sm:text-[26px]">CURATED FOR TODAY. DESIGNED TO LAST.</h2>
            <p className="mt-3 text-center text-[11px] font-semibold tracking-[0.18em] text-[#C9A96E] uppercase">Our Collections</p>
            <div className="mx-auto mt-4 h-px w-10 bg-[#C9A96E]/60" />
            <div className="mx-auto mt-6 max-w-[720px] space-y-4 text-center text-[15px] leading-[1.85] text-white/80 sm:text-[16px]">
              <p>At Creative Muse, we embrace evolving trends while creating jewelry that remains timeless.</p>
              <p>Every collection is thoughtfully curated to combine elegance, versatility, and lasting quality. From delicate everyday essentials to bold statement pieces, every design is selected to help you express your unique style with confidence.</p>
              <p>Our jewelry is made to be layered, styled your way, and loved for years to come.</p>
              <p className="font-display text-[16px] font-medium italic text-white">Because true style isn’t about following trends—it’s about feeling like the best version of yourself.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto box-border w-full max-w-[760px] px-4 py-10 sm:px-6 sm:py-16">
          <div className="rounded-[24px] border border-[#e0d8cc] bg-white px-6 py-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px] sm:px-10 sm:py-10">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C544D] uppercase">A Note From Our Founder</p>
            <p className="font-display mt-4 text-[18px] font-semibold text-[#1a1a2e] sm:text-[20px]">Hi, I’m Sneha, founder of Creative Muse.</p>
            <div className="mx-auto mt-6 max-w-[620px] space-y-4 text-left text-[15px] leading-[1.85] text-[#3a3028] sm:text-[16px]">
              <p>My entrepreneurial journey began seven years ago with Creative Corner, where I discovered the joy of creating products that became part of people’s most cherished moments.</p>
              <p>As the years passed, I dreamed of creating something women could enjoy every day—not just during celebrations. That dream became Creative Muse.</p>
              <p>Every collection is curated with the same passion, creativity, and attention to detail that has guided me from the very beginning. My goal is simple: to create jewelry that makes every woman feel confident, beautiful, and effortlessly herself.</p>
              <p>Thank you for being part of our journey. I hope every piece you wear reminds you that you never need a special occasion to shine.</p>
            </div>
            <div className="mt-8 text-center">
              <p className="font-display text-[15px] italic text-[#3a3028]">With love,</p>
              <p className="font-display mt-1 text-[18px] font-semibold text-[#1a1a2e]">Sneha</p>
              <p className="text-[12px] tracking-[0.12em] text-[#7a6e64] uppercase">Founder, Creative Muse</p>
            </div>
          </div>
        </section>

        <div className="pb-6 sm:pb-10" />
      </div>
    </PageShell>
  );
}
