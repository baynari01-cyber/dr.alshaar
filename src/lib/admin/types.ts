import type { PriorSurgery, ProcedureId, TimeSlotId } from "@/lib/booking";

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled" | "no_show";

export type BookingSource = "website" | "phone" | "walk_in" | "demo";

export type HistoryEntry = {
  at: string; // ISO timestamp
  text: string;
};

export type Appointment = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
};

export type Booking = {
  id: string;
  createdAt: string; // ISO timestamp
  name: string;
  phone: string;
  age: number | null;
  procedure: ProcedureId;
  priorSurgery: PriorSurgery;
  /** What the patient asked for. */
  preferredDate: string; // YYYY-MM-DD
  preferredTime: TimeSlotId;
  notes: string;
  status: BookingStatus;
  /** What the clinic scheduled. */
  appointment: Appointment | null;
  internalNotes: string;
  source: BookingSource;
  history: HistoryEntry[];
};

export type MessageTemplates = {
  confirm: string;
  reminder: string;
  reschedule: string;
};

export type ClinicSettings = {
  /** 0 = Sunday … 6 = Saturday. */
  workingDays: number[];
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  slotMinutes: 15 | 20 | 30 | 45 | 60;
  templates: MessageTemplates;
};

export type AdminData = {
  version: 1;
  bookings: Booking[];
  settings: ClinicSettings;
};
