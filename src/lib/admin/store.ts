"use client";

import { useSyncExternalStore } from "react";
import { asksPriorSurgery, type BookingInput } from "@/lib/booking";
import { createDemoData, defaultSettings } from "./seed";
import type { AdminData, Booking, BookingSource, ClinicSettings, HistoryEntry } from "./types";

/**
 * Demo persistence: the admin data lives in this browser's localStorage.
 * A production deployment replaces this module with server actions backed
 * by a database and real authentication — the UI only uses the exported API.
 */

const KEY = "alshaar.admin.v1";
const EVENT = "alshaar-admin-change";

let cache: AdminData | null = null;

function isAdminData(value: unknown): value is AdminData {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<AdminData>;
  return v.version === 1 && Array.isArray(v.bookings) && !!v.settings && Array.isArray(v.settings.workingDays);
}

function load(): AdminData {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isAdminData(parsed)) return { ...parsed, settings: { ...defaultSettings, ...parsed.settings } };
    }
  } catch {
    // Storage unavailable or corrupted — fall back to fresh demo data.
  }
  const seeded = createDemoData();
  persist(seeded);
  return seeded;
}

function persist(data: AdminData) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private mode / quota: keep working in memory for this session.
  }
}

function read(): AdminData {
  if (!cache) cache = load();
  return cache;
}

function commit(next: AdminData) {
  cache = next;
  persist(next);
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      onChange();
    }
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: AdminData = { version: 1, bookings: [], settings: defaultSettings };

/** Live admin data; empty on the server. */
export function useAdminData(): AdminData {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const entry = (text: string): HistoryEntry => ({ at: new Date().toISOString(), text });

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function updateBooking(id: string, patch: Partial<Omit<Booking, "id" | "history">>, historyText?: string) {
  const data = read();
  commit({
    ...data,
    bookings: data.bookings.map((b) =>
      b.id === id ? { ...b, ...patch, history: historyText ? [...b.history, entry(historyText)] : b.history } : b,
    ),
  });
}

export function deleteBooking(id: string) {
  const data = read();
  commit({ ...data, bookings: data.bookings.filter((b) => b.id !== id) });
}

/** Stores a request coming from the booking form (website or manual entry). */
export function addBooking(input: BookingInput, source: BookingSource): Booking {
  const data = read();
  const booking: Booking = {
    id: newId(),
    createdAt: new Date().toISOString(),
    name: input.name.replace(/\s+/g, " ").trim(),
    phone: input.phone.trim(),
    age: input.age.trim() ? Number(input.age) : null,
    procedure: input.procedure || "unsure",
    priorSurgery: asksPriorSurgery(input.procedure) ? input.priorSurgery : "",
    preferredDate: input.date,
    preferredTime: input.time || "morning",
    notes: input.notes.trim(),
    status: "new",
    appointment: null,
    internalNotes: "",
    source,
    history: [entry(source === "website" ? "وصل الطلب عبر الموقع" : "أُضيف الطلب من لوحة الإدارة")],
  };
  commit({ ...data, bookings: [booking, ...data.bookings] });
  return booking;
}

export function updateSettings(patch: Partial<ClinicSettings>) {
  const data = read();
  commit({ ...data, settings: { ...data.settings, ...patch } });
}

export function resetDemoData() {
  commit(createDemoData());
}

const noopSubscribe = () => () => {};
const todayNow = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Today's local date (YYYY-MM-DD) on the client. */
export function useToday(): string {
  return useSyncExternalStore(noopSubscribe, todayNow, () => "");
}
