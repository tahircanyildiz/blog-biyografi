"use client";

import type { MouseEvent, ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Border glow that follows the cursor via CSS custom properties, updated
 * directly on the DOM node — avoids a React re-render on every mouse move.
 */
export function GlowCard({ children, className = "" }: GlowCardProps) {
  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`glow-card rounded-xl border border-border bg-surface transition-colors hover:border-border-hover ${className}`}
    >
      {children}
    </div>
  );
}
