"use client";

import { procedures } from "@/lib/booking";
import { addDays, formatDate, formatDateTime, formatTime, procedureAr, timeSlotAr } from "@/lib/admin/format";
import { useAdminData, useToday } from "@/lib/admin/store";
import type { Booking } from "@/lib/admin/types";
import { Btn, Empty, Icons, Panel, StatusBadge } from "./ui";

export function OverviewView({ onOpen, onNavigate }: { onOpen: (id: string) => void; onNavigate: (view: "bookings" | "calendar") => void }) {
  const { bookings } = useAdminData();
  const today = useToday();
  const weekEnd = addDays(today, 6);
  const monthAgo = addDays(today, -30);

  const pending = bookings.filter((b) => b.status === "new").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const todays = bookings
    .filter((b) => b.appointment?.date === today && b.status !== "cancelled")
    .sort((a, b) => a.appointment!.time.localeCompare(b.appointment!.time));
  const thisWeek = bookings.filter((b) => b.status === "confirmed" && b.appointment && b.appointment.date >= today && b.appointment.date <= weekEnd);
  const recentVisits = bookings.filter((b) => b.appointment && b.appointment.date >= monthAgo && b.appointment.date < today);
  const attended = recentVisits.filter((b) => b.status === "completed").length;
  const missed = recentVisits.filter((b) => b.status === "no_show").length;
  const attendance = attended + missed ? Math.round((attended / (attended + missed)) * 100) : null;

  const byProcedure = procedures.map((p) => ({ ...p, count: bookings.filter((b) => b.procedure === p.id).length }));
  const max = Math.max(1, ...byProcedure.map((p) => p.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat label="طلبات بانتظار الرد" value={pending.length} accent={pending.length > 0} hint="تحتاج جدولة" onClick={() => onNavigate("bookings")} />
        <Stat label="مواعيد اليوم" value={todays.length} hint={formatDate(today, { weekday: "long", day: "numeric", month: "long" })} onClick={() => onNavigate("calendar")} />
        <Stat label="مواعيد الأيام السبعة القادمة" value={thisWeek.length} hint="مؤكدة" onClick={() => onNavigate("calendar")} />
        <Stat label="نسبة الحضور" value={attendance === null ? "—" : `${attendance}%`} hint="آخر 30 يومًا" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel
          title="طلبات بانتظار الرد"
          className="xl:col-span-3"
          action={
            <Btn size="sm" variant="ghost" onClick={() => onNavigate("bookings")}>
              كل الحجوزات
            </Btn>
          }
        >
          {pending.length === 0 ? (
            <Empty title="لا توجد طلبات جديدة" hint="ستظهر هنا الطلبات الواردة من نموذج الحجز في الموقع." />
          ) : (
            <ul className="divide-y divide-line">
              {pending.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => onOpen(b.id)} className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-ink/[0.03]">
                    <Initials name={b.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{b.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-ink-mute">
                        {procedureAr(b.procedure)} · يفضّل {formatDate(b.preferredDate, { weekday: "short", day: "numeric", month: "short" })} {timeSlotAr(b.preferredTime)}
                      </span>
                    </span>
                    <span className="hidden text-xs text-ink-mute sm:block">{formatDateTime(b.createdAt)}</span>
                    <span className="inline-flex h-8 items-center gap-1.5 border border-ink px-3 text-xs">
                      <Icons.calendar width={14} height={14} /> جدولة
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="مواعيد اليوم" className="xl:col-span-2">
          {todays.length === 0 ? (
            <Empty title="لا توجد مواعيد اليوم" />
          ) : (
            <ol className="space-y-1 p-3">
              {todays.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => onOpen(b.id)} className="flex w-full items-center gap-4 px-3 py-3 text-start transition-colors hover:bg-ink/[0.03]">
                    <span className="w-16 shrink-0 font-serif text-lg" dir="ltr">
                      {b.appointment!.time}
                    </span>
                    <span aria-hidden className="h-8 w-px bg-gold/60" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{b.name}</span>
                      <span className="block truncate text-xs text-ink-mute">{procedureAr(b.procedure)}</span>
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel title="الطلبات حسب سبب الاستشارة" className="xl:col-span-3">
          <ul className="space-y-4 p-5" aria-label="عدد الطلبات لكل سبب استشارة">
            {byProcedure.map((p) => (
              <li key={p.id} className="grid grid-cols-[minmax(0,11rem)_1fr_2rem] items-center gap-3 text-sm" title={`${p.ar}: ${p.count}`}>
                <span className="truncate text-ink-soft">{p.ar}</span>
                <span className="h-2.5 bg-ink/[0.06]">
                  <span className="block h-full rounded-e-[3px] bg-gold" style={{ width: `${(p.count / max) * 100}%` }} />
                </span>
                <span className="text-end tabular-nums">{p.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="المواعيد القادمة" className="xl:col-span-2">
          <UpcomingList bookings={bookings} today={today} onOpen={onOpen} />
        </Panel>
      </div>
    </div>
  );
}

function UpcomingList({ bookings, today, onOpen }: { bookings: readonly Booking[]; today: string; onOpen: (id: string) => void }) {
  const upcoming = bookings
    .filter((b) => b.status === "confirmed" && b.appointment && b.appointment.date > today)
    .sort((a, b) => `${a.appointment!.date}${a.appointment!.time}`.localeCompare(`${b.appointment!.date}${b.appointment!.time}`))
    .slice(0, 5);
  if (!upcoming.length) return <Empty title="لا توجد مواعيد قادمة" />;
  return (
    <ul className="divide-y divide-line">
      {upcoming.map((b) => (
        <li key={b.id}>
          <button type="button" onClick={() => onOpen(b.id)} className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-start hover:bg-ink/[0.03]">
            <span className="min-w-0">
              <span className="block truncate text-sm">{b.name}</span>
              <span className="block text-xs text-ink-mute">{procedureAr(b.procedure)}</span>
            </span>
            <span className="shrink-0 text-end text-xs">
              <span className="block">{formatDate(b.appointment!.date, { weekday: "short", day: "numeric", month: "short" })}</span>
              <span className="block text-ink-mute">{formatTime(b.appointment!.time)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value, hint, accent = false, onClick }: { label: string; value: number | string; hint?: string; accent?: boolean; onClick?: () => void }) {
  const body = (
    <>
      <span className="block text-xs text-ink-soft">{label}</span>
      <span className={`mt-3 block font-serif text-4xl leading-none tabular-nums ${accent ? "text-gold-ink" : ""}`}>{value}</span>
      {hint && <span className="mt-2 block truncate text-[0.7rem] text-ink-mute">{hint}</span>}
    </>
  );
  const cls = `block w-full border border-line bg-white/55 p-4 text-start lg:p-5 ${accent ? "border-gold/50" : ""}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} transition-colors hover:border-ink/40`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(" ");
  return (
    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-night text-xs text-gold-light">
      {letters}
    </span>
  );
}
