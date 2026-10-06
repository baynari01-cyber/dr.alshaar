import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { testimonials, type Testimonial } from "@/content/testimonials";

// DEV-ONLY PLACEHOLDERS — never rendered in production builds.
const devPlaceholders: readonly Testimonial[] = [1, 2, 3].map((n) => ({
  id: `placeholder-${n}`,
  quote: "مكان مراجعة موثّقة من أحد المرضى — تُنسخ حرفيًا من مصدرها المنشور.",
  author: `اسم المراجِع ${n}`,
  source: "Google",
}));

/**
 * Hidden in production until verified reviews are added to
 * `src/content/testimonials.ts`.
 */
export function Testimonials() {
  const isPlaceholder = testimonials.length === 0;
  if (isPlaceholder && process.env.NODE_ENV === "production") return null;
  const items = isPlaceholder ? devPlaceholders : testimonials;

  return (
    <section aria-labelledby="testimonials-title" className="py-28 lg:py-40" data-dev-placeholder={isPlaceholder || undefined}>
      <div className="container-lux">
        {isPlaceholder && (
          <p dir="ltr" className="mb-10 border border-dashed border-gold px-4 py-3 text-center font-mono text-xs text-gold-ink">
            DEV PLACEHOLDER — section hidden in production until verified reviews exist in src/content/testimonials.ts
          </p>
        )}
        <Reveal>
          <SectionLabel label="Patients" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="testimonials-title" className="mt-10 text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.15] font-extralight tracking-tight">
            بكلمات المرضى
          </h2>
        </Reveal>
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-24">
          {items.map((t, i) => (
            <li key={t.id}>
              <Reveal delay={0.08 * i}>
                <figure className="border-t border-line-strong pt-8">
                  <span aria-hidden className="block font-serif text-6xl leading-[0.6] text-gold">&rdquo;</span>
                  <blockquote className="mt-6 text-lg leading-9 font-light">{t.quote}</blockquote>
                  <figcaption className="mt-8 flex items-baseline justify-between text-sm">
                    <span>{t.author}</span>
                    <span className="eyebrow text-ink-mute">{t.source}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
