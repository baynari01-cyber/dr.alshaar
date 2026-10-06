"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { MediaAsset } from "@/content/media";
import { ChevronIcon, CloseIcon } from "./icons";
import { Media } from "./Media";

type LightboxProps = {
  items: readonly MediaAsset[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const count = items.length;
  const asset = items[index];

  const next = () => onIndexChange((index + 1) % count);
  const prev = () => onIndexChange((index - 1 + count) % count);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") return onClose();
    // RTL reading order: left is "forward".
    if (e.key === "ArrowLeft") return next();
    if (e.key === "ArrowRight") return prev();
    if (e.key === "Tab") {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) < 50) return;
    // In RTL flow the next image sits to the left, so a rightward swipe advances.
    if (dx > 0) next();
    else prev();
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="معرض الصور"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[70] flex flex-col bg-night text-ivory"
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <p dir="ltr" className="font-serif text-lg italic text-ivory/70">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="إغلاق المعرض"
          className="grid h-12 w-12 place-items-center border border-night-line transition-colors hover:border-ivory/60"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative flex flex-1 touch-pan-y items-center justify-center px-5 md:px-24"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full max-h-[78vh] w-full max-w-5xl"
        >
          <Media
            asset={asset}
            sizes="(min-width: 1024px) 64rem, 100vw"
            tone="night"
            className="h-full w-full"
            imageClassName="!object-contain"
          />
        </motion.div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="الصورة السابقة"
              className="absolute right-4 hidden h-14 w-14 place-items-center border border-night-line transition-colors hover:border-ivory/60 md:grid"
            >
              <ChevronIcon className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="الصورة التالية"
              className="absolute left-4 hidden h-14 w-14 place-items-center border border-night-line transition-colors hover:border-ivory/60 md:grid"
            >
              <ChevronIcon />
            </button>
          </>
        )}
      </div>

      <p className="px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-ivory/60 md:pb-8">
        {asset.alt}
      </p>
    </motion.div>
  );
}
