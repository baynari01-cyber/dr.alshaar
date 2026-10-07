"use client";

import { useId, useState } from "react";
import { formatDate, formatTime, renderTemplate, waLink } from "@/lib/admin/format";
import { addBooking, updateBooking, useAdminData, useToday } from "@/lib/admin/store";
import type { BookingSource } from "@/lib/admin/types";
import { LIMITS, emptyBooking, procedures, timeSlots, validateBooking, type BookingErrors, type BookingInput } from "@/lib/booking";
import { Scheduler } from "./BookingDrawer";
import { Btn, Icons, Overlay, fieldClass, labelClass, useToast } from "./ui";

export type NewBookingPreset = { date?: string; time?: string };

/** Manual entry for phone calls and walk-ins, optionally scheduled straight away. */
export function NewBookingDialog({ preset, onClose, onCreated }: { preset?: NewBookingPreset; onClose: () => void; onCreated: (id: string) => void }) {
  const uid = useId();
  const toast = useToast();
  const today = useToday();
  const { bookings, settings } = useAdminData();
  const [values, setValues] = useState<BookingInput>({ ...emptyBooking, date: preset?.date ?? "", time: "morning", consent: true });
  const [source, setSource] = useState<Exclude<BookingSource, "website" | "demo">>("phone");
  const [scheduleNow, setScheduleNow] = useState(!!preset?.time);
  const [errors, setErrors] = useState<BookingErrors>({});

  const set = <K extends keyof BookingInput>(k: K, v: BookingInput[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const create = (appointment?: { date: string; time: string }, notify = false) => {
    const input = appointment ? { ...values, date: appointment.date } : values;
    const found = validateBooking(input, today || undefined);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    const created = addBooking(input, source);
    if (appointment) {
      updateBooking(created.id, { status: "confirmed", appointment }, `تأكيد الموعد ${formatDate(appointment.date, { day: "numeric", month: "long" })} — ${formatTime(appointment.time)}`);
      if (notify) {
        const message = renderTemplate(settings.templates.confirm, { ...created, status: "confirmed", appointment });
        window.open(waLink(created.phone, message), "_blank", "noopener,noreferrer");
      }
    }
    toast(appointment ? "تمت إضافة الحجز وتأكيد الموعد" : "تمت إضافة الطلب");
    onCreated(created.id);
  };

  const err = (k: keyof BookingInput) =>
    errors[k] ? (
      <p role="alert" className="mt-1 text-xs text-[#86392c]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <Overlay label="إضافة حجز جديد" onClose={onClose}>
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-lg font-medium">إضافة حجز</h2>
        <button type="button" onClick={onClose} aria-label="إغلاق" className="grid h-10 w-10 place-items-center hover:bg-ink/5">
          <Icons.close />
        </button>
      </header>

      <div className="space-y-5 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            الاسم الكامل *
            <input value={values.name} maxLength={LIMITS.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} className={fieldClass} />
            {err("name")}
          </label>
          <label className={labelClass}>
            رقم الهاتف *
            <input dir="ltr" type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} className={`${fieldClass} text-end`} />
            {err("phone")}
          </label>
          <label className={labelClass}>
            سبب الاستشارة *
            <select value={values.procedure} onChange={(e) => set("procedure", e.target.value as BookingInput["procedure"])} aria-invalid={!!errors.procedure} className={fieldClass}>
              <option value="">اختر…</option>
              {procedures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ar}
                </option>
              ))}
            </select>
            {err("procedure")}
          </label>
          <label className={labelClass}>
            العمر
            <input type="number" min={1} max={100} value={values.age} onChange={(e) => set("age", e.target.value)} aria-invalid={!!errors.age} className={fieldClass} />
            {err("age")}
          </label>
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>مصدر الطلب</legend>
            <div className="mt-1.5 flex gap-2">
              {(
                [
                  ["phone", "اتصال هاتفي"],
                  ["walk_in", "زيارة مباشرة"],
                ] as const
              ).map(([v, label]) => (
                <label key={v} className={`flex h-10 flex-1 cursor-pointer items-center justify-center border text-sm ${source === v ? "border-ink bg-ink text-ivory" : "border-line-strong bg-white/60"}`}>
                  <input type="radio" name={`${uid}-source`} className="sr-only" checked={source === v} onChange={() => setSource(v)} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className={`${labelClass} sm:col-span-2`}>
            ملاحظات
            <textarea rows={2} dir="auto" maxLength={LIMITS.notes} value={values.notes} onChange={(e) => set("notes", e.target.value)} className={`${fieldClass} resize-none`} />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={scheduleNow} onChange={(e) => setScheduleNow(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
          تحديد الموعد الآن
        </label>

        {scheduleNow ? (
          <div className="border border-gold/40 bg-[#f6efe2] p-5">
            <Scheduler
              booking={{
                id: "new",
                preferredDate: preset?.date ?? today,
                preferredTime: values.time || "morning",
                appointment: preset?.date && preset.time ? { date: preset.date, time: preset.time } : null,
              }}
              bookings={bookings}
              settings={settings}
              title="موعد الزيارة"
              onSubmit={(date, time, notify) => create({ date, time }, notify)}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              التاريخ المفضل *
              <input type="date" min={today || undefined} value={values.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} className={fieldClass} />
              {err("date")}
            </label>
            <label className={labelClass}>
              الوقت المفضل *
              <select value={values.time} onChange={(e) => set("time", e.target.value as BookingInput["time"])} className={fieldClass}>
                {timeSlots.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.ar}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end sm:col-span-2">
              <Btn variant="primary" onClick={() => create()}>
                <Icons.plus /> إضافة الطلب
              </Btn>
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
}
