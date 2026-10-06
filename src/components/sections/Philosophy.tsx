import { FaceProfile } from "@/components/art/FaceProfile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative overflow-hidden border-t border-line pt-28 pb-12 lg:pt-44 lg:pb-16">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <Reveal>
            <SectionLabel index="01" label="Philosophy" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              id="philosophy-title"
              className="mt-12 text-[clamp(2.1rem,5.2vw,4.75rem)] leading-[1.25] font-extralight tracking-tight lg:mt-16"
            >
              النتيجة الأفضل
              <br />
              <span className="text-ink-soft">هي التي تبدو وكأنها كانت</span>
              <br />
              <span className="text-ink-soft">دائمًا جزءًا منك.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-20">
            <p className="text-lg leading-9 text-ink-soft sm:col-start-2">
              الهدف ليس تغيير ملامح الوجه، بل تحسين التوازن والتناسق مع الحفاظ على الهوية الطبيعية لكل شخص.
            </p>
          </Reveal>
        </div>
        <div aria-hidden className="relative hidden lg:col-span-4 lg:block">
          <FaceProfile className="absolute inset-y-0 end-0 h-full w-full text-ink/80" delay={0.2} />
        </div>
      </div>
    </section>
  );
}
