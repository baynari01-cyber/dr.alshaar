import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { contact, links } from "@/content/site";

export function Clinic() {
  const [city, ...rest] = contact.addressLines;
  return (
    <section id="clinic" aria-labelledby="clinic-title" className="py-28 lg:py-40">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel index="07" label="The Clinic" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="clinic-title" className="mt-10 text-[clamp(3rem,6vw,5.5rem)] leading-none font-extralight tracking-tight">
              {city}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <address className="mt-10 space-y-2 text-xl leading-9 font-light not-italic text-ink-soft">
              {rest.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 border-t border-line pt-8">
            <p className="eyebrow text-ink-mute">Phone / WhatsApp</p>
            <a href={links.tel} dir="ltr" className="mt-3 inline-block font-serif text-3xl transition-colors hover:text-gold-ink">
              {contact.phoneDisplay}
            </a>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 grid grid-cols-2 gap-3">
            <ButtonLink href={links.whatsapp} external icon={<WhatsAppIcon />} className="col-span-2">
              WhatsApp
            </ButtonLink>
            <ButtonLink href={links.tel} variant="outline" size="md" icon={<PhoneIcon />}>
              اتصال
            </ButtonLink>
            <ButtonLink href={links.maps} external variant="outline" size="md" icon={<PinIcon />}>
              Google Maps
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <iframe
              title="موقع العيادة على الخريطة"
              src={links.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.18)_contrast(0.92)_brightness(1.03)]"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-line ring-inset" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
