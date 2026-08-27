"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Fleet", href: "#fleet" },
  { label: "Türkiye", href: "#coverage" },
  { label: "About", href: "#people" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 72);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu and puts focus back on the control
  // that opened it, so a keyboard visitor is not dropped at the top of
  // the document with nothing focused.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-graphite/15 bg-ivory/95 text-ink backdrop-blur-sm"
          : "on-dark border-b border-transparent bg-transparent text-ivory"
      }`}
    >
      {/*
        Over the hero the header has no ground of its own, and the film
        underneath it changes for twenty seconds. Sampling every second
        of the loop at all five header items, ivory text measured as low
        as 2.93:1 against bright sky frames, with 15 of 105 samples under
        4.5. This scrim holds the worst case at 6.46:1 without reading as
        a bar: it runs to twice the header height and fades out well
        below the type, so there is no visible edge anywhere.
      */}
      {!solid && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[200%] bg-gradient-to-b from-charcoal/65 via-charcoal/40 to-transparent"
        />
      )}
      <div className="edge wrap flex h-[var(--header-h)] items-center justify-between">
        <a href="#top" onClick={() => setOpen(false)} className="shrink-0">
          <BrandMark height={118} priority />
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 font-sans text-small uppercase tracking-[0.08em] transition-opacity duration-300 hover:opacity-80"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-swt-orange transition-all duration-300 ease-editorial group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#handover"
          className={`hidden border px-6 py-3 font-sans text-small uppercase tracking-[0.1em] transition-colors duration-300 lg:inline-flex ${
            solid
              ? "border-ink/30 text-ink hover:border-ink"
              : "border-ivory/40 text-ivory hover:border-ivory"
          }`}
        >
          Partner With Us
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-current transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-current transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-graphite/15 bg-ivory text-ink transition-[max-height] duration-500 ease-editorial lg:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <div className="edge flex flex-col gap-6 py-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? undefined : -1}
              className="font-sans text-body uppercase tracking-[0.08em]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#handover"
            tabIndex={open ? undefined : -1}
            className="btn-primary mt-2 w-fit"
            onClick={() => setOpen(false)}
          >
            Partner With Us
          </a>
        </div>
      </nav>
    </header>
  );
}
