"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

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
  const MotionWrap = shouldReduceMotion ? "div" : motion.div;
  const motionProps = shouldReduceMotion
    ? {}
    : { variants: container, initial: "hidden", animate: "show" };
  const itemProps = shouldReduceMotion ? {} : { variants: item };

  const stats = [
    { label: statYearsLabel, value: statYearsValue },
    { label: statProjLabel, value: statProjValue },
    { label: statLocLabel, value: location },
  ];

  return (
    <section id="hero" className="relative overflow-hidden">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 pb-24 pt-20 md:flex-row md:items-center md:pb-32 md:pt-28">
        <MotionWrap {...motionProps} className="flex-1">
          <motion.div
            {...itemProps}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted"
          >
            <Sparkles size={14} className="text-accent" aria-hidden />
            Yeni projelere açığım
          </motion.div>

          <motion.h1
            {...itemProps}
            className="text-4xl font-semibold tracking-tight text-ink md:text-6xl"
          >
            {firstName}
            <br />
            {lastName}
          </motion.h1>

          <motion.p {...itemProps} className="mt-4 text-lg text-muted">
            {roleTitle}
            {tagline ? ` — ${tagline}` : ""}
          </motion.p>

          <motion.p {...itemProps} className="mt-4 max-w-prose text-muted">
            {bio}
          </motion.p>

          <motion.div {...itemProps} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Projelerimi Gör
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-border-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              İletişime Geç
            </a>
          </motion.div>

          <motion.div
            {...itemProps}
            className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-semibold text-ink md:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </MotionWrap>

        <MotionWrap
          {...(shouldReduceMotion
            ? {}
            : {
                variants: item,
                initial: "hidden",
                animate: "show",
              })}
          className="relative aspect-square w-56 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-surface md:w-80"
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              fill
              sizes="(min-width: 768px) 320px, 224px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              Profil Fotoğrafı
            </div>
          )}
        </MotionWrap>
      </div>
    </section>
  );
}
