"use client";

import { useEffect, useState } from "react";
import { links } from "@/content/site";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Thumb-reach booking bar for phones and small tablets. */
export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-700 ease-lux lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2.5">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[3.25rem] flex-1 items-center justify-center gap-3 bg-ink text-[0.95rem] font-medium text-ivory active:bg-[#2c2924]"
        >
          <WhatsAppIcon />
          احجز عبر WhatsApp
        </a>
        <a
          href={links.tel}
          aria-label="اتصل بالعيادة"
          className="grid h-[3.25rem] w-[3.25rem] place-items-center border border-line-strong active:bg-ivory-deep"
        >
          <PhoneIcon />
        </a>
      </div>
    </div>
  );
}
