import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { media } from "@/content/media";

const pillars = [
  { en: "Natural", title: "نتائج طبيعية", copy: "تحسين الملامح دون تغيير هوية الوجه." },
  { en: "Form & Function", title: "الوظيفة والجمال", copy: "الاهتمام بالشكل والأداء الوظيفي معًا." },
  { en: "Bespoke", title: "خطة لكل حالة", copy: "كل وجه مختلف، لذلك كل خطة يجب أن تكون مصممة بشكل فردي." },
] as const;

export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="relative isolate overflow-hidden bg-night py-28 text-ivory lg:py-44">
      <Media asset={media.clinic.entrance} sizes="100vw" className="absolute inset-0 -z-20" imageClassName="opacity-60" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_18_15/0.92)_0%,rgb(20_18_15/0.78)_45%,rgb(20_18_15/0.95)_100%)]" />

      <div className="container-lux">
        <Reveal>
          <SectionLabel index="05" label="Why Dr. Alshaar" tone="light" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="pillars-title" className="mt-10 text-[clamp(2.6rem,6.5vw,6rem)] leading-[1.1] font-extralight tracking-tight">
            الجمال في <span className="text-gold-light">التفاصيل.</span>
          </h2>
        </Reveal>

        <ol className="mt-20 grid gap-4 md:grid-cols-3 lg:mt-28 lg:gap-6">
          {pillars.map((p, i) => (
            <li key={p.title}>
              <Reveal
                delay={0.1 * i}
                className="h-full border border-ivory/12 bg-night/55 p-8 backdrop-blur-md transition-colors duration-700 hover:border-gold-light/50 lg:p-10"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-5xl leading-none font-light text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                  <span className="eyebrow text-ivory/45">{p.en}</span>
                </div>
                <h3 className="mt-12 text-2xl font-normal">{p.title}</h3>
                <p className="mt-4 max-w-xs leading-8 text-ivory/65">{p.copy}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
