"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SEARCH, RESULTS } from "@/lib/b2c/copy";
import { PASSENGER_LIMITS } from "@/lib/b2c/transfer-search";

/**
 * Passenger count as a disclosure: one compact cell in the search bar
 * that opens to two steppers. Native number inputs were rejected because
 * their spin buttons are tiny on touch screens and invisible on iOS.
 */
export function PassengerField({
  adults,
  childCount,
  onChange,
  className = "",
}: {
  adults: number;
  childCount: number;
  onChange: (next: { adults: number; children: number }) => void;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const rows = [
    {
      key: "adults" as const,
      label: SEARCH.adults,
      hint: SEARCH.adultsHint,
      value: adults,
      ...PASSENGER_LIMITS.adults,
      noun: "adult",
    },
    {
      key: "children" as const,
      label: SEARCH.children,
      hint: SEARCH.childrenHint,
      value: childCount,
      ...PASSENGER_LIMITS.children,
      noun: "child",
    },
  ];

  const set = (key: "adults" | "children", v: number) =>
    onChange({ adults, children: childCount, [key]: v });

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="sf-cell w-full text-left"
      >
        <span className="sf-label" id={`${id}-label`}>
          {SEARCH.passengers}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2 font-sans text-body text-ink">
          <span className="truncate">{RESULTS.passengers(adults, childCount)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="shrink-0 text-graphite">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
            <circle cx="17" cy="9.5" r="2.4" />
            <path d="M15.5 14.4c2.6-.3 4.6 1.3 5 4.1" />
          </svg>
        </span>
      </button>

      <div
        id={`${id}-panel`}
        role="group"
        aria-labelledby={`${id}-label`}
        className={`absolute right-0 top-full z-30 mt-1 w-full min-w-[17rem] border border-graphite/25 bg-ivory p-5 shadow-[0_24px_48px_-24px_rgba(21,19,15,0.5)] ${
          open ? "" : "hidden"
        }`}
      >
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 border-b border-graphite/15 py-3 first:pt-0">
            <div>
              <p className="font-sans text-body text-ink" id={`${id}-${row.key}`}>
                {row.label}
              </p>
              <p className="font-sans text-small text-graphite">{row.hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <StepButton
                label={SEARCH.decrease(row.noun)}
                disabled={row.value <= row.min}
                onClick={() => set(row.key, row.value - 1)}
              >
                −
              </StepButton>
              <output
                aria-labelledby={`${id}-${row.key}`}
                aria-live="polite"
                className="w-6 text-center font-sans text-body tabular-nums text-ink"
              >
                {row.value}
              </output>
              <StepButton
                label={SEARCH.increase(row.noun)}
                disabled={row.value >= row.max}
                onClick={() => set(row.key, row.value + 1)}
              >
                +
              </StepButton>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
          className="btn-outline mt-4 w-full py-3"
        >
          {SEARCH.done}
        </button>
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center border border-graphite/30 font-sans text-body-lg text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-graphite/30"
    >
      {children}
    </button>
  );
}
