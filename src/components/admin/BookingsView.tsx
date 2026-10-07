"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { procedures } from "@/lib/booking";
import { bookingsToCsv, formatDate, formatDateTime, formatTime, procedureAr, sourceMeta, statusMeta, statusOrder, timeSlotAr, waLink } from "@/lib/admin/format";
import { useAdminData } from "@/lib/admin/store";
import type { Booking, BookingStatus } from "@/lib/admin/types";
import { Btn, Empty, Icons, Panel, StatusBadge, fieldClass } from "./ui";
import { Initials } from "./OverviewView";

type Sort = "recent" | "appointment" | "name";

export function BookingsView({ onOpen }: { onOpen: (id: string) => void }) {
  const { bookings } = useAdminData();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [procedure, setProcedure] = useState<Booking["procedure"] | "all">("all");
  const [sort, setSort] = useState<Sort>("recent");

  const counts = useMemo(() => {
    const c: Record<BookingStatus | "all", number> = { all: bookings.length, new: 0, confirmed: 0, completed: 0, cancelled: 0, no_show: 0 };
    for (const b of bookings) c[b.status]++;
    return c;
  }, [bookings]);

  const rows = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    const filtered = bookings.filter(
      (b) =>
        (status === "all" || b.status === status) &&
        (procedure === "all" || b.procedure === procedure) &&
        (!q || b.name.toLowerCase().includes(q) || (digits.length >= 3 && b.phone.replace(/\D/g, "").includes(digits))),
    );
    const apptKey = (b: Booking) => (b.appointment ? `${b.appointment.date}${b.appointment.time}` : `9${b.preferredDate}`);
    return [...filtered].sort((a, b) =>
      sort === "recent" ? b.createdAt.localeCompare(a.createdAt) : sort === "appointment" ? apptKey(a).localeCompare(apptKey(b)) : a.name.localeCompare(b.name, "ar"),
    );
  }, [bookings, deferredQuery, status, procedure, sort]);

  const exportCsv = () => {
    const blob = new Blob([bookingsToCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alshaar-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div role="tablist" aria-label="تصفية حسب الحالة" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {(["all", ...statusOrder] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3.5 text-xs transition-colors ${
              status === s ? "border-ink bg-ink text-ivory" : "border-line-strong bg-white/50 text-ink-soft hover:border-ink"
            }`}
          >
            {s === "all" ? "الكل" : statusMeta[s].ar}
            <span className={`tabular-nums ${status === s ? "text-gold-light" : "text-ink-mute"}`}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">بحث بالاسم أو الهاتف</span>
          <Icons.search className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-ink-mute" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم أو رقم الهاتف"
            className={`${fieldClass} mt-0 ps-10`}
          />
        </label>
        <label>
          <span className="sr-only">سبب الاستشارة</span>
          <select value={procedure} onChange={(e) => setProcedure(e.target.value as typeof procedure)} className={`${fieldClass} mt-0`}>
            <option value="all">كل الأسباب</option>
            {procedures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ar}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">الترتيب</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={`${fieldClass} mt-0`}>
            <option value="recent">الأحدث أولًا</option>
            <option value="appointment">حسب الموعد</option>
            <option value="name">حسب الاسم</option>
          </select>
        </label>
        <Btn onClick={exportCsv} disabled={!rows.length} className="h-[2.65rem]">
          <Icons.download /> تصدير Excel
        </Btn>
      </div>

      <Panel>
        {rows.length === 0 ? (
          <Empty title="لا توجد نتائج" hint="جرّب تغيير البحث أو الفلاتر." />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-sm lg:table">
              <caption className="sr-only">قائمة الحجوزات</caption>
              <thead>
                <tr className="border-b border-line text-start text-xs text-ink-mute">
                  <th scope="col" className="px-5 py-3 text-start font-normal">المريض</th>
                  <th scope="col" className="px-3 py-3 text-start font-normal">سبب الاستشارة</th>
                  <th scope="col" className="px-3 py-3 text-start font-normal">الموعد</th>
                  <th scope="col" className="px-3 py-3 text-start font-normal">الحالة</th>
                  <th scope="col" className="px-3 py-3 text-start font-normal">المصدر</th>
                  <th scope="col" className="px-3 py-3 text-start font-normal">وصل</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">إجراءات</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((b) => (
                  <tr key={b.id} onClick={() => onOpen(b.id)} className="cursor-pointer transition-colors hover:bg-ink/[0.03]">
                    <td className="px-5 py-3.5">
                      <button type="button" onClick={() => onOpen(b.id)} className="flex items-center gap-3 text-start">
                        <Initials name={b.name} />
                        <span>
                          <span className="block font-medium">{b.name}</span>
                          <span dir="ltr" className="block text-end text-xs text-ink-mute">{b.phone}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3.5 text-ink-soft">{procedureAr(b.procedure)}</td>
                    <td className="px-3 py-3.5">
                      <When booking={b} />
                    </td>
                    <td className="px-3 py-3.5"><StatusBadge status={b.status} size="sm" /></td>
                    <td className="px-3 py-3.5 text-xs text-ink-mute">{sourceMeta[b.source]}</td>
                    <td className="px-3 py-3.5 text-xs text-ink-mute">{formatDateTime(b.createdAt)}</td>
                    <td className="px-5 py-3.5 text-end">
                      <a
                        href={waLink(b.phone, `مرحبًا ${b.name}، نتواصل معك من عيادة د. محمد الشعر.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`مراسلة ${b.name} عبر واتساب`}
                        className="inline-grid h-9 w-9 place-items-center text-[#1f7a4d] hover:bg-[#1f7a4d]/10"
                      >
                        <Icons.whatsapp />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-line lg:hidden">
              {rows.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => onOpen(b.id)} className="flex w-full items-start gap-3 px-4 py-4 text-start">
                    <Initials name={b.name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{b.name}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </span>
                      <span className="mt-1 block text-xs text-ink-soft">{procedureAr(b.procedure)}</span>
                      <span className="mt-1.5 block text-xs">
                        <When booking={b} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
      <p className="text-xs text-ink-mute">{rows.length} من أصل {bookings.length} حجز</p>
    </div>
  );
}

function When({ booking: b }: { booking: Booking }) {
  if (b.appointment)
    return (
      <span>
        {formatDate(b.appointment.date, { weekday: "short", day: "numeric", month: "short" })}
        <span className="text-ink-mute"> · {formatTime(b.appointment.time)}</span>
      </span>
    );
  return (
    <span className="text-ink-mute">
      يفضّل {formatDate(b.preferredDate, { weekday: "short", day: "numeric", month: "short" })} · {timeSlotAr(b.preferredTime)}
    </span>
  );
}
