import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const pillars = [
  { en: "Natural", title: "نتائج طبيعية", copy: "تحسين الملامح دون تغيير هوية الوجه." },
  { en: "Form & Function", title: "الوظيفة والجمال", copy: "الاهتمام بالشكل والأداء الوظيفي معًا." },
  { en: "Bespoke", title: "خطة لكل حالة", copy: "كل وجه مختلف، لذلك كل خطة يجب أن تكون مصممة بشكل فردي." },
] as const;

export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="border-t border-line bg-ivory-deep py-28 lg:py-40">
      <div className="container-lux">
        <Reveal>
          <SectionLabel index="05" label="Why Dr. Alshaar" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="pillars-title" className="mt-10 text-[clamp(2.6rem,6.5vw,6rem)] leading-[1.1] font-extralight tracking-tight">
            الجمال في <span className="text-gold-ink">التفاصيل.</span>
          </h2>
        </Reveal>

        <ol className="mt-20 grid gap-0 md:grid-cols-3 md:gap-10 lg:mt-28 lg:gap-16">
          {pillars.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={0.1 * i} className="border-t border-line-strong pt-8 pb-12 md:pb-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-5xl leading-none font-light text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="eyebrow text-ink-mute">{p.en}</span>
                </div>
                <h3 className="mt-10 text-2xl font-normal">{p.title}</h3>
                <p className="mt-4 max-w-xs leading-8 text-ink-soft">{p.copy}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
