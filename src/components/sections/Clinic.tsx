import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { media } from "@/content/media";
import { contact, links } from "@/content/site";

const spaces = [
  { asset: media.clinic.entrance, label: "المدخل", en: "Entrance" },
  { asset: media.clinic.reception, label: "الاستقبال", en: "Reception" },
  { asset: media.clinic.treatment, label: "غرفة الفحص والعلاج", en: "Treatment" },
  { asset: media.clinic.exam, label: "غرفة المعاينة", en: "Examination" },
] as const;

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

      {/* Phones: snap carousel. Desktop: four-up editorial row. */}
      <ul
        aria-label="صور العيادة"
        className="mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:px-10 md:scroll-px-10 lg:container-lux lg:mt-28 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {spaces.map((space, i) => (
          <li key={space.en} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
            <Reveal delay={i * 0.08}>
              <figure>
                <Media
                  asset={space.asset}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 72vw"
                  className="aspect-[4/5] w-full"
                />
                <figcaption className="mt-4 flex items-baseline justify-between border-b border-line pb-3">
                  <span className="text-sm">{space.label}</span>
                  <span className="eyebrow text-ink-mute">{space.en}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
