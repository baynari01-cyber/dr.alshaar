import { contact, doctor, links, nav } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-ivory">
      <div className="container-lux pt-20 pb-28 lg:pt-28 lg:pb-12">
        <div className="grid gap-14 border-b border-night-line pb-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[1] tracking-tight">
              Dr. Mohammed
              <br />
              <span className="italic text-gold-light">Alshaar</span>
            </p>
            <p className="mt-6 text-sm text-ivory/60">{doctor.nameAr}</p>
            <p className="eyebrow mt-3 text-ivory/45">
              <span className="block sm:inline">{doctor.titleEn}</span>
              <span className="hidden sm:inline"> · </span>
              <span className="mt-1 block sm:mt-0 sm:inline">{doctor.locationEn}</span>
            </p>
          </div>

          <nav aria-label="روابط التذييل" className="lg:col-span-2">
            <ul className="space-y-3 text-sm text-ivory/70">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6 text-sm lg:col-span-4">
            <div>
              <p className="eyebrow mb-2 text-gold-light/80">
                Phone / WhatsApp
              </p>
              <a href={links.tel} dir="ltr" className="text-lg text-ivory transition-colors hover:text-gold-light">
                {contact.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-2 text-gold-light/80">
                Instagram
              </p>
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="text-lg text-ivory transition-colors hover:text-gold-light"
              >
                @{contact.instagramHandle}
              </a>
            </div>
            <address className="not-italic leading-7 text-ivory/60">{contact.addressLines.join("، ")}</address>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {doctor.nameAr}. جميع الحقوق محفوظة.
          </p>
          <p dir="ltr">{doctor.nameEn} — {doctor.locationEn}</p>
        </div>
      </div>
    </footer>
  );
}
