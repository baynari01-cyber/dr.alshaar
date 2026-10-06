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
