import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { media, type MediaAsset } from "@/content/media";

type Service = { en: string; ar: string; copy: string; asset: MediaAsset };

const services: readonly Service[] = [
  {
    en: "Rhinoplasty",
    ar: "تجميل الأنف",
    copy: "تحسين شكل الأنف وتناسقه مع ملامح الوجه، مع الحفاظ على التنفس الطبيعي.",
    asset: media.services.rhinoplasty,
  },
  {
    en: "Revision Rhinoplasty",
    ar: "إعادة عمليات تجميل الأنف",
    copy: "معالجة نتائج عمليات سابقة بدقة لاستعادة الشكل والوظيفة.",
    asset: media.services.revision,
  },
  {
    en: "Otoplasty",
    ar: "تصحيح الأذن البارزة",
    copy: "إعادة الأذن إلى وضع طبيعي متناسق مع شكل الرأس.",
    asset: media.services.otoplasty,
  },
  {
    en: "ENT Surgery",
    ar: "جراحة الأنف والأذن والحنجرة",
    copy: "تشخيص وعلاج جراحي لمشاكل الأنف والأذن والحنجرة.",
    asset: media.services.ent,
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-28 lg:py-40">
      <div className="container-lux">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="04" label="Expertise" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="services-title" className="mt-10 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.15] font-extralight tracking-tight">
                الخدمات
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm leading-8 text-ink-soft">
              أربعة مجالات تخصص، يجمعها اهتمام واحد: أن يبقى الوجه متناسقًا، وأن تبقى الوظيفة سليمة.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Phones: edge-to-edge snap carousel. Desktop: four-column editorial grid. */}
      <ol
        aria-label="قائمة الخدمات"
        className="mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] md:px-10 md:scroll-px-10 lg:container-lux lg:mt-24 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {services.map((s, i) => (
          <li key={s.en} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <Reveal delay={i * 0.08} className="group">
              <Media
                asset={s.asset}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 78vw"
                tone={i % 2 ? "deep" : "light"}
                className="aspect-[3/4] w-full"
                imageClassName="transition-transform duration-[1.6s] ease-lux group-hover:scale-[1.04]"
              />
              <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <h3 className="text-xl font-normal">{s.ar}</h3>
                <span className="font-serif text-base italic text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-4 font-serif text-lg italic text-ink">{s.en}</p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{s.copy}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
