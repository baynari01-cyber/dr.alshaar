import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { About } from "@/components/sections/About";
import { Clinic } from "@/components/sections/Clinic";
import { Consultation } from "@/components/sections/Consultation";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Philosophy } from "@/components/sections/Philosophy";
import { Pillars } from "@/components/sections/Pillars";
import { Results } from "@/components/sections/Results";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { MotionProvider } from "@/components/ui/MotionProvider";

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        انتقل إلى المحتوى
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Philosophy />
        <Results />
        <About />
        <Services />
        <Pillars />
        <Testimonials />
        <Gallery />
        <Consultation />
        <Clinic />
      </main>
      <Footer />
      <MobileCTA />
    </MotionProvider>
  );
}
