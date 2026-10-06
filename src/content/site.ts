/**
 * Single source of truth for verified doctor & clinic information.
 * Only add facts that have been confirmed by the clinic.
 */

export const doctor = {
  nameAr: "د. محمد الشعر",
  nameEn: "Dr. Mohammed Alshaar",
  titleEn: "ENT & Facial Plastic Surgeon",
  locationEn: "Amman, Jordan",
  specialtyAr: "أخصائي أمراض وجراحة الأنف والأذن والحنجرة",
  specialtyAesthAr: "وتجميل الأنف والأذن",
} as const;

export const credentials = [
  { en: "Jordanian Board", ar: "البورد الأردني في جراحة الأنف والأذن والحنجرة" },
  { en: "European Board", ar: "البورد الأوروبي في جراحة الأنف والأذن والحنجرة" },
  { en: "Former Royal Medical Services", ar: "الخدمات الطبية الملكية سابقًا" },
  { en: "ENT & Facial Plastic Surgery", ar: "جراحة الأنف والأذن والحنجرة وتجميل الوجه" },
] as const;

export const contact = {
  phoneE164: "+962795128805",
  phoneDisplay: "+962 79 512 8805",
  instagramHandle: "dr.alshaar",
  addressLines: ["عمّان", "شارع ابن خلدون", "مجمع جوهرة المملكة رقم 57", "الطابق الثالث"],
  mapsQuery: "Jawharat Al-Mamlaka Complex 57, Ibn Khaldoun Street, Amman, Jordan",
  whatsappMessage: "مرحبًا د. محمد، أرغب بحجز استشارة.",
} as const;

export const links = {
  whatsapp: `https://wa.me/${contact.phoneE164.replace("+", "")}?text=${encodeURIComponent(contact.whatsappMessage)}`,
  tel: `tel:${contact.phoneE164}`,
  instagram: `https://www.instagram.com/${contact.instagramHandle}/`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`,
  mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}&output=embed`,
} as const;

export type NavItem = { href: `#${string}`; label: string };

export const nav: readonly NavItem[] = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن الدكتور" },
  { href: "#services", label: "الخدمات" },
  { href: "#results", label: "النتائج" },
  { href: "#clinic", label: "العيادة" },
];

export const seo = {
  title: "د. محمد الشعر | جراحة وتجميل الأنف والأذن في عمّان",
  description:
    "الموقع الرسمي للدكتور محمد الشعر، أخصائي جراحة الأنف والأذن والحنجرة وتجميل الأنف والأذن في عمّان، الأردن.",
} as const;
