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
   * Must be `true` only for real cases by Dr. Alshaar, published with the
   * patient's written consent. Unverified slots render as placeholders.
   */
  verified: boolean;
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

export const resultCases: readonly ResultCase[] = [
  slot("rh-01", "rhinoplasty", "Profile view"),
  slot("rh-02", "rhinoplasty", "Three-quarter view"),
  slot("rv-01", "revision", "Profile view"),
  slot("ot-01", "otoplasty", "Posterior view"),
];
