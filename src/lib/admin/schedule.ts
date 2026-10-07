import { hhmmOf, minutesOf, parseISODate } from "./format";
import type { Booking, ClinicSettings } from "./types";

export const weekdayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] as const;

/** Week order used in Jordan: Saturday first. */
export const weekOrder = [6, 0, 1, 2, 3, 4, 5] as const;

export const isWorkingDay = (iso: string, settings: ClinicSettings) => settings.workingDays.includes(parseISODate(iso).getDay());

/** All appointment start times for a working day, e.g. ["10:00", "10:30", …]. */
export function daySlots(settings: ClinicSettings): string[] {
  const start = minutesOf(settings.openTime);
  const end = minutesOf(settings.closeTime);
  const slots: string[] = [];
  for (let m = start; m + settings.slotMinutes <= end; m += settings.slotMinutes) slots.push(hhmmOf(m));
  return slots;
}

/** Bookings that occupy the calendar (cancelled requests free their slot). */
export const occupies = (b: Booking) => b.appointment !== null && (b.status === "confirmed" || b.status === "completed" || b.status === "no_show");

export function takenSlots(bookings: readonly Booking[], date: string, exceptId?: string): Set<string> {
  return new Set(
    bookings.filter((b) => b.id !== exceptId && occupies(b) && b.appointment?.date === date).map((b) => b.appointment!.time),
  );
}

/** Saturday that starts the week containing `iso`. */
export function weekStart(iso: string): string {
  const d = parseISODate(iso);
  const offset = (d.getDay() + 1) % 7; // Saturday → 0
  d.setDate(d.getDate() - offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
