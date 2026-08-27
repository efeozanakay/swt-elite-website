"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element first crosses the viewport threshold.
 * Falls back to "already visible" if IntersectionObserver is unavailable.
 *
 * `disabled` opts an element out of observation entirely and reports it as
 * visible from the very first render, server included. Above-the-fold
 * content needs this: gating it on hydration means the browser has HTML it
 * could paint immediately but is told to keep it at opacity 0 until a
 * client bundle loads and an observer fires.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.2,
  disabled = false
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, disabled]);

  return { ref, inView };
}
