"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HeroBackground } from "./HeroBackground";

interface HeroProps {
  firstName: string;
  lastName: string;
  roleTitle: string;
  tagline: string;
  bio: string;
  statYearsLabel: string;
  statYearsValue: string;
  statProjLabel: string;
  statProjValue: string;
  statLocLabel: string;
  location: string;
  profileImage: string;
}

export function Hero({
  firstName,
  lastName,
  roleTitle,
  tagline,
  bio,
  statYearsLabel,
  statYearsValue,
  statProjLabel,
  statProjValue,
  statLocLabel,
  location,
  profileImage,
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { icon: "💼", label: statYearsLabel, value: statYearsValue },
    { icon: "</>", label: statProjLabel, value: statProjValue },
    { icon: "📍", label: statLocLabel, value: location },
  ];

  // Sıralı ("orkestre") giriş: her öğe bir öncekinden 0.08s sonra başlar.
  let step = 0;
  const nextDelay = () => step++ * 0.08;

  function itemMotion() {
    const delay = nextDelay();
    return {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.5, delay, ease: "easeOut" as const },
    };
  }

  return (
    <section id="hero" className="relative overflow-hidden">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-12 px-6 pb-24 pt-20 md:flex-row md:pb-32 md:pt-28">
        <div className="flex w-full flex-shrink-0 flex-col items-center gap-6 md:w-80">
          <motion.div
            {...itemMotion()}
            className="relative aspect-square w-56 overflow-hidden rounded-full border border-border bg-surface md:w-72"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${firstName} ${lastName}`}
                fill
                sizes="(min-width: 768px) 288px, 224px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                Profil Fotoğrafı
              </div>
            )}
          </motion.div>

          <div className="flex w-full flex-col gap-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                {...itemMotion()}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <span className="text-lg" aria-hidden>
                  {stat.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">{stat.value}</div>
                  <div className="text-[0.65rem] uppercase tracking-[0.15em] text-muted">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <motion.p
            {...itemMotion()}
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted"
          >
            {roleTitle}
          </motion.p>

          <motion.h1
            {...itemMotion()}
            className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink md:text-7xl"
          >
            {firstName}
            <br />
            {lastName}
          </motion.h1>

          {tagline && (
            <motion.p {...itemMotion()} className="mt-4 text-lg text-muted">
              {tagline}
            </motion.p>
          )}

          <motion.p {...itemMotion()} className="mt-6 max-w-prose text-muted leading-relaxed">
            {bio}
          </motion.p>

          <motion.div
            {...itemMotion()}
            className="mt-12 flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-muted"
          >
            <span className="h-px w-10 bg-border-hover" aria-hidden />
            Keşfetmek için kaydırın
          </motion.div>
        </div>
      </div>
    </section>
  );
}
