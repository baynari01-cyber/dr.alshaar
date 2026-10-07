"use client";

import { useState } from "react";
import { addDays, formatDate, formatTime, minutesOf, procedureAr } from "@/lib/admin/format";
import { daySlots, isWorkingDay, occupies, weekStart } from "@/lib/admin/schedule";
import { useAdminData, useToday } from "@/lib/admin/store";
import type { Booking } from "@/lib/admin/types";
import { Btn, Empty, Icons, Panel, StatusBadge } from "./ui";

const SLOT_H = 44;

const blockTone: Record<Booking["status"], string> = {
  new: "border-[#c08a2e] bg-[#f3e6cf]",
  confirmed: "border-[#3f7a50] bg-[#e1ece3]",
  completed: "border-[#6f685e] bg-[#e6e3de]",
  cancelled: "border-[#a6463a] bg-[#f1e0dc]",
  no_show: "border-[#7b4f86] bg-[#ece2ee]",
};

export function CalendarView({ onOpen, onCreateAt }: { onOpen: (id: string) => void; onCreateAt: (date: string, time: string) => void }) {
  const { bookings, settings } = useAdminData();
  const today = useToday();
  const [anchor, setAnchor] = useState(() => weekStart(today));
  const [selectedDay, setSelectedDay] = useState(today);

  const days = Array.from({ length: 7 }, (_, i) => addDays(anchor, i));
  const slots = daySlots(settings);
  const open = minutesOf(settings.openTime);
  const nowHHMM = (() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  })();

  const onDay = (date: string) =>
    bookings
      .filter((b) => occupies(b) && b.appointment?.date === date)
      .sort((a, b) => a.appointment!.time.localeCompare(b.appointment!.time));

  const goto = (offset: number) => {
    const next = addDays(anchor, offset);
    setAnchor(next);
    setSelectedDay(offset === 0 ? today : next);
  };

  const rangeLabel = `${formatDate(days[0], { day: "numeric", month: "long" })} – ${formatDate(days[6], { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Btn size="sm" onClick={() => goto(-7)} aria-label="الأسبوع السابق">
            <Icons.chevron className="rotate-180" />
          </Btn>
          <Btn
            size="sm"
            onClick={() => {
              setAnchor(weekStart(today));
              setSelectedDay(today);
            }}
          >
            هذا الأسبوع
          </Btn>
          <Btn size="sm" onClick={() => goto(7)} aria-label="الأسبوع التالي">
            <Icons.chevron />
          </Btn>
        </div>
        <p className="text-sm text-ink-soft">{rangeLabel}</p>
      </div>

      {/* Desktop: week grid */}
      <Panel className="hidden overflow-x-auto lg:block">
        <div className="min-w-[880px]">
          <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] border-b border-line">
            <span />
            {days.map((d) => (
              <div key={d} className={`border-s border-line px-2 py-3 text-center ${d === today ? "bg-gold/10" : ""}`}>
                <p className="text-xs text-ink-mute">{formatDate(d, { weekday: "long" })}</p>
                <p className={`mt-1 font-serif text-xl ${d === today ? "text-gold-ink" : ""}`}>{formatDate(d, { day: "numeric" })}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))]">
            <div>
              {slots.map((s) => (
                <div key={s} style={{ height: SLOT_H }} className="border-b border-line/60 pe-2 pt-1 text-end text-[0.7rem] text-ink-mute">
                  {s.endsWith(":00") ? formatTime(s) : ""}
                </div>
              ))}
            </div>
            {days.map((d) => {
              const working = isWorkingDay(d, settings);
              return (
                <div key={d} className={`relative border-s border-line ${d === today ? "bg-gold/[0.04]" : ""} ${working ? "" : "hatch bg-ink/[0.03]"}`}>
                  {slots.map((s) => {
                    const past = d < today || (d === today && minutesOf(s) + settings.slotMinutes <= nowHHMM);
                    return working && !past ? (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onCreateAt(d, s)}
                        aria-label={`إضافة موعد ${formatDate(d)} ${formatTime(s)}`}
                        style={{ height: SLOT_H }}
                        className="group block w-full border-b border-line/60 text-[0.65rem] text-transparent hover:bg-ink/[0.03] hover:text-ink-mute"
                      >
                        + {s}
                      </button>
                    ) : (
                      <div key={s} style={{ height: SLOT_H }} className="border-b border-line/60" />
                    );
                  })}
                  {!working && <span className="absolute inset-x-0 top-4 text-center text-xs text-ink-mute">مغلق</span>}
                  {onDay(d).map((b) => {
                    const top = ((minutesOf(b.appointment!.time) - open) / settings.slotMinutes) * SLOT_H;
                    if (top < 0 || top >= slots.length * SLOT_H) return null;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => onOpen(b.id)}
                        style={{ top: top + 2, height: SLOT_H - 4 }}
                        className={`absolute inset-x-1 overflow-hidden border-s-[3px] px-2 py-1 text-start shadow-sm transition-transform hover:z-10 hover:scale-[1.02] ${blockTone[b.status]}`}
                      >
                        <span className="block truncate text-[0.72rem] font-medium leading-4">{b.name}</span>
                        <span className="block truncate text-[0.65rem] leading-4 text-ink-soft">
                          <span dir="ltr">{b.appointment!.time}</span> · {procedureAr(b.procedure)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Mobile: day picker + agenda */}
      <div className="lg:hidden">
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const count = onDay(d).length;
            const active = d === selectedDay;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDay(d)}
                aria-pressed={active}
                className={`flex flex-col items-center border py-2 ${active ? "border-ink bg-ink text-ivory" : "border-line bg-white/50"} ${isWorkingDay(d, settings) ? "" : "opacity-50"}`}
              >
                <span className="text-[0.6rem]">{formatDate(d, { weekday: "short" })}</span>
                <span className={`font-serif text-lg ${d === today && !active ? "text-gold-ink" : ""}`}>{formatDate(d, { day: "numeric" })}</span>
                <span className={`mt-0.5 h-1 w-1 rounded-full ${count ? (active ? "bg-gold-light" : "bg-gold") : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>
        <Panel title={formatDate(selectedDay)} className="mt-3" action={isWorkingDay(selectedDay, settings) && selectedDay >= today ? (
          <Btn size="sm" variant="ghost" onClick={() => onCreateAt(selectedDay, "")}>
            <Icons.plus /> موعد
          </Btn>
        ) : undefined}>
          {!isWorkingDay(selectedDay, settings) ? (
            <Empty title="العيادة مغلقة في هذا اليوم" />
          ) : onDay(selectedDay).length === 0 ? (
            <Empty title="لا توجد مواعيد" />
          ) : (
            <ol className="divide-y divide-line">
              {onDay(selectedDay).map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => onOpen(b.id)} className="flex w-full items-center gap-4 px-4 py-3.5 text-start">
                    <span dir="ltr" className="w-14 font-serif text-lg">{b.appointment!.time}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{b.name}</span>
                      <span className="block text-xs text-ink-mute">{procedureAr(b.procedure)}</span>
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}
