import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic } from "next/font/google";
import { contact, doctor, links, seo } from "@/content/site";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif-latin",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  applicationName: doctor.nameEn,
  authors: [{ name: doctor.nameEn }],
  keywords: [
    "تجميل الأنف",
    "جراحة الأنف والأذن والحنجرة",
    "تصحيح الأذن البارزة",
    "عمّان",
    "Rhinoplasty Amman",
    "Otoplasty",
    doctor.nameEn,
  ],
  openGraph: {
    type: "website",
    locale: "ar_JO",
    title: seo.title,
    description: seo.description,
    siteName: doctor.nameEn,
  },
  twitter: { card: "summary", title: seo.title, description: seo.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: doctor.nameEn,
  alternateName: doctor.nameAr,
  description: seo.description,
  medicalSpecialty: ["Otolaryngologic", "PlasticSurgery"],
  telephone: contact.phoneE164,
  sameAs: [links.instagram],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ibn Khaldoun Street, Jawharat Al-Mamlaka Complex No. 57, 3rd Floor",
    addressLocality: "Amman",
    addressCountry: "JO",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${serif.variable}`}>
      <body className="min-h-dvh overflow-x-clip bg-ivory text-ink antialiased">
        <script
          type="application/ld+json"
          // Static, server-defined object; `<` is escaped to keep the script block inert.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
