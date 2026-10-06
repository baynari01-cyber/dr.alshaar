import { FaceProfile } from "@/components/art/FaceProfile";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { links } from "@/content/site";

export function Consultation() {
  return (
    <section aria-labelledby="consult-title" className="relative isolate overflow-hidden bg-night text-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 end-[-6%] -z-10 hidden w-[42%] opacity-40 md:block">
        <FaceProfile guides={false} className="h-full w-full text-gold-light" />
      </div>
      <div className="container-lux py-32 lg:py-48">
        <Reveal>
          <p className="flex items-center gap-4 text-gold-light">
            <span aria-hidden className="h-px w-10 bg-current" />
            <span className="eyebrow">Consultation</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="consult-title" className="mt-10 text-[clamp(3.25rem,10vw,9rem)] leading-[1] font-extralight tracking-tight">
            ابدأ باستشارة.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-md text-lg leading-9 text-ivory/70 lg:text-xl">
            النتيجة المناسبة تبدأ بفهم ما تبحث عنه.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-14 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href={links.whatsapp} external variant="gold" icon={<WhatsAppIcon />}>
            احجز عبر WhatsApp
          </ButtonLink>
          <ButtonLink href={links.tel} variant="outline-light" icon={<PhoneIcon />}>
            اتصل بالعيادة
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
