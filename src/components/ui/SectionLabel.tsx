type SectionLabelProps = {
  index?: string;
  label: string;
  tone?: "ink" | "light";
  className?: string;
  align?: "start" | "center";
};

/** Editorial section marker: "02 — Philosophy". */
export function SectionLabel({ index, label, tone = "ink", className = "", align = "start" }: SectionLabelProps) {
  const color = tone === "ink" ? "text-gold-ink" : "text-gold-light";
  return (
    <p dir="ltr" className={`flex items-center gap-4 ${align === "start" ? "justify-end" : "justify-center"} ${color} ${className}`}>
      <span className="eyebrow">{label}</span>
      <span aria-hidden className="h-px w-10 bg-current opacity-60" />
      {index && <span className="font-serif text-lg italic leading-none">{index}</span>}
    </p>
  );
}
