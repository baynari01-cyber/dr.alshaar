import type { MediaAsset } from "./media";

export type ResultCategory = "rhinoplasty" | "revision" | "otoplasty";

export const resultCategories: readonly { id: ResultCategory; en: string; ar: string }[] = [
  { id: "rhinoplasty", en: "Rhinoplasty", ar: "تجميل الأنف" },
  { id: "revision", en: "Revision Rhinoplasty", ar: "إعادة تجميل الأنف" },
  { id: "otoplasty", en: "Otoplasty", ar: "تصحيح الأذن البارزة" },
];

export type ResultCase = {
  id: string;
  category: ResultCategory;
  /** Angle of the photographs, shown as a quiet caption. */
  viewEn: string;
  before: MediaAsset;
  after: MediaAsset;
  /**
   * Must be `true` only for real cases by Dr. Alshaar that he has published
   * himself (with the patient's consent). Unverified slots render as placeholders.
   */
  verified: boolean;
  /** Original publication of the photographs. */
  sourceUrl?: string;
};

const slot = (id: string, category: ResultCategory, viewEn: string): ResultCase => ({
  id,
  category,
  viewEn,
  // IMAGE PLACEHOLDER — replace with real, consented before/after photographs
  before: { src: null, alt: "صورة قبل الإجراء", placeholderLabel: "Before — verified case" },
  after: { src: null, alt: "صورة بعد الإجراء", placeholderLabel: "After — verified case" },
  verified: false,
});

/**
 * Halves of the before/after composites published by Dr. Alshaar on
 * Instagram (faces blurred by the clinic, watermark kept).
 */
const instagramCase = (id: string, viewEn: string, viewAr: string, sourceUrl: string): ResultCase => ({
  id,
  category: "rhinoplasty",
  viewEn,
  before: {
    src: `/images/rhinoplasty/${id}-before.jpg`,
    alt: `قبل عملية تجميل الأنف — ${viewAr}`,
    placeholderLabel: "Before",
  },
  after: {
    src: `/images/rhinoplasty/${id}-after.jpg`,
    alt: `بعد عملية تجميل الأنف — ${viewAr}`,
    placeholderLabel: "After",
  },
  verified: true,
  sourceUrl,
});

const POST_DdHaOfKCFPw = "https://www.instagram.com/p/DdHaOfKCFPw/";

export const resultCases: readonly ResultCase[] = [
  instagramCase("rh-01", "Profile view", "منظر جانبي", POST_DdHaOfKCFPw),
  instagramCase("rh-02", "Frontal view", "منظر أمامي", POST_DdHaOfKCFPw),
  instagramCase("rh-03", "Oblique view", "منظر مائل", POST_DdHaOfKCFPw),
  instagramCase("rh-04", "Base view", "منظر سفلي", POST_DdHaOfKCFPw),
  slot("rv-01", "revision", "Profile view"),
  slot("ot-01", "otoplasty", "Posterior view"),
];
