"use client";

import { useInView } from "@/lib/useInView";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Render visible from the first paint and skip observation entirely.
   * Use for anything above the fold: there is nothing to reveal on an
   * element the visitor can already see, and gating it on hydration
   * delays the largest contentful paint for no visual gain. */
  immediate?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, immediate);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-editorial motion-reduce:transition-none motion-reduce:transform-none ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
