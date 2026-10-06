import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { media } from "@/content/media";

export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative overflow-hidden py-28 lg:py-40">
      <div className="container-lux grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionLabel index="01" label="Philosophy" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              id="philosophy-title"
              className="mt-12 text-[clamp(2.1rem,4.8vw,4.5rem)] leading-[1.25] font-extralight tracking-tight lg:mt-16"
            >
              النتيجة الأفضل
              <br />
              <span className="text-ink-soft">هي التي تبدو وكأنها كانت</span>
              <br />
              <span className="text-gold-ink">دائمًا جزءًا منك.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="mt-12 max-w-md border-s border-gold/50 ps-6 lg:mt-16">
            <p className="text-lg leading-9 text-ink-soft">
              الهدف ليس تغيير ملامح الوجه، بل تحسين التوازن والتناسق مع الحفاظ على الهوية الطبيعية لكل شخص.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative lg:col-span-4 lg:col-start-9">
          <Media
            asset={media.clinic.reception}
            sizes="(min-width: 1024px) 32vw, 100vw"
            className="aspect-[4/5] w-full"
          />
          <p className="mt-4 flex items-baseline justify-between border-b border-line pb-3 text-sm">
            <span>عيادة د. محمد الشعر</span>
            <span className="eyebrow text-ink-mute">Amman</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
