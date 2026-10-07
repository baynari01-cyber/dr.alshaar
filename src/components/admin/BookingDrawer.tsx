"use client";

import { useState, type ReactNode } from "react";
import {
  formatDate,
  formatDateTime,
  formatTime,
  procedureAr,
  renderTemplate,
  sourceMeta,
  telLink,
  timeSlotAr,
  waLink,
} from "@/lib/admin/format";
import { daySlots, isWorkingDay, takenSlots } from "@/lib/admin/schedule";
import { deleteBooking, updateBooking, useAdminData, useToday } from "@/lib/admin/store";
import type { Booking, ClinicSettings } from "@/lib/admin/types";
import { Btn, Icons, Overlay, StatusBadge, fieldClass, labelClass, linkBtnClass, useToast } from "./ui";

export function BookingDrawer({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const { bookings, settings } = useAdminData();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  return (
    <Overlay label={`تفاصيل حجز ${booking.name}`} onClose={onClose} side="end">
      {/* Remount per booking so local form state starts fresh. */}
      <DrawerBody key={booking.id} booking={booking} bookings={bookings} settings={settings} onClose={onClose} />
    </Overlay>
  );
}

function DrawerBody({
  booking,
  bookings,
  settings,
  onClose,
}: {
  booking: Booking;
  bookings: readonly Booking[];
  settings: ClinicSettings;
  onClose: () => void;
}) {
  const toast = useToast();
  const [rescheduling, setRescheduling] = useState(false);
  const [notes, setNotes] = useState(booking.internalNotes);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sendTemplate = (template: string, b: Booking) => window.open(waLink(b.phone, renderTemplate(template, b)), "_blank", "noopener,noreferrer");

  const schedule = (date: string, time: string, notify: boolean) => {
    const wasConfirmed = booking.status === "confirmed" && booking.appointment;
    const appointment = { date, time };
    updateBooking(
      booking.id,
      { status: "confirmed", appointment },
      `${wasConfirmed ? "تعديل الموعد إلى" : "تأكيد الموعد"} ${formatDate(date, { day: "numeric", month: "long" })} — ${formatTime(time)}`,
    );
    toast(wasConfirmed ? "تم تعديل الموعد" : "تم تأكيد الموعد");
    setRescheduling(false);
    if (notify) sendTemplate(wasConfirmed ? settings.templates.reschedule : settings.templates.confirm, { ...booking, appointment });
  };

  const setStatus = (status: Booking["status"], text: string, toastText: string) => {
    updateBooking(booking.id, { status }, text);
    toast(toastText);
  };

  return (
    <>
      <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-medium">{booking.name}</h2>
            <StatusBadge status={booking.status} />
            {booking.source === "demo" && <span className="border border-dashed border-line-strong px-2 py-0.5 text-[0.65rem] text-ink-mute">تجريبي</span>}
          </div>
          <p dir="ltr" className="mt-1.5 text-end text-sm text-ink-soft">
            {booking.phone}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="إغلاق" className="grid h-10 w-10 shrink-0 place-items-center hover:bg-ink/5">
          <Icons.close />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
        <div className="grid grid-cols-3 gap-2">
          <a href={waLink(booking.phone, `مرحبًا ${booking.name}، نتواصل معك من عيادة د. محمد الشعر بخصوص طلب الاستشارة.`)} target="_blank" rel="noopener noreferrer" className={linkBtnClass("whatsapp", "sm")}>
            <Icons.whatsapp /> واتساب
          </a>
          <a href={telLink(booking.phone)} className={linkBtnClass("secondary", "sm")}>
            <Icons.phone /> اتصال
          </a>
          <Btn
            size="sm"
            onClick={() => {
              void navigator.clipboard?.writeText(booking.phone).then(() => toast("تم نسخ الرقم"), () => toast("تعذّر النسخ"));
            }}
          >
            <Icons.copy /> نسخ الرقم
          </Btn>
        </div>

        {/* Next step */}
        <section className="border border-gold/40 bg-[#f6efe2] p-5">
          {booking.status === "new" || rescheduling ? (
            <Scheduler
              booking={booking}
              bookings={bookings}
              settings={settings}
              onSubmit={schedule}
              onCancel={rescheduling ? () => setRescheduling(false) : undefined}
              title={rescheduling ? "تعديل الموعد" : "جدولة الموعد"}
            />
          ) : booking.status === "confirmed" && booking.appointment ? (
            <div>
              <p className="text-xs text-ink-soft">الموعد المؤكد</p>
              <p className="mt-2 text-lg font-medium">{formatDate(booking.appointment.date)}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{formatTime(booking.appointment.time)}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Btn size="sm" variant="whatsapp" onClick={() => sendTemplate(settings.templates.confirm, booking)}>
                  <Icons.whatsapp /> رسالة التأكيد
                </Btn>
                <Btn size="sm" onClick={() => { sendTemplate(settings.templates.reminder, booking); updateBooking(booking.id, {}, "أُرسل تذكير بالموعد"); }}>
                  <Icons.bell /> إرسال تذكير
                </Btn>
                <Btn size="sm" onClick={() => setRescheduling(true)}>
                  <Icons.calendar /> تعديل الموعد
                </Btn>
                <Btn size="sm" variant="primary" onClick={() => setStatus("completed", "تمت الزيارة", "تم تسجيل الزيارة")}>
                  <Icons.check /> تمت الزيارة
                </Btn>
                <Btn size="sm" onClick={() => setStatus("no_show", "لم يحضر المريض", "تم تسجيل عدم الحضور")}>
                  لم يحضر
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => setStatus("cancelled", "تم إلغاء الموعد", "تم إلغاء الموعد")}>
                  إلغاء الموعد
                </Btn>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink-soft">الحالة الحالية</p>
                <p className="mt-2 text-sm">
                  {booking.appointment
                    ? `${formatDate(booking.appointment.date)} — ${formatTime(booking.appointment.time)}`
                    : "لا يوجد موعد محدد"}
                </p>
              </div>
              <Btn size="sm" onClick={() => setStatus("new", "أُعيد فتح الطلب", "أُعيد فتح الطلب")}>
                إعادة فتح الطلب
              </Btn>
            </div>
          )}
          {booking.status === "new" && !rescheduling && (
            <button
              type="button"
              onClick={() => setStatus("cancelled", "تم إلغاء الطلب", "تم إلغاء الطلب")}
              className="mt-4 text-xs text-[#86392c] underline-offset-4 hover:underline"
            >
              إلغاء الطلب
            </button>
          )}
        </section>

        {/* Request details */}
        <section>
          <h3 className="mb-3 text-xs text-ink-mute">تفاصيل الطلب</h3>
          <dl className="divide-y divide-line border-y border-line text-sm">
            <Row label="سبب الاستشارة">{procedureAr(booking.procedure)}</Row>
            {booking.priorSurgery && <Row label="عملية أنف سابقة">{booking.priorSurgery === "yes" ? "نعم" : "لا"}</Row>}
            <Row label="العمر">{booking.age ?? "—"}</Row>
            <Row label="الموعد المفضل">
              {formatDate(booking.preferredDate)} — {timeSlotAr(booking.preferredTime)}
            </Row>
            <Row label="المصدر">{sourceMeta[booking.source]}</Row>
            <Row label="تاريخ الطلب">{formatDateTime(booking.createdAt)}</Row>
          </dl>
          {booking.notes && (
            <p dir="auto" className="mt-4 bg-white/60 p-4 text-sm leading-7 text-ink-soft">
              {booking.notes}
            </p>
          )}
        </section>

        {/* Internal notes */}
        <section>
          <label htmlFor={`notes-${booking.id}`} className="mb-2 block text-xs text-ink-mute">
            ملاحظات داخلية (لا تظهر للمريض)
          </label>
          <textarea
            id={`notes-${booking.id}`}
            rows={3}
            dir="auto"
            value={notes}
            maxLength={1000}
            onChange={(e) => setNotes(e.target.value)}
            className={`${fieldClass} mt-0 resize-y leading-7`}
            placeholder="مثال: إحضار صور أشعة، متابعة بعد أسبوعين…"
          />
          <div className="mt-2 flex justify-end">
            <Btn
              size="sm"
              disabled={notes === booking.internalNotes}
              onClick={() => {
                updateBooking(booking.id, { internalNotes: notes.trim() }, "تحديث الملاحظات الداخلية");
                toast("تم حفظ الملاحظات");
              }}
            >
              حفظ الملاحظات
            </Btn>
          </div>
        </section>

        {/* History */}
        <section>
          <h3 className="mb-3 text-xs text-ink-mute">سجل الإجراءات</h3>
          <ol className="space-y-3 border-s border-line ps-5">
            {[...booking.history].reverse().map((h, i) => (
              <li key={`${h.at}-${i}`} className="relative text-sm">
                <span aria-hidden className="absolute -start-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-gold" />
                <p>{h.text}</p>
                <p className="mt-0.5 text-xs text-ink-mute">{formatDateTime(h.at)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-line pt-5">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span>حذف هذا الحجز نهائيًا؟</span>
              <Btn
                size="sm"
                variant="danger"
                onClick={() => {
                  deleteBooking(booking.id);
                  toast("تم حذف الحجز");
                  onClose();
                }}
              >
                نعم، احذف
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                تراجع
              </Btn>
            </div>
          ) : (
            <Btn size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} className="text-[#86392c]">
              <Icons.trash /> حذف الحجز
            </Btn>
          )}
        </section>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="shrink-0 text-ink-mute">{label}</dt>
      <dd className="text-end">{children}</dd>
    </div>
  );
}

/** Date + free-slot picker that respects working days and existing appointments. */
export function Scheduler({
  booking,
  bookings,
  settings,
  onSubmit,
  onCancel,
  title,
}: {
  booking: Pick<Booking, "id" | "preferredDate" | "preferredTime" | "appointment">;
  bookings: readonly Booking[];
  settings: ClinicSettings;
  onSubmit: (date: string, time: string, notify: boolean) => void;
  onCancel?: () => void;
  title: string;
}) {
  const today = useToday();
  const initialDate = booking.appointment?.date ?? (today && booking.preferredDate < today ? today : booking.preferredDate);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(booking.appointment?.time ?? "");
  const [notify, setNotify] = useState(true);

  const slots = daySlots(settings);
  const taken = takenSlots(bookings, date, booking.id);
  const working = !!date && isWorkingDay(date, settings);
  const preferredWindow: Record<Booking["preferredTime"], [number, number]> = { morning: [0, 12], afternoon: [12, 16], evening: [16, 24] };
  const [from, to] = preferredWindow[booking.preferredTime];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-ink-mute">يفضّل المريض: {timeSlotAr(booking.preferredTime)}</span>
      </div>
      <label className={`${labelClass} mt-4`}>
        التاريخ
        <input
          type="date"
          min={today || undefined}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          className={fieldClass}
        />
      </label>

      {date && !working ? (
        <p className="mt-4 text-xs text-[#86392c]">العيادة مغلقة في هذا اليوم حسب ساعات العمل. اختر يومًا آخر.</p>
      ) : (
        <fieldset className="mt-4">
          <legend className={labelClass}>الوقت المتاح</legend>
          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {slots.map((s) => {
              const isTaken = taken.has(s);
              const isPast = date === today && s < currentHHMM();
              const hour = Number(s.slice(0, 2));
              const suits = hour >= from && hour < to;
              const selected = time === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={isTaken || isPast}
                  aria-pressed={selected}
                  onClick={() => setTime(s)}
                  title={isTaken ? "محجوز" : suits ? "ضمن الوقت المفضل للمريض" : undefined}
                  className={`h-9 border text-xs transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${
                    selected
                      ? "border-ink bg-ink text-ivory"
                      : suits
                        ? "border-gold/60 bg-white/80 hover:border-ink"
                        : "border-line-strong bg-white/50 hover:border-ink"
                  }`}
                >
                  <span dir="ltr">{s}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.7rem] text-ink-mute">الأوقات بإطار ذهبي تناسب الوقت المفضل للمريض. المشطوبة محجوزة.</p>
        </fieldset>
      )}

      <label className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
        إرسال رسالة للمريض عبر WhatsApp بعد الحفظ
      </label>

      <div className="mt-5 flex gap-2">
        <Btn variant="primary" disabled={!date || !time || !working} onClick={() => onSubmit(date, time, notify)} className="flex-1">
          <Icons.check /> {booking.appointment ? "حفظ الموعد الجديد" : "تأكيد الموعد"}
        </Btn>
        {onCancel && (
          <Btn variant="ghost" onClick={onCancel}>
            تراجع
          </Btn>
        )}
      </div>
    </div>
  );
}

function currentHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
