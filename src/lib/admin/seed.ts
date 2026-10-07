import type { PriorSurgery, ProcedureId, TimeSlotId } from "@/lib/booking";
import { addDays, defaultTemplates, toISODate } from "./format";
import type { AdminData, Booking, BookingStatus, ClinicSettings } from "./types";

/**
 * DEMO DATA — fictitious patients used only to showcase the admin panel.
 * Names are generic and the 0790000xxx phone numbers are placeholders.
 * "Reset demo data" in Settings regenerates them relative to today.
 */

export const defaultSettings: ClinicSettings = {
  workingDays: [6, 0, 1, 2, 3, 4], // Saturday–Thursday
  openTime: "10:00",
  closeTime: "18:00",
  slotMinutes: 30,
  templates: defaultTemplates,
};

type SeedRow = {
  name: string;
  procedure: ProcedureId;
  prior?: PriorSurgery;
  age?: number;
  /** Day offset of the appointment (or preferred date) from today. */
  day: number;
  time?: string;
  slot: TimeSlotId;
  status: BookingStatus;
  notes?: string;
  internal?: string;
  /** Hours before now that the request arrived. */
  receivedHoursAgo: number;
};

const rows: readonly SeedRow[] = [
  { name: "لين خالد", procedure: "rhinoplasty", prior: "no", age: 24, day: 2, slot: "evening", status: "new", notes: "أرغب بتعديل بسيط في شكل الأنف من الجانب.", receivedHoursAgo: 1 },
  { name: "عمر سامي", procedure: "otoplasty", age: 19, day: 3, slot: "morning", status: "new", receivedHoursAgo: 3 },
  { name: "ريم يوسف", procedure: "revision", prior: "yes", age: 31, day: 4, slot: "afternoon", status: "new", notes: "أجريت عملية قبل سنتين وأعاني من انسداد في التنفس.", receivedHoursAgo: 6 },
  { name: "زيد مراد", procedure: "ent", age: 42, day: 1, slot: "morning", status: "new", notes: "شخير وانسداد مزمن في الأنف.", receivedHoursAgo: 20 },
  { name: "سلمى عادل", procedure: "unsure", age: 28, day: 5, slot: "evening", status: "new", receivedHoursAgo: 26 },
  { name: "نور حسن", procedure: "rhinoplasty", prior: "no", age: 22, day: 0, time: "10:30", slot: "morning", status: "confirmed", internal: "استشارة أولى — تحضير صور قبل الزيارة.", receivedHoursAgo: 72 },
  { name: "طارق أيمن", procedure: "ent", age: 37, day: 0, time: "12:00", slot: "morning", status: "confirmed", receivedHoursAgo: 50 },
  { name: "هالة ماجد", procedure: "revision", prior: "yes", age: 34, day: 0, time: "15:30", slot: "afternoon", status: "confirmed", internal: "إحضار التقارير الطبية للعملية السابقة.", receivedHoursAgo: 96 },
  { name: "يوسف نادر", procedure: "otoplasty", age: 16, day: 0, time: "17:00", slot: "evening", status: "confirmed", notes: "الحضور مع ولي الأمر.", receivedHoursAgo: 40 },
  { name: "دانة سليم", procedure: "rhinoplasty", prior: "no", age: 26, day: 1, time: "11:00", slot: "morning", status: "confirmed", receivedHoursAgo: 30 },
  { name: "كريم فؤاد", procedure: "rhinoplasty", prior: "no", age: 29, day: 2, time: "13:30", slot: "afternoon", status: "confirmed", receivedHoursAgo: 55 },
  { name: "رنا إبراهيم", procedure: "ent", age: 45, day: 3, time: "10:00", slot: "morning", status: "confirmed", receivedHoursAgo: 60 },
  { name: "فارس جميل", procedure: "otoplasty", age: 21, day: 4, time: "16:30", slot: "evening", status: "confirmed", receivedHoursAgo: 80 },
  { name: "مي عصام", procedure: "rhinoplasty", prior: "no", age: 23, day: 6, time: "14:00", slot: "afternoon", status: "confirmed", receivedHoursAgo: 100 },
  { name: "بشار نبيل", procedure: "revision", prior: "yes", age: 39, day: -1, time: "11:30", slot: "morning", status: "completed", internal: "يحتاج تصوير مقطعي قبل تحديد الخطة.", receivedHoursAgo: 150 },
  { name: "جنى رامي", procedure: "rhinoplasty", prior: "no", age: 25, day: -2, time: "16:00", slot: "afternoon", status: "completed", internal: "مرشحة للعملية — إرسال تفاصيل التكلفة.", receivedHoursAgo: 170 },
  { name: "سامر وليد", procedure: "ent", age: 51, day: -2, time: "10:30", slot: "morning", status: "no_show", receivedHoursAgo: 190 },
  { name: "آية منير", procedure: "otoplasty", age: 18, day: -3, time: "12:30", slot: "morning", status: "completed", receivedHoursAgo: 210 },
  { name: "حمزة عماد", procedure: "rhinoplasty", prior: "no", age: 30, day: -4, slot: "evening", status: "cancelled", internal: "اعتذر بسبب السفر.", receivedHoursAgo: 230 },
  { name: "لمى فادي", procedure: "unsure", age: 27, day: -6, time: "14:30", slot: "afternoon", status: "completed", receivedHoursAgo: 280 },
];

/** Moves Friday dates (clinic closed in the demo schedule) to Saturday. */
function workingDate(iso: string, settings: ClinicSettings): string {
  let d = iso;
  for (let i = 0; i < 7 && !settings.workingDays.includes(new Date(`${d}T12:00:00`).getDay()); i++) d = addDays(d, 1);
  return d;
}

export function createDemoData(now: Date = new Date()): AdminData {
  const today = toISODate(now);
  const bookings: Booking[] = rows.map((r, i) => {
    const date = workingDate(addDays(today, r.day), defaultSettings);
    const created = new Date(now.getTime() - r.receivedHoursAgo * 3600_000).toISOString();
    const history: Booking["history"] = [{ at: created, text: "وصل الطلب عبر الموقع" }];
    if (r.status !== "new" && r.time) history.push({ at: new Date(now.getTime() - (r.receivedHoursAgo - 2) * 3600_000).toISOString(), text: "تم تأكيد الموعد" });
    if (r.status === "completed") history.push({ at: `${date}T${r.time ?? "12:00"}:00`, text: "تمت الزيارة" });
    if (r.status === "no_show") history.push({ at: `${date}T${r.time ?? "12:00"}:00`, text: "لم يحضر المريض" });
    if (r.status === "cancelled") history.push({ at: new Date(now.getTime() - (r.receivedHoursAgo - 5) * 3600_000).toISOString(), text: "تم إلغاء الطلب" });
    return {
      id: `demo-${String(i + 1).padStart(2, "0")}`,
      createdAt: created,
      name: r.name,
      phone: `0790000${String(101 + i)}`,
      age: r.age ?? null,
      procedure: r.procedure,
      priorSurgery: r.prior ?? "",
      preferredDate: date,
      preferredTime: r.slot,
      notes: r.notes ?? "",
      status: r.status,
      appointment: r.time ? { date, time: r.time } : null,
      internalNotes: r.internal ?? "",
      source: "demo",
      history,
    };
  });
  return { version: 1, bookings, settings: defaultSettings };
}
