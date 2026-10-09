"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ACTIVE_LOCALE, LANGUAGES } from "@/lib/b2c/locale";
import { NAV } from "@/lib/b2c/copy";

/**
 * Language indicator for the consumer pages.
 *
 * Only English exists. The planned languages are listed so the selector
 * has its final shape and space for longer names, but they are disabled
 * and labelled as in preparation: nothing pretends to switch language.
 */
export function LanguageMenu({
  tabIndex,
  align = "right",
}: {
  tabIndex?: number;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const active = LANGUAGES.find((l) => l.code === ACTIVE_LOCALE)!;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        tabIndex={tabIndex}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${NAV.language}: ${active.label}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[44px] items-center gap-2 font-sans text-small uppercase tracking-[0.08em]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        {active.code.toUpperCase()}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          aria-label={NAV.language}
          className={`absolute top-full z-10 mt-2 w-56 border border-graphite/20 bg-ivory py-2 text-ink shadow-[0_18px_40px_-20px_rgba(21,19,15,0.45)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {LANGUAGES.map((l) => (
            <li
              key={l.code}
              lang={l.tag}
              aria-current={l.available ? "true" : undefined}
              aria-disabled={!l.available || undefined}
              className={`flex items-center justify-between gap-4 px-4 py-2.5 font-sans text-small ${
                l.available ? "text-ink" : "text-graphite/80"
              }`}
            >
              <span className="flex items-center gap-2">
                {l.available && <span className="h-1.5 w-1.5 bg-swt-orange" aria-hidden="true" />}
                {l.label}
              </span>
              {!l.available && (
                <span className="text-[0.6875rem] uppercase tracking-[0.1em]" lang="en">
                  {NAV.languagePlanned}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
