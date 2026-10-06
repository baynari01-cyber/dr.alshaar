import Image from "next/image";
import type { ReactNode } from "react";
import type { MediaAsset } from "@/content/media";

type Tone = "light" | "deep" | "night";

type MediaProps = {
  asset: MediaAsset;
  /** Responsive `sizes` hint for next/image. */
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Above-the-fold images only. */
  preload?: boolean;
  tone?: Tone;
  /** Optional decorative layer rendered above a placeholder. */
  placeholderArt?: ReactNode;
  /** Hide the textual placeholder caption (e.g. inside small thumbnails). */
  compact?: boolean;
  /** Physical side for the placeholder caption. */
  labelSide?: "left" | "right";
};

const toneClass: Record<Tone, string> = {
  light: "bg-sand text-ink-mute",
  deep: "bg-[#ddd2c1] text-ink-soft",
  night: "bg-[#24211d] text-gold-light/70",
};

/**
 * Renders a real photograph through next/image, or — while `asset.src` is
 * `null` — a clearly-marked placeholder block (`data-image-placeholder`).
 * The parent decides the aspect ratio; this fills it.
 */
export function Media({
  asset,
  sizes,
  className = "",
  imageClassName = "",
  preload = false,
  tone = "light",
  placeholderArt,
  compact = false,
  labelSide = "left",
}: MediaProps) {
  const positioned = /\b(absolute|fixed)\b/.test(className);
  return (
    <div className={`${positioned ? "" : "relative"} overflow-hidden ${className}`}>
      {asset.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          preload={preload}
          quality={85}
          className={`object-cover ${imageClassName}`}
          style={asset.focus ? { objectPosition: asset.focus } : undefined}
        />
      ) : (
        // IMAGE PLACEHOLDER — set `src` for this asset in src/content/media.ts
        <div
          data-image-placeholder="true"
          role="img"
          aria-label={asset.alt}
          className={`hatch absolute inset-0 ${toneClass[tone]} ${imageClassName}`}
        >
          {placeholderArt}
          <span aria-hidden className="absolute inset-3 border border-current opacity-20" />
          {!compact && (
            <span
              aria-hidden
              dir="ltr"
              className={`absolute bottom-5 flex flex-col gap-1 ${labelSide === "left" ? "left-5 items-start" : "right-5 items-end"}`}
            >
              <span className="eyebrow">{asset.placeholderLabel}</span>
              <span className="text-[0.625rem] tracking-[0.18em] uppercase opacity-70">
                Image placeholder
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
