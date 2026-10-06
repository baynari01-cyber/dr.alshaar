"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import {
  LIMITS,
  asksPriorSurgery,
  bookingWhatsAppUrl,
  emptyBooking,
  procedures,
  timeSlots,
  todayISO,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from "@/lib/booking";

const FIELD_ORDER: readonly BookingField[] = ["name", "phone", "age", "procedure", "date", "time", "notes", "consent"];

const noopSubscribe = () => () => {};

/** Today's date on the client; empty during static prerender. */
function useToday(): string {
  return useSyncExternalStore(noopSubscribe, todayISO, () => "");
}

export function BookingForm() {
  const uid = useId();
  const fieldId = (f: BookingField) => `${uid}-${f}`;
  const today = useToday();
  const [values, setValues] = useState<BookingInput>(emptyBooking);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const set = <K extends BookingField>(field: K, value: BookingInput[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onText = (field: "name" | "phone" | "age" | "date" | "notes") => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    set(field, e.target.value);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateBooking(values);
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    const url = bookingWhatsAppUrl(values);
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setValues(emptyBooking);
    setErrors({});
    setSentUrl(null);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sentUrl ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="status"
          className="flex min-h-[28rem] flex-col justify-center"
        >
          <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full border border-gold-light/60 text-gold-light">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h3 className="mt-8 text-3xl font-light">تم تجهيز طلبك.</h3>
          <p className="mt-4 max-w-md leading-8 text-ivory/70">
            فُتحت محادثة WhatsApp مع العيادة وفيها تفاصيل طلبك. اضغط «إرسال» داخل التطبيق، وسيتواصل معك فريق العيادة لتأكيد
            الموعد.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-3 bg-gold-light px-6 text-sm font-medium text-night transition-colors hover:bg-[#d8bf9c]"
            >
              <WhatsAppIcon /> فتح WhatsApp مرة أخرى
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center border border-ivory/25 px-6 text-sm transition-colors hover:border-ivory"
            >
              طلب جديد
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="نموذج حجز استشارة"
          className="grid gap-x-6 gap-y-8 sm:grid-cols-2"
        >
          <Field id={fieldId("name")} label="الاسم الكامل" required error={errors.name}>
            <input
              id={fieldId("name")}
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={values.name}
              onChange={onText("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined}
              className={inputClass}
            />
          </Field>

          <Field id={fieldId("phone")} label="رقم الهاتف / واتساب" required error={errors.phone}>
            <input
              id={fieldId("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="07X XXX XXXX"
              value={values.phone}
              onChange={onText("phone")}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${fieldId("phone")}-error` : undefined}
              className={`${inputClass} text-end placeholder:text-ivory/25`}
            />
          </Field>

          <fieldset className="sm:col-span-2" aria-describedby={errors.procedure ? `${fieldId("procedure")}-error` : undefined}>
            <legend className={labelClass}>
              سبب الاستشارة <Required />
            </legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {procedures.map((p, i) => (
                <Choice
                  key={p.id}
                  id={i === 0 ? fieldId("procedure") : `${fieldId("procedure")}-${p.id}`}
                  name={`${uid}-procedure`}
                  checked={values.procedure === p.id}
                  onChange={() => set("procedure", p.id)}
                >
                  {p.ar}
                </Choice>
              ))}
            </div>
            <ErrorText id={`${fieldId("procedure")}-error`} message={errors.procedure} />
          </fieldset>

          <AnimatePresence initial={false}>
            {asksPriorSurgery(values.procedure) && (
              <motion.fieldset
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden sm:col-span-2"
              >
                <legend className={labelClass}>هل أجريت عملية أنف سابقًا؟</legend>
                <div className="mt-4 flex gap-2.5">
                  {(
                    [
                      ["no", "لا"],
                      ["yes", "نعم"],
                    ] as const
                  ).map(([v, label]) => (
                    <Choice
                      key={v}
                      id={`${uid}-prior-${v}`}
                      name={`${uid}-prior`}
                      checked={values.priorSurgery === v}
                      onChange={() => set("priorSurgery", v)}
                    >
                      {label}
                    </Choice>
                  ))}
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>

          <Field id={fieldId("date")} label="التاريخ المفضل" required error={errors.date}>
            <input
              id={fieldId("date")}
              type="date"
              min={today || undefined}
              value={values.date}
              onChange={onText("date")}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? `${fieldId("date")}-error` : undefined}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </Field>

          <fieldset aria-describedby={errors.time ? `${fieldId("time")}-error` : undefined}>
            <legend className={labelClass}>
              الوقت المفضل <Required />
            </legend>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {timeSlots.map((t, i) => (
                <Choice
                  key={t.id}
                  id={i === 0 ? fieldId("time") : `${fieldId("time")}-${t.id}`}
                  name={`${uid}-time`}
                  checked={values.time === t.id}
                  onChange={() => set("time", t.id)}
                  block
                >
                  {t.ar}
                </Choice>
              ))}
            </div>
            <ErrorText id={`${fieldId("time")}-error`} message={errors.time} />
          </fieldset>

          <Field id={fieldId("age")} label="العمر" hint="اختياري" error={errors.age}>
            <input
              id={fieldId("age")}
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={values.age}
              onChange={onText("age")}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? `${fieldId("age")}-error` : undefined}
              className={inputClass}
            />
          </Field>

          <Field id={fieldId("notes")} label="ملاحظات" hint="اختياري" error={errors.notes} wide>
            <textarea
              id={fieldId("notes")}
              rows={3}
              maxLength={LIMITS.notes}
              dir="auto"
              placeholder="صف باختصار ما تودّ تحسينه أو الأعراض التي تعاني منها."
              value={values.notes}
              onChange={onText("notes")}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? `${fieldId("notes")}-error` : undefined}
              className={`${inputClass} resize-none leading-7 placeholder:text-ivory/25`}
            />
            <span className="mt-1.5 block text-end text-[0.7rem] text-ivory/35" dir="ltr">
              {values.notes.length} / {LIMITS.notes}
            </span>
          </Field>

          <div className="sm:col-span-2">
            <label htmlFor={fieldId("consent")} className="flex cursor-pointer items-start gap-3 text-sm leading-7 text-ivory/75">
              <input
                id={fieldId("consent")}
                type="checkbox"
                checked={values.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
                className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--gold-light)]"
              />
              أوافق على تواصل العيادة معي عبر WhatsApp أو الهاتف بخصوص هذا الطلب.
            </label>
            <ErrorText id={`${fieldId("consent")}-error`} message={errors.consent} />
          </div>

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="group inline-flex h-14 items-center justify-center gap-3 bg-gold-light px-8 text-[0.95rem] font-medium text-night transition-colors duration-500 hover:bg-[#d8bf9c]"
            >
              <WhatsAppIcon />
              إرسال الطلب عبر WhatsApp
            </button>
            <p className="text-xs leading-6 text-ivory/45">يُرسل طلبك مباشرة إلى رقم العيادة، ولا نحتفظ بأي بيانات.</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

const labelClass = "block text-sm text-ivory/70";
const inputClass =
  "mt-3 block w-full border-0 border-b border-ivory/20 bg-transparent px-0 py-3 text-base text-ivory transition-colors duration-300 outline-none focus:border-gold-light aria-[invalid=true]:border-[#e08a7a]";

function Required() {
  return (
    <span aria-hidden className="text-gold-light">
      *
    </span>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-[#f0a596]">
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  hint,
  required = false,
  error,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <Required />}
        {hint && <span className="ms-2 text-xs text-ivory/35">{hint}</span>}
      </label>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function Choice({
  id,
  name,
  checked,
  onChange,
  block = false,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  block?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex min-h-11 cursor-pointer items-center justify-center border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-light ${
        block ? "w-full" : ""
      } ${checked ? "border-gold-light bg-gold-light/12 text-ivory" : "border-ivory/20 text-ivory/70 hover:border-ivory/50"}`}
    >
      <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}
