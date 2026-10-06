"use client";

import { motion } from "motion/react";

type FaceProfileProps = {
  className?: string;
  /** Show the facial-thirds and nasolabial-angle guides. */
  guides?: boolean;
  /** Delay (s) before the line starts drawing. */
  delay?: number;
};

/** Single-line side profile used as a decorative "precision" motif. */
const PROFILE =
  "M300 20 C250 60 220 130 218 200 C217 225 228 240 224 252 C205 290 180 320 160 348 C152 360 162 372 178 372 C190 372 200 374 206 380 C204 392 198 404 192 416 C196 426 206 428 208 434 C204 442 196 448 198 458 C202 470 214 474 214 484 C206 500 200 512 206 528 C214 548 240 556 262 566 C270 600 274 630 276 690";

const THIRDS = [40, 200, 378, 528] as const;
const ease = [0.65, 0, 0.35, 1] as const;

export function FaceProfile({ className = "", guides = true, delay = 0 }: FaceProfileProps) {
  return (
    <svg viewBox="0 0 400 700" fill="none" aria-hidden className={className}>
      {guides && (
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: delay + 1.4 }}
          stroke="currentColor"
          className="text-gold"
          strokeWidth="0.75"
        >
          {THIRDS.map((y) => (
            <line key={y} x1="110" x2="350" y1={y} y2={y} strokeDasharray="2 6" opacity="0.7" />
          ))}
          <line x1="350" x2="350" y1={THIRDS[0]} y2={THIRDS[3]} opacity="0.7" />
          {THIRDS.map((y) => (
            <line key={`t${y}`} x1="344" x2="356" y1={y} y2={y} />
          ))}
          {/* nasolabial angle */}
          <path d="M206 380 L150 370 M206 380 L188 440" opacity="0.8" />
          <path d="M184 376 A 22 22 0 0 0 200 401" />
          <circle cx="160" cy="348" r="2.5" fill="currentColor" stroke="none" />
          <g fill="currentColor" stroke="none" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="15">
            <text x="364" y="126">I</text>
            <text x="364" y="294">II</text>
            <text x="364" y="458">III</text>
          </g>
        </motion.g>
      )}
      <motion.path
        d={PROFILE}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ pathLength: { duration: 2.6, delay, ease }, opacity: { duration: 0.4, delay } }}
      />
    </svg>
  );
}
