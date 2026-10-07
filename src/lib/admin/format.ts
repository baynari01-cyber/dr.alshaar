import { contact, links } from "@/content/site";
import { procedures, timeSlots } from "@/lib/booking";
import type { Booking, BookingSource, BookingStatus, MessageTemplates } from "./types";

export const statusMeta: Record<BookingStatus, { ar: string; tone: string; dot: string }> = {
  new: { ar: "جديد", tone: "bg-[#f3e6cf] text-[#7a5a1f] border-[#e3cfa7]", dot: "bg-[#c08a2e]" },
  confirmed: { ar: "مؤكد", tone: "bg-[#e1ece3] text-[#2f5a3b] border-[#c4d9c8]", dot: "bg-[#3f7a50]" },
  completed: { ar: "تمت الزيارة", tone: "bg-[#e6e3de] text-[#4b463f] border-[#d3cec6]", dot: "bg-[#6f685e]" },
  cancelled: { ar: "ملغى", tone: "bg-[#f1e0dc] text-[#86392c] border-[#e2c3bc]", dot: "bg-[#a6463a]" },
  no_show: { ar: "لم يحضر", tone: "bg-[#ece2ee] text-[#5e3c66] border-[#d9c7dd]", dot: "bg-[#7b4f86]" },
};

export const statusOrder: readonly BookingStatus[] = ["new", "confirmed", "completed", "no_show", "cancelled"];

export const sourceMeta: Record<BookingSource, string> = {
  website: "الموقع",
  phone: "اتصال هاتفي",
  walk_in: "زيارة مباشرة",
  demo: "تجريبي",
};

export const procedureAr = (id: Booking["procedure"]) => procedures.find((p) => p.id === id)?.ar ?? id;
export const timeSlotAr = (id: Booking["preferredTime"]) => timeSlots.find((t) => t.id === id)?.ar ?? id;

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as YYYY-MM-DD. */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};

export const addDays = (iso: string, days: number) => {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

const locale = "ar-JO-u-nu-latn";

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) =>
  new Intl.DateTimeFormat(locale, opts).format(parseISODate(iso));

export const formatDateTime = (isoTimestamp: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(isoTimestamp));

/** "14:30" → "2:30 م" */
export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h < 12 ? "ص" : "م";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
};

export const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const hhmmOf = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/** Normalises Jordanian/international input to digits for wa.me (e.g. 0791234567 → 962791234567). */
export function waNumber(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("07") && digits.length === 10) digits = `962${digits.slice(1)}`;
  return digits.replace(/\D/g, "");
}

export const waLink = (phone: string, text: string) => `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Fills {placeholders} in a clinic message template. */
export function renderTemplate(template: string, booking: Booking): string {
  const values: Record<string, string> = {
    name: booking.name,
    procedure: procedureAr(booking.procedure),
    date: booking.appointment ? formatDate(booking.appointment.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—",
    time: booking.appointment ? formatTime(booking.appointment.time) : "—",
    address: contact.addressLines.join("، "),
    maps: links.maps,
    phone: contact.phoneDisplay,
  };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

export const templatePlaceholders = ["name", "procedure", "date", "time", "address", "maps", "phone"] as const;

export const defaultTemplates: MessageTemplates = {
  confirm: [
    "مرحبًا {name}،",
    "تم تأكيد موعد استشارتك في عيادة د. محمد الشعر.",
    "",
    "📅 {date}",
    "🕐 {time}",
    "📍 {address}",
    "الموقع: {maps}",
    "",
    "نرجو الحضور قبل الموعد بعشر دقائق. للاستفسار: {phone}",
  ].join("\n"),
  reminder: [
    "مرحبًا {name}،",
    "نذكّرك بموعدك غدًا في عيادة د. محمد الشعر.",
    "",
    "📅 {date}",
    "🕐 {time}",
    "📍 {address}",
    "",
    "في حال رغبت بتغيير الموعد يرجى إعلامنا. للاستفسار: {phone}",
  ].join("\n"),
  reschedule: [
    "مرحبًا {name}،",
    "تم تعديل موعدك في عيادة د. محمد الشعر ليصبح:",
    "",
    "📅 {date}",
    "🕐 {time}",
    "",
    "للاستفسار: {phone}",
  ].join("\n"),
};

/** RFC 4180 CSV with a UTF-8 BOM so Excel reads Arabic correctly. */
export function bookingsToCsv(bookings: readonly Booking[]): string {
  const header = ["الاسم", "الهاتف", "العمر", "سبب الاستشارة", "الحالة", "موعد الزيارة", "وقت الزيارة", "التاريخ المفضل", "الوقت المفضل", "المصدر", "ملاحظات المريض", "ملاحظات داخلية", "تاريخ الطلب"];
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = bookings.map((b) =>
    [
      b.name,
      b.phone,
      b.age === null ? "" : String(b.age),
      procedureAr(b.procedure),
      statusMeta[b.status].ar,
      b.appointment?.date ?? "",
      b.appointment?.time ?? "",
      b.preferredDate,
      timeSlotAr(b.preferredTime),
      sourceMeta[b.source],
      b.notes,
      b.internalNotes,
      b.createdAt,
    ].map(esc),
  );
  return "﻿" + [header, ...rows].map((r) => r.join(",")).join("\r\n");
}
