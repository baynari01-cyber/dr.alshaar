"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode, type SVGProps } from "react";
import { statusMeta } from "@/lib/admin/format";
import type { BookingStatus } from "@/lib/admin/types";

/* ---------- Icons ---------- */

type IconProps = SVGProps<SVGSVGElement>;
const icon = (d: ReactNode) =>
  function Icon(props: IconProps) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
        {d}
      </svg>
    );
  };

export const Icons = {
  overview: icon(<path d="M4 13h6V4H4zM14 20h6v-9h-6zM14 4v4h6V4zM4 20h6v-3H4z" />),
  bookings: icon(<><path d="M8 3v3M16 3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="1" /><path d="M8 13h4M8 17h8" /></>),
  calendar: icon(<><rect x="4" y="5" width="16" height="16" rx="1" /><path d="M8 3v4M16 3v4M4 10h16M9 14h1M14 14h1M9 17h1" /></>),
  settings: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.3z" /></>),
  plus: icon(<path d="M12 5v14M5 12h14" />),
  search: icon(<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.3-4.3" /></>),
  close: icon(<path d="M6 6l12 12M18 6L6 18" />),
  whatsapp: icon(<><path d="M3.6 20.4l1.2-4.1A8.5 8.5 0 1 1 8 19.3l-4.4 1.1z" /><path d="M9 8.6c.2-.5.4-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.8-1 .4-2.6.2-4.4-1.3-1.9-1.6-2.9-3.6-2.6-4.7z" /></>),
  phone: icon(<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2.2 2A15 15 0 0 1 3 6.2 2 2 0 0 1 5 4z" />),
  download: icon(<path d="M12 4v11M7 10l5 5 5-5M5 20h14" />),
  chevron: icon(<path d="M15 5l-7 7 7 7" />),
  logout: icon(<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" />),
  external: icon(<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />),
  check: icon(<path d="M5 12.5l4.5 4.5L19 7.5" />),
  clock: icon(<><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>),
  trash: icon(<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />),
  copy: icon(<><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M16 8V4H4v12h4" /></>),
  bell: icon(<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />),
};

/* ---------- Primitives ---------- */

export function StatusBadge({ status, size = "md" }: { status: BookingStatus; size?: "sm" | "md" }) {
  const meta = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 border whitespace-nowrap ${meta.tone} ${size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-xs"}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.ar}
    </span>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
const variantClass: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-[#2c2924]",
  secondary: "border border-line-strong bg-white/60 text-ink hover:border-ink",
  ghost: "text-ink-soft hover:bg-ink/5 hover:text-ink",
  danger: "border border-[#e2c3bc] text-[#86392c] hover:bg-[#f1e0dc]",
  whatsapp: "bg-[#1f7a4d] text-white hover:bg-[#19663f]",
};

export function Btn({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40 ${
        size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm"
      } ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export const linkBtnClass = (variant: Variant, size: "sm" | "md" = "md") =>
  `inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-300 ${size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm"} ${variantClass[variant]}`;

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 border border-line bg-white/55 ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-sm font-medium">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span aria-hidden className="mb-4 h-px w-10 bg-gold" />
      <p className="text-sm">{title}</p>
      {hint && <p className="mt-2 max-w-xs text-xs leading-6 text-ink-mute">{hint}</p>}
    </div>
  );
}

export const fieldClass =
  "mt-1.5 block w-full border border-line-strong bg-white/70 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink aria-[invalid=true]:border-[#a6463a]";
export const labelClass = "block text-xs text-ink-soft";

/* ---------- Dialog / drawer shell ---------- */

export function Overlay({
  label,
  onClose,
  side = "center",
  children,
}: {
  label: string;
  onClose: () => void;
  side?: "center" | "end";
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" aria-label="إغلاق" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-night/45 backdrop-blur-[2px]" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={
          side === "end"
            ? "absolute inset-y-0 left-0 flex w-full max-w-xl flex-col bg-ivory shadow-2xl outline-none"
            : "absolute inset-x-3 top-1/2 mx-auto flex max-h-[92dvh] max-w-2xl -translate-y-1/2 flex-col bg-ivory shadow-2xl outline-none"
        }
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Toasts ---------- */

type Toast = { id: number; text: string };
const ToastContext = createContext<(text: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {toasts.map((t) => (
          <p key={t.id} className="flex items-center gap-2 bg-night px-4 py-3 text-sm text-ivory shadow-xl">
            <Icons.check className="text-gold-light" />
            {t.text}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
