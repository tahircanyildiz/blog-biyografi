"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Framer Motion'ın kendi dahili prefers-reduced-motion davranışı, animasyonu
 * "initial" (görünmez) durumda sonsuza kadar donduruyor — bizim kendi
 * `useReducedMotion()` kontrollerimizle (plain div'e düşüp anında gösterme)
 * çakışıp içeriği tamamen görünmez bırakıyor. `reducedMotion="never"` ile
 * Framer'ın otomatik dondurmasını kapatıp bu kararı tamamen kendi
 * bileşenlerimize bırakıyoruz.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
