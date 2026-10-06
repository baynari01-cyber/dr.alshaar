"use client";

import { animate, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { MediaAsset } from "@/content/media";
import { Media } from "./Media";

type BeforeAfterSliderProps = {
  before: MediaAsset;
  after: MediaAsset;
  sizes: string;
  className?: string;
};

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Draggable comparison. Geometry is physical (LTR): "before" sits on the
 * right — where an Arabic reader starts — and "after" on the left.
 * `position` is the divider's distance from the left edge, in %.
 */
export function BeforeAfterSlider({ before, after, sizes, className = "" }: BeforeAfterSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });

  // One gentle sweep the first time the slider is seen, hinting that it moves.
  useEffect(() => {
    if (!inView || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(50, [50, 62, 40, 50], {
      duration: 2.4,
      ease: "easeInOut",
      delay: 0.4,
      onUpdate: (v) => {
        if (!touched.current) setPosition(v);
      },
    });
    return () => controls.stop();
  }, [inView]);

  const fromClientX = useCallback((clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) fromClientX(e.clientX);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const next: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowRight: position + step,
      Home: 0,
      End: 100,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    touched.current = true;
    setPosition(clamp(next[e.key]));
  };

  const beforeShown = Math.round(100 - position);
  // Placeholder panes carry their caption at the bottom; keep labels clear of it.
  const labelY = before.src && after.src ? "bottom-5" : "top-5";

  return (
    <div
      ref={rootRef}
      dir="ltr"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative cursor-ew-resize touch-pan-y overflow-hidden select-none ${className}`}
    >
      <Media asset={after} sizes={sizes} tone="light" className="absolute inset-0" imageClassName="pointer-events-none" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <Media
          asset={before}
          sizes={sizes}
          tone="deep"
          labelSide="right"
          className="absolute inset-0"
          imageClassName="pointer-events-none"
        />
      </div>

      <span
        aria-hidden
        className={`eyebrow absolute ${labelY} right-5 bg-ivory/85 px-3 py-1.5 text-ink transition-opacity duration-300`}
        style={{ opacity: position > 85 ? 0 : 1 }}
      >
        قبل
      </span>
      <span
        aria-hidden
        className={`eyebrow absolute ${labelY} left-5 bg-ink/85 px-3 py-1.5 text-ivory transition-opacity duration-300`}
        style={{ opacity: position < 15 ? 0 : 1 }}
      >
        بعد
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label="مقارنة قبل وبعد"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={beforeShown}
        aria-valuetext={`قبل ${beforeShown}٪ — بعد ${100 - beforeShown}٪`}
        onKeyDown={onKeyDown}
        className="group absolute inset-y-0 w-11 -translate-x-1/2 focus-visible:outline-none"
        style={{ left: `${position}%` }}
      >
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ivory shadow-[0_0_0_0.5px_rgb(28_26_23/0.25)]" />
        <span
          aria-hidden
          className={`absolute top-1/2 left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-ivory/90 text-ink shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md transition-transform duration-500 ease-lux group-focus-visible:ring-1 group-focus-visible:ring-gold group-focus-visible:ring-offset-2 ${
            dragging ? "scale-90" : "scale-100"
          }`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
