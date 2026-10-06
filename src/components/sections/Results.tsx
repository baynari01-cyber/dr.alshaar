"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ChevronIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { resultCases, resultCategories, type ResultCategory } from "@/content/results";

const pad = (n: number) => String(n).padStart(2, "0");

export function Results() {
  const baseId = useId();
  const [category, setCategory] = useState<ResultCategory>(resultCategories[0].id);
  const [index, setIndex] = useState(0);

  const cases = resultCases.filter((c) => c.category === category);
  const current = cases[Math.min(index, cases.length - 1)];
  const meta = resultCategories.find((c) => c.id === category) ?? resultCategories[0];

  const select = (id: ResultCategory) => {
    setCategory(id);
    setIndex(0);
  };

  // Roving focus across tabs (RTL: ArrowLeft moves forward).
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = resultCategories.length;
    const map: Record<string, number> = { ArrowLeft: (i + 1) % n, ArrowRight: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = resultCategories[map[e.key]];
    select(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  return (
    <section id="results" aria-labelledby="results-title" className="bg-ivory pt-20 pb-28 lg:pt-28 lg:pb-40">
      <div className="container-lux">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="02" label="Before / After" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="results-title" className="mt-10 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.15] font-extralight tracking-tight">
                النتائج
                <span className="ms-4 font-serif text-[0.6em] font-light italic text-gold-ink">Before &amp; After</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-8 text-ink-soft">
              تُعرض هنا حالات حقيقية من عمل الدكتور محمد الشعر فقط، وتُنشر بموافقة خطية من أصحابها.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="فئات النتائج"
            className="-mx-5 mt-16 flex gap-8 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] md:mx-0 md:px-0 lg:mt-20 lg:gap-14 [&::-webkit-scrollbar]:hidden"
          >
            {resultCategories.map((c, i) => {
              const active = c.id === category;
              return (
                <button
                  key={c.id}
                  id={`${baseId}-tab-${c.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(c.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative shrink-0 pb-5 text-start transition-colors duration-500 ${active ? "text-ink" : "text-ink-mute hover:text-ink-soft"}`}
                >
                  <span className="block text-base sm:text-lg">{c.ar}</span>
                  <span className="mt-1 block font-serif text-sm italic">{c.en}</span>
                  {active && (
                    <motion.span
                      layoutId={`${baseId}-underline`}
                      className="absolute inset-x-0 -bottom-px h-px bg-ink"
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${category}`}
          className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8"
        >
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BeforeAfterSlider
                  before={current.before}
                  after={current.after}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="aspect-[4/5] w-full sm:aspect-[5/4]"
                />
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 flex items-center gap-3 text-xs text-ink-mute">
              <span aria-hidden className="h-px w-6 bg-current" />
              اسحب الخط للمقارنة بين قبل وبعد
            </p>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9 lg:py-2">
            <div>
              <p className="font-serif text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none font-light italic">{meta.en}</p>
              <p className="mt-4 text-lg">{meta.ar}</p>
              <dl className="mt-10 border-t border-line text-sm">
                <div className="flex justify-between border-b border-line py-4">
                  <dt className="text-ink-mute">الحالة</dt>
                  <dd dir="ltr" className="font-serif text-base italic">
                    {pad(index + 1)} / {pad(cases.length)}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-line py-4">
                  <dt className="text-ink-mute">زاوية التصوير</dt>
                  <dd dir="ltr" className="font-serif text-base italic">{current.viewEn}</dd>
                </div>
                <div className="flex justify-between border-b border-line py-4">
                  <dt className="text-ink-mute">التوثيق</dt>
                  <dd className={current.verified ? "text-ink" : "text-gold-ink"}>
                    {current.verified ? "حالة موثّقة بموافقة المريض" : "بانتظار إضافة حالة موثّقة"}
                  </dd>
                </div>
              </dl>
            </div>

            {cases.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i - 1 + cases.length) % cases.length)}
                  aria-label="الحالة السابقة"
                  className="grid h-12 w-12 place-items-center border border-line-strong transition-colors hover:border-ink"
                >
                  <ChevronIcon className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % cases.length)}
                  aria-label="الحالة التالية"
                  className="grid h-12 w-12 place-items-center border border-line-strong transition-colors hover:border-ink"
                >
                  <ChevronIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
