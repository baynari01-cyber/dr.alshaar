"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { doctor } from "@/content/site";
import { formatDate } from "@/lib/admin/format";
import { useAdminData, useToday } from "@/lib/admin/store";
import { BookingDrawer } from "./BookingDrawer";
import { BookingsView } from "./BookingsView";
import { CalendarView } from "./CalendarView";
import { NewBookingDialog, type NewBookingPreset } from "./NewBookingDialog";
import { OverviewView } from "./OverviewView";
import { SettingsView } from "./SettingsView";
import { Btn, Icons, ToastProvider } from "./ui";

/**
 * DEMO ACCESS — the passcode is shown on the login screen on purpose. This
 * gate only frames the demo; a production build must use server-side
 * authentication before any patient data is served.
 */
const DEMO_PASSCODE = "alshaar";
const SESSION_KEY = "alshaar.admin.session";

type View = "overview" | "bookings" | "calendar" | "settings";

const views: { id: View; label: string; icon: keyof typeof Icons }[] = [
  { id: "overview", label: "نظرة عامة", icon: "overview" },
  { id: "bookings", label: "الحجوزات", icon: "bookings" },
  { id: "calendar", label: "التقويم", icon: "calendar" },
  { id: "settings", label: "الإعدادات", icon: "settings" },
];

const titles: Record<View, string> = {
  overview: "نظرة عامة",
  bookings: "الحجوزات",
  calendar: "تقويم المواعيد",
  settings: "الإعدادات",
};

const viewFromHash = (): View => {
  const h = window.location.hash.slice(1);
  return views.some((v) => v.id === h) ? (h as View) : "overview";
};

const readSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

export default function AdminApp() {
  const [authed, setAuthed] = useState(readSession);
  return <ToastProvider>{authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onSuccess={() => setAuthed(true)} />}</ToastProvider>;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() !== DEMO_PASSCODE) {
      setError("كلمة المرور غير صحيحة.");
      return;
    }
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Session storage unavailable — stay signed in for this page view only.
    }
    onSuccess();
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-night px-5 py-12 text-ivory">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center text-gold-light">Clinic Dashboard</p>
        <h1 className="mt-5 text-center text-3xl font-light">{doctor.nameAr}</h1>
        <p className="mt-2 text-center text-sm text-ivory/55">لوحة إدارة الحجوزات</p>

        <form onSubmit={submit} className="mt-12 border border-night-line bg-night-soft p-7" noValidate>
          <label htmlFor="admin-pass" className="block text-sm text-ivory/70">
            كلمة المرور
          </label>
          <input
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "admin-pass-error" : "admin-pass-hint"}
            className="mt-3 block w-full border-0 border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none focus:border-gold-light aria-[invalid=true]:border-[#e08a7a]"
          />
          {error && (
            <p id="admin-pass-error" role="alert" className="mt-2 text-xs text-[#f0a596]">
              {error}
            </p>
          )}
          <button type="submit" className="mt-8 h-12 w-full bg-gold-light text-sm font-medium text-night transition-colors hover:bg-[#d8bf9c]">
            دخول
          </button>
          <p id="admin-pass-hint" className="mt-6 border-t border-night-line pt-5 text-center text-xs leading-6 text-ivory/50">
            نسخة عرض تجريبية — كلمة المرور: <span dir="ltr" className="font-mono text-gold-light">{DEMO_PASSCODE}</span>
          </p>
        </form>
        <Link href="/" className="mt-8 block text-center text-xs text-ivory/45 hover:text-ivory">
          العودة إلى الموقع
        </Link>
      </div>
    </main>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { bookings } = useAdminData();
  const today = useToday();
  const [view, setView] = useState<View>(viewFromHash);
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState<NewBookingPreset | null>(null);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((v: View) => {
    setView(v);
    window.history.replaceState(null, "", `#${v}`);
    window.scrollTo({ top: 0 });
  }, []);

  const closeDrawer = useCallback(() => setOpenId(null), []);
  const closeCreate = useCallback(() => setCreating(null), []);

  const pending = bookings.filter((b) => b.status === "new").length;

  const logout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    onLogout();
  };

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-night text-ivory lg:flex">
        <div className="border-b border-night-line px-6 py-7">
          <p className="text-lg font-medium">{doctor.nameAr}</p>
          <p className="eyebrow mt-1.5 !text-[0.55rem] text-gold-light">Clinic Dashboard</p>
        </div>
        <nav aria-label="أقسام اللوحة" className="flex-1 px-3 py-5">
          <ul className="space-y-1">
            {views.map((v) => {
              const Icon = Icons[v.icon];
              const active = view === v.id;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => navigate(v.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      active ? "bg-ivory/10 text-ivory" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
                    }`}
                  >
                    <Icon />
                    <span className="flex-1 text-start">{v.label}</span>
                    {v.id === "bookings" && pending > 0 && (
                      <span className="min-w-6 bg-gold-light px-1.5 text-center text-[0.7rem] font-medium text-night tabular-nums">{pending}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-1 border-t border-night-line px-3 py-4 text-sm">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-ivory/60 hover:text-ivory">
            <Icons.external /> عرض الموقع
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 text-ivory/60 hover:text-ivory">
            <Icons.logout /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-10">
        <p className="bg-gold-light/30 px-4 py-2 text-center text-[0.72rem] text-gold-ink lg:px-8">
          نسخة عرض تجريبية — البيانات محفوظة في هذا المتصفح فقط، والأسماء المعلّمة «تجريبي» وهمية.
        </p>

        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-ivory/90 px-4 py-4 backdrop-blur-md lg:px-8 lg:py-5">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-medium lg:text-2xl">{titles[view]}</h1>
            <p className="mt-0.5 text-xs text-ink-mute">{today && formatDate(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={logout} aria-label="تسجيل الخروج" className="grid h-11 w-11 place-items-center text-ink-soft lg:hidden">
              <Icons.logout />
            </button>
            <Btn variant="primary" onClick={() => setCreating({})}>
              <Icons.plus /> <span className="hidden sm:inline">حجز جديد</span>
            </Btn>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {view === "overview" && <OverviewView onOpen={setOpenId} onNavigate={navigate} />}
          {view === "bookings" && <BookingsView onOpen={setOpenId} />}
          {view === "calendar" && <CalendarView onOpen={setOpenId} onCreateAt={(date, time) => setCreating({ date, time: time || undefined })} />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav aria-label="أقسام اللوحة" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-night-line bg-night pb-[env(safe-area-inset-bottom)] text-ivory lg:hidden">
        {views.map((v) => {
          const Icon = Icons[v.icon];
          const active = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => navigate(v.id)}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-3 text-[0.68rem] ${active ? "text-gold-light" : "text-ivory/55"}`}
            >
              <Icon />
              {v.label}
              {v.id === "bookings" && pending > 0 && (
                <span className="absolute top-1.5 start-[calc(50%+6px)] min-w-4 bg-gold-light px-1 text-[0.6rem] text-night tabular-nums">{pending}</span>
              )}
            </button>
          );
        })}
      </nav>

      {openId && <BookingDrawer bookingId={openId} onClose={closeDrawer} />}
      {creating && (
        <NewBookingDialog
          preset={creating}
          onClose={closeCreate}
          onCreated={(id) => {
            setCreating(null);
            setOpenId(id);
          }}
        />
      )}
    </div>
  );
}
