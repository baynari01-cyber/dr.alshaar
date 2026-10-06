import { TextLink } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { media } from "@/content/media";
import { contact, credentials, doctor, links } from "@/content/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-ivory-deep py-28 lg:py-40">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-8">
        <Reveal className="relative self-start lg:col-span-5">
          <Media
            asset={media.doctor.about}
            sizes="(min-width: 1024px) 38vw, 100vw"
            tone="deep"
            className="aspect-[4/5] w-full"
          />
          <p
            aria-hidden
            className="absolute -bottom-6 start-6 bg-ivory-deep px-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none italic text-gold-ink lg:-start-10"
          >
            Alshaar
          </p>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <Reveal>
            <SectionLabel index="03" label="The Surgeon" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="about-title" className="mt-10 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.15] font-extralight tracking-tight">
              خبرة طبية.
              <br />
              <span className="text-gold-ink">رؤية جمالية.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 lg:mt-14">
            <p className="text-2xl font-normal">{doctor.nameAr}</p>
            <p className="mt-3 max-w-md leading-8 text-ink-soft">
              {doctor.specialtyAr}
              <br />
              {doctor.specialtyAesthAr}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-12 border-t border-line-strong lg:mt-16" aria-label="المؤهلات">
              {credentials.map((c, i) => (
                <li key={c.en} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-line py-5 sm:grid-cols-[3rem_1fr]">
                  <span className="font-serif text-base italic text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-serif text-[1.55rem] leading-tight">{c.en}</p>
                    <p className="mt-1.5 text-sm text-ink-mute">{c.ar}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25} className="mt-10">
            <TextLink href={links.instagram} target="_blank" rel="noopener noreferrer">
              تابع أعمال الدكتور على Instagram <span dir="ltr">@{contact.instagramHandle}</span>
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
