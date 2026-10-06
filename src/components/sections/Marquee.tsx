const items = ["Rhinoplasty", "Revision Rhinoplasty", "Otoplasty", "ENT Surgery", "Facial Plastic Surgery"] as const;

/** Slow, endless band of specialties between the hero and the story. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-8 font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-light whitespace-nowrap italic lg:px-12">
            {item}
          </span>
          <span aria-hidden className="text-sm text-gold">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div dir="ltr" className="overflow-hidden border-y border-night-line bg-night-soft py-6 text-ivory/80 lg:py-8">
      <div className="flex w-max animate-[marquee_48s_linear_infinite] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
