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
  /** Shape of each half; portrait halves get a narrower, taller frame. */
  orientation?: "portrait" | "landscape";
};

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

const PROCEDURE_AR: Record<ResultCategory, string> = {
  rhinoplasty: "عملية تجميل الأنف",
  revision: "إعادة عملية تجميل الأنف",
  otoplasty: "عملية تصحيح الأذن البارزة",
};

const FOLDER: Record<ResultCategory, string> = {
  rhinoplasty: "rhinoplasty",
  revision: "rhinoplasty",
  otoplasty: "otoplasty",
};

/**
 * Before/after pairs from the clinic's own archive or its Facebook page,
 * split into aligned halves.
 */
const archiveCase = (
  id: string,
  viewEn: string,
  viewAr: string,
  orientation: "portrait" | "landscape",
  category: ResultCategory = "rhinoplasty",
  sourceUrl?: string,
): ResultCase => ({
  id,
  category,
  viewEn,
  orientation,
  sourceUrl,
  before: {
    src: `/images/${FOLDER[category]}/${id}-before.jpg`,
    alt: `قبل ${PROCEDURE_AR[category]} — ${viewAr}`,
    placeholderLabel: "Before",
  },
  after: {
    src: `/images/${FOLDER[category]}/${id}-after.jpg`,
    alt: `بعد ${PROCEDURE_AR[category]} — ${viewAr}`,
    placeholderLabel: "After",
  },
  verified: true,
});

const facebookPhoto = (fbid: string) => `https://www.facebook.com/photo.php?fbid=${fbid}`;

const POST_DdHaOfKCFPw = "https://www.instagram.com/p/DdHaOfKCFPw/";

export const resultCases: readonly ResultCase[] = [
  archiveCase("rh-05", "Profile view", "منظر جانبي", "portrait"),
  archiveCase("rh-06", "Profile view", "منظر جانبي", "portrait"),
  archiveCase("rh-07", "Oblique view", "منظر مائل", "landscape"),
  instagramCase("rh-01", "Profile view", "منظر جانبي", POST_DdHaOfKCFPw),
  instagramCase("rh-02", "Frontal view", "منظر أمامي", POST_DdHaOfKCFPw),
  instagramCase("rh-03", "Oblique view", "منظر مائل", POST_DdHaOfKCFPw),
  instagramCase("rh-04", "Base view", "منظر سفلي", POST_DdHaOfKCFPw),
  archiveCase("rv-01", "Oblique view", "منظر مائل", "landscape", "revision", facebookPhoto("122316283118020109")),
  archiveCase("rv-02", "Profile view", "منظر جانبي", "landscape", "revision", facebookPhoto("122315502182020109")),
  archiveCase("rv-03", "Base view", "منظر سفلي", "landscape", "revision", facebookPhoto("122315502398020109")),
  archiveCase("ot-01", "Lateral view", "منظر جانبي", "portrait", "otoplasty", facebookPhoto("122290809224020109")),
  archiveCase("ot-02", "Lateral view", "منظر جانبي", "portrait", "otoplasty", facebookPhoto("122157158126020109")),
  archiveCase("ot-03", "Lateral view", "منظر جانبي", "portrait", "otoplasty", facebookPhoto("122171549942020109")),
  archiveCase("ot-04", "Posterior view", "منظر خلفي", "portrait", "otoplasty", facebookPhoto("122290809116020109")),
];
