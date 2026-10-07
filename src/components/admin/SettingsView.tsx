"use client";

import { useState } from "react";
import { bookingsToCsv, defaultTemplates, hhmmOf, renderTemplate, templatePlaceholders } from "@/lib/admin/format";
import { weekOrder, weekdayNames } from "@/lib/admin/schedule";
import { resetDemoData, updateSettings, useAdminData, useToday } from "@/lib/admin/store";
import type { Booking, ClinicSettings, MessageTemplates } from "@/lib/admin/types";
import { Btn, Icons, Panel, fieldClass, labelClass, useToast } from "./ui";

const hourOptions = Array.from({ length: 33 }, (_, i) => hhmmOf(7 * 60 + i * 30)); // 07:00 → 23:00
const slotOptions: ClinicSettings["slotMinutes"][] = [15, 20, 30, 45, 60];

const templateMeta: { key: keyof MessageTemplates; title: string; hint: string }[] = [
  { key: "confirm", title: "رسالة تأكيد الموعد", hint: "تُرسل بعد جدولة الطلب." },
  { key: "reminder", title: "رسالة التذكير", hint: "تُرسل قبل الموعد بيوم." },
  { key: "reschedule", title: "رسالة تعديل الموعد", hint: "تُرسل عند تغيير الموعد." },
];

const placeholderAr: Record<(typeof templatePlaceholders)[number], string> = {
  name: "اسم المريض",
  procedure: "سبب الاستشارة",
  date: "تاريخ الموعد",
  time: "وقت الموعد",
  address: "عنوان العيادة",
  maps: "رابط الخريطة",
  phone: "هاتف العيادة",
};

export function SettingsView() {
  const { settings, bookings } = useAdminData();
  const toast = useToast();
  const today = useToday();
  const [hours, setHours] = useState({ days: settings.workingDays, open: settings.openTime, close: settings.closeTime, slot: settings.slotMinutes });
  const [templates, setTemplates] = useState<MessageTemplates>(settings.templates);
  const [active, setActive] = useState<keyof MessageTemplates>("confirm");
  const [confirmReset, setConfirmReset] = useState(false);

  const hoursValid = hours.days.length > 0 && hours.open < hours.close;
  const hoursDirty =
    hours.open !== settings.openTime || hours.close !== settings.closeTime || hours.slot !== settings.slotMinutes || [...hours.days].sort().join() !== [...settings.workingDays].sort().join();
  const templatesDirty = (Object.keys(templates) as (keyof MessageTemplates)[]).some((k) => templates[k] !== settings.templates[k]);

  const sample: Booking = {
    id: "preview",
    createdAt: new Date(0).toISOString(),
    name: "سارة أحمد",
    phone: "0790000000",
    age: null,
    procedure: "rhinoplasty",
    priorSurgery: "",
    preferredDate: today,
    preferredTime: "morning",
    notes: "",
    status: "confirmed",
    appointment: { date: today, time: hours.open },
    internalNotes: "",
    source: "demo",
    history: [],
  };

  const exportAll = () => {
    const url = URL.createObjectURL(new Blob([bookingsToCsv(bookings)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "alshaar-bookings-all.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="ساعات العمل">
        <div className="space-y-5 p-5">
          <fieldset>
            <legend className={labelClass}>أيام الدوام</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekOrder.map((d) => {
                const on = hours.days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setHours((h) => ({ ...h, days: on ? h.days.filter((x) => x !== d) : [...h.days, d] }))}
                    className={`h-9 border px-3 text-xs transition-colors ${on ? "border-ink bg-ink text-ivory" : "border-line-strong bg-white/50 text-ink-soft"}`}
                  >
                    {weekdayNames[d]}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="grid grid-cols-3 gap-3">
            <label className={labelClass}>
              من
              <select value={hours.open} onChange={(e) => setHours((h) => ({ ...h, open: e.target.value }))} className={fieldClass}>
                {hourOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              إلى
              <select value={hours.close} onChange={(e) => setHours((h) => ({ ...h, close: e.target.value }))} className={fieldClass}>
                {hourOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              مدة الموعد
              <select value={hours.slot} onChange={(e) => setHours((h) => ({ ...h, slot: Number(e.target.value) as ClinicSettings["slotMinutes"] }))} className={fieldClass}>
                {slotOptions.map((m) => <option key={m} value={m}>{m} دقيقة</option>)}
              </select>
            </label>
          </div>
          {!hoursValid && <p role="alert" className="text-xs text-[#86392c]">اختر يومًا واحدًا على الأقل، واجعل وقت الإغلاق بعد وقت الافتتاح.</p>}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-6 text-ink-mute">هذه الإعدادات تحدد الأوقات المتاحة عند جدولة المواعيد.</p>
            <Btn
              variant="primary"
              size="sm"
              disabled={!hoursValid || !hoursDirty}
              onClick={() => {
                updateSettings({ workingDays: hours.days, openTime: hours.open, closeTime: hours.close, slotMinutes: hours.slot });
                toast("تم حفظ ساعات العمل");
              }}
            >
              حفظ
            </Btn>
          </div>
        </div>
      </Panel>

      <Panel title="بيانات العرض التجريبي">
        <div className="space-y-4 p-5 text-sm leading-7 text-ink-soft">
          <p>
            في هذا العرض تُحفظ الحجوزات والإعدادات في هذا المتصفح فقط، والحجوزات المعلّمة «تجريبي» بأسماء وهمية لعرض طريقة العمل. أي طلب يُرسل من نموذج الحجز في
            الموقع على هذا الجهاز يظهر هنا مباشرة.
          </p>
          <p>في النسخة الفعلية تُحفظ البيانات في قاعدة بيانات آمنة، مع تسجيل دخول حقيقي، وتصل الطلبات من جميع الأجهزة.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Btn size="sm" onClick={exportAll}>
              <Icons.download /> تصدير كل الحجوزات
            </Btn>
            {confirmReset ? (
              <>
                <Btn
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    resetDemoData();
                    setConfirmReset(false);
                    toast("أُعيدت البيانات التجريبية");
                  }}
                >
                  تأكيد الاستعادة
                </Btn>
                <Btn size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                  تراجع
                </Btn>
              </>
            ) : (
              <Btn size="sm" variant="danger" onClick={() => setConfirmReset(true)}>
                استعادة البيانات التجريبية
              </Btn>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="قوالب رسائل WhatsApp" className="xl:col-span-2">
        <div className="grid gap-6 p-5 lg:grid-cols-2">
          <div>
            <div role="tablist" aria-label="القوالب" className="flex flex-wrap gap-2">
              {templateMeta.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active === t.key}
                  onClick={() => setActive(t.key)}
                  className={`h-9 border px-3 text-xs ${active === t.key ? "border-ink bg-ink text-ivory" : "border-line-strong bg-white/50"}`}
                >
                  {t.title}
                </button>
              ))}
            </div>
            <label className={`${labelClass} mt-4`}>
              {templateMeta.find((t) => t.key === active)?.hint}
              <textarea
                rows={11}
                dir="auto"
                value={templates[active]}
                onChange={(e) => setTemplates((t) => ({ ...t, [active]: e.target.value }))}
                className={`${fieldClass} font-mono text-[0.8rem] leading-6`}
              />
            </label>
            <p className="mt-3 text-xs text-ink-mute">اضغط لإضافة متغيّر:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {templatePlaceholders.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTemplates((t) => ({ ...t, [active]: `${t[active]}{${p}}` }))}
                  className="border border-dashed border-gold px-2 py-1 text-[0.7rem] text-gold-ink hover:bg-gold/10"
                >
                  {placeholderAr[p]} <span dir="ltr" className="text-ink-mute">{`{${p}}`}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Btn
                variant="primary"
                size="sm"
                disabled={!templatesDirty}
                onClick={() => {
                  updateSettings({ templates });
                  toast("تم حفظ القوالب");
                }}
              >
                حفظ القوالب
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => setTemplates((t) => ({ ...t, [active]: defaultTemplates[active] }))}>
                استعادة النص الأصلي
              </Btn>
            </div>
          </div>
          <div>
            <p className={labelClass}>معاينة الرسالة كما تصل للمريض</p>
            <div className="mt-1.5 bg-[#e7dfd3] p-4">
              <p dir="auto" className="me-auto max-w-sm whitespace-pre-wrap bg-[#dcf8c6] p-3 text-[0.82rem] leading-6 text-[#111] shadow-sm">
                {renderTemplate(templates[active], sample)}
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
