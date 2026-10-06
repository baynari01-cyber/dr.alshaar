/**
 * Image manifest.
 *
 * Every visual on the site is resolved from this file. An asset whose `src`
 * is `null` renders as a clearly-marked placeholder block (see
 * `components/ui/Media.tsx`, `data-image-placeholder`).
 *
 * To replace a placeholder with a real photograph:
 *   1. Put the file in the matching folder under `/public/images/…`
 *      (doctor, rhinoplasty, otoplasty, clinic, gallery).
 *   2. Set `src` to its public path, e.g. "/images/doctor/portrait-hero.jpg".
 *
 * Only real photographs of Dr. Alshaar, his clinic and his own work may be
 * used. No stock imagery, no generated faces.
 */

export type MediaAsset = {
  /** Public path under `/images/…`, or `null` while the real image is pending. */
  src: string | null;
  /** Arabic alt text describing the real image. */
  alt: string;
  /** Short English caption shown inside the placeholder block. */
  placeholderLabel: string;
  /** Focal point for `object-position`, e.g. "50% 30%". */
  focus?: string;
};

const pending = (alt: string, placeholderLabel: string, focus?: string): MediaAsset => ({
  src: null, // IMAGE PLACEHOLDER — replace with a real image path
  alt,
  placeholderLabel,
  focus,
});

export const media = {
  doctor: {
    hero: pending("د. محمد الشعر في العيادة", "Doctor portrait — hero", "50% 25%"),
    about: pending("صورة شخصية للدكتور محمد الشعر", "Doctor portrait — about", "50% 25%"),
    consult: pending("د. محمد الشعر خلال استشارة", "Doctor in consultation"),
  },
  services: {
    rhinoplasty: pending("تجميل الأنف", "Rhinoplasty — profile"),
    revision: pending("إعادة عمليات تجميل الأنف", "Revision rhinoplasty"),
    otoplasty: pending("تصحيح الأذن البارزة", "Otoplasty"),
    ent: pending("جراحة الأنف والأذن والحنجرة", "ENT surgery — theatre"),
  },
  clinic: {
    interior: pending("عيادة د. محمد الشعر في عمّان", "Clinic interior"),
    reception: pending("استقبال العيادة", "Clinic reception"),
  },
} as const satisfies Record<string, Record<string, MediaAsset>>;

export type GalleryItem = {
  id: string;
  asset: MediaAsset;
  category: "rhinoplasty" | "otoplasty" | "doctor" | "clinic" | "work";
};

/**
 * Editorial gallery, laid out in groups of four (tall · square · wide ·
 * square). Keep the count a multiple of four for a seamless grid. Images live
 * in `/public/images/gallery` or the category folders; patient images
 * require documented consent.
 */
export const gallery: readonly GalleryItem[] = [
  { id: "g1", category: "rhinoplasty", asset: pending("نتيجة تجميل أنف", "Rhinoplasty result") },
  { id: "g2", category: "doctor", asset: pending("د. محمد الشعر", "Doctor at work") },
  { id: "g3", category: "clinic", asset: media.clinic.interior },
  { id: "g4", category: "otoplasty", asset: pending("نتيجة تصحيح أذن", "Otoplasty result") },
  { id: "g5", category: "work", asset: pending("في غرفة العمليات", "Surgical work") },
  { id: "g6", category: "rhinoplasty", asset: pending("نتيجة إعادة تجميل أنف", "Revision result") },
  { id: "g7", category: "doctor", asset: media.doctor.consult },
  { id: "g8", category: "clinic", asset: media.clinic.reception },
];
