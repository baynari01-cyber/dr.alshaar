import { BookingForm } from "@/components/booking/BookingForm";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { contact, links } from "@/content/site";

export function Consultation() {
  return (
    <section id="booking" aria-labelledby="consult-title" className="relative isolate overflow-hidden bg-night text-ivory">
      <div className="container-lux grid gap-16 py-28 lg:grid-cols-12 lg:gap-10 lg:py-40">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="flex items-center gap-4 text-gold-light">
              <span aria-hidden className="h-px w-10 bg-current" />
              <span className="eyebrow">Book a Consultation</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="consult-title" className="mt-10 text-[clamp(3rem,5.4vw,5rem)] leading-[1] font-extralight tracking-tight">
              ابدأ باستشارة.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-sm text-lg leading-9 text-ivory/70">النتيجة المناسبة تبدأ بفهم ما تبحث عنه.</p>
          </Reveal>

          <Reveal delay={0.25}>
            <ol className="mt-12 space-y-5 border-t border-night-line pt-8 text-sm text-ivory/65">
              {["عبّئ النموذج في أقل من دقيقة.", "يُفتح WhatsApp وفيه طلبك جاهزًا للإرسال.", "تتواصل معك العيادة لتأكيد الموعد."].map(
                (step, i) => (
                  <li key={step} className="flex items-baseline gap-4">
                    <span className="font-serif text-lg italic text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ),
              )}
            </ol>
          </Reveal>

          <Reveal delay={0.3} className="mt-12 flex flex-wrap gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-3 border border-ivory/25 px-5 text-sm transition-colors hover:border-ivory"
            >
              <WhatsAppIcon /> محادثة مباشرة
            </a>
            <a
              href={links.tel}
              className="inline-flex h-12 items-center gap-3 border border-ivory/25 px-5 text-sm transition-colors hover:border-ivory"
            >
              <PhoneIcon /> <span dir="ltr">{contact.phoneDisplay}</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="border border-night-line bg-night-soft/80 p-6 backdrop-blur-sm sm:p-10 lg:p-12">
            <BookingForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
