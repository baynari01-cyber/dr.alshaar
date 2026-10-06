"use client";

import { motion } from "motion/react";
import { FaceProfile } from "@/components/art/FaceProfile";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/Media";
import { media } from "@/content/media";
import { doctor, links } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;
const headline = ["نتائج طبيعية.", "تفاصيل أدق.", "ثقة أكبر."] as const;

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative pt-28 pb-16 lg:min-h-dvh lg:pt-36 lg:pb-20">
      <div className="container-lux grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="flex items-center gap-4 text-gold-ink"
          >
            <span aria-hidden className="h-px w-10 bg-current" />
            <span className="eyebrow">
              {doctor.titleEn}
              <span className="hidden sm:inline">
                <span className="mx-2 opacity-50">/</span> {doctor.locationEn}
              </span>
            </span>
          </motion.p>

          <h1 id="hero-title" className="mt-8 text-[clamp(3rem,8.4vw,7.75rem)] leading-[1.08] font-extralight tracking-tight lg:mt-12">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? "text-gold-ink" : ""}`}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.3, delay: 0.25 + i * 0.14, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease }}
            className="mt-10 max-w-md border-s border-gold/50 ps-6 lg:mt-14"
          >
            <p className="text-lg leading-8 text-ink-soft lg:text-xl lg:leading-9">
              أخصائي جراحة الأنف والأذن والحنجرة
              <br />
              وتجميل الأنف والأذن
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1, ease }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <ButtonLink href={links.whatsapp} external icon={<ArrowIcon />}>
              احجز استشارتك
            </ButtonLink>
            <TextLink href="#results">شاهد النتائج</TextLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease }}
          className="relative lg:col-span-5"
        >
          <Media
            asset={media.doctor.hero}
            sizes="(min-width: 1024px) 40vw, 100vw"
            preload
            className="aspect-[4/5] w-full lg:max-h-[78vh]"
            placeholderArt={
              <FaceProfile delay={0.9} className="absolute inset-y-[8%] start-[12%] h-[84%] text-ink/70" />
            }
          />
          <div className="mt-5 flex items-baseline justify-between gap-6">
            <p className="font-serif text-xl italic text-ink">{doctor.nameEn}</p>
            <p className="eyebrow text-ink-mute">{doctor.locationEn}</p>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
