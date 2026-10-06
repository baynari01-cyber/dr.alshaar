import { contact } from "@/content/site";

export const procedures = [
  { id: "rhinoplasty", ar: "تجميل الأنف", en: "Rhinoplasty" },
  { id: "revision", ar: "إعادة عملية تجميل الأنف", en: "Revision Rhinoplasty" },
  { id: "otoplasty", ar: "تصحيح الأذن البارزة", en: "Otoplasty" },
  { id: "ent", ar: "مشكلة في الأنف أو الأذن أو الحنجرة", en: "ENT" },
  { id: "unsure", ar: "غير متأكد — أحتاج استشارة", en: "Consultation" },
] as const;

export const timeSlots = [
  { id: "morning", ar: "صباحًا" },
  { id: "afternoon", ar: "بعد الظهر" },
  { id: "evening", ar: "مساءً" },
] as const;

export type ProcedureId = (typeof procedures)[number]["id"];
export type TimeSlotId = (typeof timeSlots)[number]["id"];
export type PriorSurgery = "yes" | "no" | "";

export type BookingInput = {
  name: string;
  phone: string;
  age: string;
  procedure: ProcedureId | "";
  priorSurgery: PriorSurgery;
  date: string;
  time: TimeSlotId | "";
  notes: string;
  consent: boolean;
};

export type BookingField = keyof BookingInput;
export type BookingErrors = Partial<Record<BookingField, string>>;

export const emptyBooking: BookingInput = {
  name: "",
  phone: "",
  age: "",
  procedure: "",
  priorSurgery: "",
  date: "",
  time: "",
  notes: "",
  consent: false,
};

export const LIMITS = { name: 60, notes: 500 } as const;

/** Prior nose surgery is only relevant to nasal procedures. */
export const asksPriorSurgery = (procedure: BookingInput["procedure"]) =>
  procedure === "rhinoplasty" || procedure === "revision";

/** Collapses whitespace so single-line fields cannot inject extra lines. */
const singleLine = (value: string) => value.replace(/\s+/g, " ").trim();

const phoneDigits = (value: string) => value.replace(/[^\d]/g, "");

/** Local date (YYYY-MM-DD) in the visitor's timezone. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function validateBooking(input: BookingInput, today: string = todayISO()): BookingErrors {
  const errors: BookingErrors = {};
  const name = singleLine(input.name);
  if (name.length < 3) errors.name = "يرجى كتابة الاسم الكامل.";
  else if (name.length > LIMITS.name) errors.name = `الاسم طويل جدًا (الحد ${LIMITS.name} حرفًا).`;

  const rawPhone = input.phone.trim();
  const digits = phoneDigits(rawPhone);
  if (!digits) errors.phone = "يرجى كتابة رقم الهاتف.";
  else if (!/^\+?[\d\s()-]+$/.test(rawPhone) || digits.length < 9 || digits.length > 15)
    errors.phone = "رقم الهاتف غير صحيح. مثال: 0791234567 أو ‎+962791234567";

  if (input.age.trim()) {
    const age = Number(input.age);
    if (!Number.isInteger(age) || age < 1 || age > 100) errors.age = "يرجى كتابة عمر صحيح.";
  }

  if (!input.procedure) errors.procedure = "يرجى اختيار سبب الاستشارة.";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.date = "يرجى اختيار التاريخ المفضل.";
  else if (input.date < today) errors.date = "يرجى اختيار تاريخ من اليوم فصاعدًا.";

  if (!input.time) errors.time = "يرجى اختيار الوقت المفضل.";

  if (input.notes.length > LIMITS.notes) errors.notes = `الملاحظات طويلة جدًا (الحد ${LIMITS.notes} حرف).`;

  if (!input.consent) errors.consent = "يرجى الموافقة على التواصل لتأكيد الموعد.";
  return errors;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  // Noon avoids timezone edge cases shifting the calendar day.
  const date = new Date(y, m - 1, d, 12);
  return new Intl.DateTimeFormat("ar-JO-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** WhatsApp-formatted request (`*bold*` renders in WhatsApp). */
export function buildBookingMessage(input: BookingInput): string {
  const procedure = procedures.find((p) => p.id === input.procedure);
  const time = timeSlots.find((t) => t.id === input.time);
  const lines = [
    "*طلب حجز استشارة*",
    "عبر الموقع الإلكتروني — د. محمد الشعر",
    "",
    `*الاسم:* ${singleLine(input.name)}`,
    `*الهاتف:* ${singleLine(input.phone)}`,
  ];
  if (input.age.trim()) lines.push(`*العمر:* ${Number(input.age)}`);
  lines.push(`*سبب الاستشارة:* ${procedure ? procedure.ar : "—"}`);
  if (asksPriorSurgery(input.procedure) && input.priorSurgery)
    lines.push(`*عملية أنف سابقة:* ${input.priorSurgery === "yes" ? "نعم" : "لا"}`);
  lines.push(`*الموعد المفضل:* ${formatDate(input.date)} — ${time ? time.ar : ""}`);
  const notes = input.notes.trim();
  if (notes) lines.push("", "*ملاحظات:*", notes);
  return lines.join("\n");
}

export function bookingWhatsAppUrl(input: BookingInput): string {
  const number = contact.phoneE164.replace("+", "");
  return `https://wa.me/${number}?text=${encodeURIComponent(buildBookingMessage(input))}`;
}
