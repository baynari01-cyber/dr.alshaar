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
    hero: {
      src: "/images/doctor/doctor-endoscopic-surgery.jpg",
      alt: "د. محمد الشعر خلال عملية بالمنظار",
      placeholderLabel: "Doctor — hero",
      focus: "72% 50%",
    },
    about: {
      src: "/images/doctor/doctor-microscope-surgery.jpg",
      alt: "د. محمد الشعر يجري عملية باستخدام المجهر الجراحي",
      placeholderLabel: "Doctor — about",
      focus: "66% 50%",
    },
    consult: pending("د. محمد الشعر خلال استشارة", "Doctor in consultation"),
  },
  services: {
    rhinoplasty: {
      src: "/images/gallery/rhinoplasty-profile-week1.jpg",
      alt: "تجميل الأنف — قبل وبعد، منظر جانبي",
      placeholderLabel: "Rhinoplasty",
    },
    revision: pending("إعادة عمليات تجميل الأنف", "Revision rhinoplasty"),
    otoplasty: {
      src: "/images/otoplasty/otoplasty-result-01.jpg",
      alt: "نتيجة عملية تصحيح الأذن البارزة",
      placeholderLabel: "Otoplasty",
      focus: "50% 35%",
    },
    ent: {
      src: "/images/doctor/doctor-microscope-surgery.jpg",
      alt: "جراحة الأذن باستخدام المجهر الجراحي",
      placeholderLabel: "ENT surgery",
      focus: "38% 50%",
    },
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

const fromInstagram = (src: string, alt: string): MediaAsset => ({ src, alt, placeholderLabel: "Result" });

/**
 * Editorial gallery — real results published by Dr. Alshaar on Instagram
 * (@dr.alshaar), faces blurred by the clinic. Patient images require
 * documented consent; add new files to `/public/images/gallery`.
 */
export const gallery: readonly GalleryItem[] = [
  { id: "g1", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-profile-week1.jpg", "تجميل الأنف — منظر جانبي، النتيجة بعد أسبوع عند فك الجبيرة") },
  { id: "g2", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-profile.jpg", "تجميل الأنف — قبل وبعد، منظر جانبي") },
  { id: "g3", category: "otoplasty", asset: fromInstagram("/images/otoplasty/otoplasty-result-01.jpg", "نتيجة عملية تصحيح الأذن البارزة") },
  { id: "g4", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-three-quarter-week1.jpg", "تجميل الأنف — منظر مائل، النتيجة بعد أسبوع عند فك الجبيرة") },
  { id: "g5", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-oblique.jpg", "تجميل الأنف — قبل وبعد، منظر مائل") },
  { id: "g6", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-frontal-week1.jpg", "تجميل الأنف — منظر أمامي، النتيجة بعد أسبوع عند فك الجبيرة") },
  { id: "g7", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-profile-left-week1.jpg", "تجميل الأنف — منظر جانبي، النتيجة بعد أسبوع عند فك الجبيرة") },
  { id: "g8", category: "rhinoplasty", asset: fromInstagram("/images/gallery/rhinoplasty-base-week1.jpg", "تجميل الأنف — منظر سفلي، النتيجة بعد أسبوع عند فك الجبيرة") },
];
