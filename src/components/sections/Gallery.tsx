"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gallery } from "@/content/media";

/** Position within a group of four → tile shape. */
const tile = [
  { mobile: "row-span-2", desktop: "lg:col-span-4 lg:row-span-2", sizes: "(min-width: 1024px) 30vw, 50vw" },
  { mobile: "", desktop: "lg:col-span-4", sizes: "(min-width: 1024px) 30vw, 50vw" },
  { mobile: "col-span-2", desktop: "lg:col-span-8", sizes: "(min-width: 1024px) 60vw, 100vw" },
  { mobile: "", desktop: "lg:col-span-4", sizes: "(min-width: 1024px) 30vw, 50vw" },
] as const;

const groups = Array.from({ length: Math.ceil(gallery.length / 4) }, (_, g) => gallery.slice(g * 4, g * 4 + 4));

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const assets = gallery.map((g) => g.asset);

  return (
    <section aria-labelledby="gallery-title" className="border-t border-line bg-ivory py-28 lg:py-40">
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
            <p className="leading-8 text-ink-soft">مرضى حقيقيون، ونتائج حقيقية، من داخل عيادة الدكتور محمد الشعر.</p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-3 lg:mt-24 lg:space-y-6">
          {groups.map((group, g) => (
            <ul
              key={g}
              className="grid auto-rows-[44vw] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[36vw] lg:h-[clamp(30rem,50vw,48rem)] lg:auto-rows-fr lg:grid-cols-12 lg:grid-rows-2 lg:gap-6"
            >
              {group.map((item, i) => {
                const flat = g * 4 + i;
                const t = tile[i];
                // Mirror every other group on desktop so the rhythm alternates.
                const mirror = g % 2 === 1 && i === 0 ? "lg:col-start-9" : "";
                return (
                  <li key={item.id} className={`${t.mobile} ${t.desktop} ${mirror}`}>
                    <button
                      type="button"
                      onClick={() => setActive(flat)}
                      aria-label={`عرض الصورة: ${item.asset.alt}`}
                      className="group relative block h-full w-full overflow-hidden"
                    >
                      <Media
                        asset={item.asset}
                        sizes={t.sizes}
                        tone={flat % 3 === 1 ? "deep" : "light"}
                        compact={i !== 0 && i !== 2}
                        className="h-full w-full"
                        imageClassName="transition-transform duration-[1.6s] ease-lux group-hover:scale-[1.04]"
                      />
                      <span aria-hidden className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox items={assets} index={active} onIndexChange={setActive} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
