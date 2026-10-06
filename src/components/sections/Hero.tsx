"use client";

import { motion } from "motion/react";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/Media";
import { media } from "@/content/media";
import { credentials, doctor } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;
const headline = ["نتائج طبيعية.", "تفاصيل أدق.", "ثقة أكبر."] as const;

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-night text-ivory lg:min-h-dvh">
      {/* Portrait: full-bleed on the end side (left in RTL), melting into the dark ground. */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease }}
        className="relative -z-10 aspect-[4/5] w-full sm:aspect-[16/11] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[50%]"
      >
        <Media asset={media.doctor.hero} sizes="(min-width: 1024px) 50vw, 100vw" preload className="absolute inset-0" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/10 to-transparent lg:hidden" />
        <span aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(to_left,var(--night)_0%,rgb(20_18_15/0.55)_22%,transparent_55%)] lg:block" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-night to-transparent lg:block" />
      </motion.div>

      <div className="container-lux relative -mt-28 pb-14 sm:-mt-40 lg:mt-0 lg:flex lg:min-h-dvh lg:flex-col lg:justify-end lg:pt-40 lg:pb-12">
        <div className="lg:w-[56%] lg:pb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="flex items-center gap-4 text-gold-light"
          >
            <span aria-hidden className="h-px w-10 bg-current" />
            <span className="eyebrow">
              {doctor.titleEn}
              <span className="hidden sm:inline">
                <span className="mx-2 opacity-50">/</span> {doctor.locationEn}
              </span>
            </span>
          </motion.p>

          <h1 id="hero-title" className="mt-8 text-[clamp(3rem,8vw,7.5rem)] leading-[1.08] font-extralight tracking-tight lg:mt-10">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? "text-gold-light" : ""}`}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.3, delay: 0.35 + i * 0.14, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.95, ease }}
            className="mt-8 max-w-md border-s border-gold-light/50 ps-6 lg:mt-12"
          >
            <p className="text-lg leading-8 text-ivory/75 lg:text-xl lg:leading-9">
              أخصائي جراحة الأنف والأذن والحنجرة
              <br />
              وتجميل الأنف والأذن
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.1, ease }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <ButtonLink href="#booking" variant="gold" icon={<ArrowIcon />}>
              احجز استشارتك
            </ButtonLink>
            <TextLink href="#results" className="border-ivory/30 text-ivory hover:border-ivory">
              شاهد النتائج
            </TextLink>
          </motion.div>
        </div>

        <motion.ul
          aria-label="المؤهلات"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-night-line pt-6 lg:mt-0 lg:grid-cols-4"
        >
          {credentials.map((c) => (
            <li key={c.en} className="eyebrow text-ivory/55">
              {c.en}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
