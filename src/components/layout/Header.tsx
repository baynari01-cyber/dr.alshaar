"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { contact, doctor, links, nav } from "@/content/site";
import { CloseIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // No backdrop-filter while the menu is open: it would become the containing
  // block of the fixed overlay.
  const surface = open
    ? "border-b border-line bg-ivory"
    : scrolled
      ? "border-b border-line bg-ivory/90 backdrop-blur-md"
      : "border-b border-transparent bg-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-lux ${surface}`}
    >
      <div
        className={`container-lux flex items-center justify-between transition-[height] duration-700 ease-lux ${
          scrolled ? "h-16" : "h-20 lg:h-24"
        }`}
      >
        <a href="#home" className="flex flex-col leading-none" aria-label={`${doctor.nameAr} — الرئيسية`}>
          <span className="text-[1.05rem] font-medium tracking-tight">{doctor.nameAr}</span>
          <span dir="ltr" className="eyebrow mt-1.5 !text-[0.55rem] text-gold-ink">
            {doctor.titleEn}
          </span>
        </a>

        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative text-sm text-ink-soft transition-colors duration-300 hover:text-ink after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-right after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center bg-ink px-6 text-sm font-medium tracking-wide text-ivory transition-colors duration-500 hover:bg-[#2c2924] sm:inline-flex"
          >
            احجز استشارتك
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className="-me-2 grid h-11 w-11 place-items-center lg:hidden"
          >
            {open ? (
              <CloseIcon />
            ) : (
              <span aria-hidden className="flex w-6 flex-col items-end gap-[7px]">
                <span className="h-px w-6 bg-ink" />
                <span className="h-px w-4 bg-ink" />
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-x-0 bottom-0 ${scrolled ? "top-16" : "top-20"} flex flex-col justify-between overflow-y-auto bg-ivory px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] lg:hidden`}
          >
            <nav aria-label="قائمة الجوال">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.06 * i + 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <a href={item.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-5">
                      <span className="text-[2rem] font-light leading-none">{item.label}</span>
                      <span dir="ltr" className="font-serif text-base italic text-gold-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center justify-center gap-3 bg-ink text-ivory"
              >
                <WhatsAppIcon /> احجز استشارتك
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={links.tel} className="flex h-14 items-center justify-center gap-2 border border-line-strong text-sm">
                  <PhoneIcon /> اتصال
                </a>
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 items-center justify-center gap-2 border border-line-strong text-sm"
                >
                  <InstagramIcon />
                  <span dir="ltr">@{contact.instagramHandle}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
