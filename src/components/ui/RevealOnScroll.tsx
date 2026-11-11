import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Kaydırınca yumuşakça beliren blok — tamamen CSS (bkz. globals.css `.reveal`,
 * `animation-timeline: view()`). Önceki Framer Motion sürümü içeriği JS
 * yüklenene kadar `opacity: 0` tutuyordu; bu da mobilde LCP'yi ~2 sn
 * geciktiriyordu. Desteklemeyen tarayıcılarda içerik doğrudan görünür.
 */
export function RevealOnScroll({ children, className = "" }: RevealOnScrollProps) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
