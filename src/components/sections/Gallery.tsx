"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gallery } from "@/content/media";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const assets = gallery.map((g) => g.asset);

  return (
    <section aria-labelledby="gallery-title" className="bg-ivory-deep py-28 lg:py-40">
      <div className="container-lux">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionLabel index="06" label="Gallery" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="gallery-title" dir="ltr" className="mt-10 text-right font-serif text-[clamp(3rem,7.5vw,7rem)] leading-[0.95] font-light tracking-tight">
                Real patients.
                <br />
                <span className="italic text-gold-ink">Real results.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-3 lg:col-start-10">
            <p className="leading-8 text-ink-soft">مرضى حقيقيون، ونتائج حقيقية، كما نشرها الدكتور محمد الشعر على حسابه الرسمي.</p>
          </Reveal>
        </div>

        {/* Staggered editorial columns: every second tile drops for an asymmetric rhythm. */}
        <ul className="mt-16 grid grid-cols-2 gap-x-3 gap-y-6 pb-12 lg:mt-24 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10 lg:pb-24">
          {gallery.map((item, i) => (
            <li key={item.id} className={i % 2 === 1 ? "translate-y-12 lg:translate-y-24" : ""}>
              <Reveal delay={(i % 4) * 0.08}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`عرض الصورة: ${item.asset.alt}`}
                  className="group relative block w-full overflow-hidden"
                >
                  <Media
                    asset={item.asset}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="aspect-[4/5] w-full"
                    imageClassName="transition-transform duration-[1.6s] ease-lux group-hover:scale-[1.04]"
                  />
                  <span aria-hidden className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox items={assets} index={active} onIndexChange={setActive} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
