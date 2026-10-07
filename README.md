# Dr. Mohammed Alshaar — ENT & Facial Plastic Surgeon

Arabic-first (RTL) personal-brand website built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Motion.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Content

All copy and facts live in `src/content/`:

| File | Purpose |
| --- | --- |
| `site.ts` | Doctor details, credentials, contact links, navigation, SEO |
| `media.ts` | Image manifest (portraits, services, clinic, gallery) |
| `results.ts` | Before / after cases |
| `testimonials.ts` | Verified patient reviews |

## Replacing image placeholders

Every image slot whose `src` is `null` renders a marked placeholder
(`data-image-placeholder="true"`, `// IMAGE PLACEHOLDER` in code).

1. Copy the real photograph into the matching folder:
   `public/images/doctor`, `rhinoplasty`, `otoplasty`, `clinic`, `gallery`.
2. Set its `src` in `src/content/media.ts` (or `results.ts`), e.g.
   `src: "/images/doctor/portrait-hero.jpg"`.

Rules: real photographs of Dr. Alshaar, his clinic and his own work only.
Before / after cases require the patient's written consent; set
`verified: true` only for such cases.

## Testimonials

`testimonials.ts` is intentionally empty. While it is empty the section is
hidden in production builds and shows marked placeholders in development only.
Add reviews verbatim from their published source (e.g. Google).

## Booking

`src/components/booking/BookingForm.tsx` collects the consultation request and
validates it with `src/lib/booking.ts`. Submitting opens WhatsApp to the clinic
number (`contact.phoneE164` in `src/content/site.ts`) with a formatted message
the patient sends from their own WhatsApp. No data is stored by the site.

## Clinic dashboard (`/admin`)

A demo dashboard for the clinic to manage requests:

- **Overview** — pending requests, today's appointments, next 7 days, attendance rate, requests by reason.
- **Bookings** — search, status/reason filters, sorting, CSV export (opens in Excel with Arabic intact).
- **Booking details** — schedule into a free slot (respects working days, hours and existing appointments),
  WhatsApp confirmation / reminder / reschedule messages, mark visit completed / no-show / cancelled,
  internal notes and an action history.
- **Calendar** — week grid (desktop) and day agenda (mobile); click an empty slot to book it.
- **Settings** — working days and hours, appointment length, editable WhatsApp templates with live preview.

Demo scope: data is kept in the browser's `localStorage` (`src/lib/admin/store.ts`) and seeded with
clearly-labelled fictitious bookings (`src/lib/admin/seed.ts`). Requests sent from the website form on the
same browser appear in the dashboard. The login passcode (`alshaar`) is displayed on the login screen and is
not a security boundary. A production version needs a database, server-side authentication and server
actions in place of `store.ts`.
