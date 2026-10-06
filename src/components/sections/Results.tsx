"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { ChevronIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/Media";
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
    <section id="results" aria-labelledby="results-title" className="bg-night pt-24 pb-28 text-ivory lg:pt-36 lg:pb-40">
      <div className="container-lux">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="02" label="Before / After" tone="light" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="results-title" className="mt-10 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.15] font-extralight tracking-tight">
                النتائج
                <span className="ms-4 font-serif text-[0.6em] font-light italic text-gold-light">Before &amp; After</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-8 text-ivory/65">
              حالات حقيقية من عمل الدكتور محمد الشعر، مع الحفاظ على خصوصية المرضى.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="فئات النتائج"
            className="-mx-5 mt-16 flex gap-8 overflow-x-auto border-b border-night-line px-5 [scrollbar-width:none] md:mx-0 md:px-0 lg:mt-20 lg:gap-14 [&::-webkit-scrollbar]:hidden"
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
                  className={`relative shrink-0 pb-5 text-start transition-colors duration-500 ${active ? "text-ivory" : "text-ivory/45 hover:text-ivory/75"}`}
                >
                  <span className="block text-base sm:text-lg">{c.ar}</span>
                  <span className="mt-1 block font-serif text-sm italic">{c.en}</span>
                  {active && (
                    <motion.span
                      layoutId={`${baseId}-underline`}
                      className="absolute inset-x-0 -bottom-px h-px bg-gold-light"
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
          <div className="min-w-0 lg:col-span-7">
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
                  className={`w-full ${
                    !current.verified
                      ? "aspect-[4/5] sm:aspect-[5/4]"
                      : current.orientation === "portrait"
                        ? "mx-auto aspect-[4/5] max-w-xl"
                        : "aspect-[8/5]"
                  }`}
                />
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 flex items-center gap-3 text-xs text-ivory/45">
              <span aria-hidden className="h-px w-6 bg-current" />
              اسحب الخط للمقارنة بين قبل وبعد
            </p>

            {cases.length > 1 && (
              <ul aria-label="صور الحالة" className="mt-8 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cases.map((c, i) => (
                  <li key={c.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`${c.viewEn} — ${pad(i + 1)}`}
                      aria-current={i === index || undefined}
                      className={`block overflow-hidden border transition-[opacity,border-color] duration-500 ${
                        i === index ? "border-gold-light opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Media asset={c.after} sizes="96px" tone="night" compact className="h-16 w-16 sm:h-20 sm:w-20" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9 lg:py-2">
            <div>
              <p className="font-serif text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none font-light italic">{meta.en}</p>
              <p className="mt-4 text-lg">{meta.ar}</p>
              <dl className="mt-10 border-t border-night-line text-sm">
                <div className="flex justify-between border-b border-night-line py-4">
                  <dt className="text-ivory/45">الصورة</dt>
                  <dd dir="ltr" className="font-serif text-base italic">
                    {pad(index + 1)} / {pad(cases.length)}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-night-line py-4">
                  <dt className="text-ivory/45">زاوية التصوير</dt>
                  <dd dir="ltr" className="font-serif text-base italic">{current.viewEn}</dd>
                </div>
                <div className="flex justify-between border-b border-night-line py-4">
                  <dt className="text-ivory/45">التوثيق</dt>
                  <dd className={`text-end ${current.verified ? "text-ivory" : "text-gold-light"}`}>
                    {current.verified ? (
                      current.sourceUrl ? (
                        <a
                          href={current.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-b border-ivory/25 pb-0.5 transition-colors hover:border-ivory"
                        >
                          منشورة على حساب الدكتور
                        </a>
                      ) : (
                        "من أرشيف عيادة الدكتور"
                      )
                    ) : (
                      "بانتظار إضافة حالة موثّقة"
                    )}
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
                  className="grid h-12 w-12 place-items-center border border-ivory/25 transition-colors hover:border-ivory"
                >
                  <ChevronIcon className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % cases.length)}
                  aria-label="الحالة التالية"
                  className="grid h-12 w-12 place-items-center border border-ivory/25 transition-colors hover:border-ivory"
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
