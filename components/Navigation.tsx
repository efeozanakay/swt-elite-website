"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { EnquiryButton } from "@/components/EnquiryButton";
import { LanguageMenu } from "@/components/b2c/LanguageMenu";
import { NAV } from "@/lib/b2c/copy-nav";

type NavLink = { label: string; href: string; id?: string; wideOnly?: boolean };

/** The corporate homepage keeps its own in-page anchors and adds the two
 *  consumer services after a divider, so partners still land on a
 *  partner page and holidaymakers can find their way out of it. */
const CORPORATE_LINKS: NavLink[] = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Fleet", href: "#fleet" },
  { label: "Türkiye", href: "#coverage" },
  { label: "About", href: "#people" },
];

const CONSUMER_LINKS: NavLink[] = [
  { label: NAV.transfersShort, href: "/transfers", id: "transfers" },
  { label: NAV.toursShort, href: "/tours", id: "tours" },
];

const TRAVEL_LINKS: NavLink[] = [
  ...CONSUMER_LINKS,
  { label: NAV.destinations, href: "/tours#destinations", id: "destinations" },
  { label: NAV.partners, href: "/", id: "partners" },
  // Hidden in the desktop bar between lg and xl, where the full set does
  // not fit; it is the footer anchor and stays in the mobile menu.
  { label: NAV.contact, href: "#contact", id: "contact", wideOnly: true },
];

export function Navigation({
  variant = "corporate",
  current,
  solid: forceSolid = false,
}: {
  variant?: "corporate" | "travel";
  /** id of the travel link for the page being shown. */
  current?: string;
  /** Start with the solid header, for pages without a dark hero. */
  solid?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const travel = variant === "travel";

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

  const solid = forceSolid || scrolled || open;
  const desktopLinks = travel ? TRAVEL_LINKS : CORPORATE_LINKS;

  const linkClass =
    "group relative whitespace-nowrap py-1 font-sans text-small uppercase tracking-[0.08em] transition-opacity duration-300 hover:opacity-80";
  const underline = (active: boolean) =>
    `absolute -bottom-0.5 left-0 h-px bg-swt-orange transition-all duration-300 ease-editorial group-hover:w-full ${
      active ? "w-full" : "w-0"
    }`;

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
      <div className="edge wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        {travel ? (
          <Link href="/" onClick={() => setOpen(false)} className="shrink-0" aria-label="SWT Elite home">
            <BrandMark height={118} priority className="h-[76px] w-auto lg:h-[118px]" />
          </Link>
        ) : (
          <a href="#top" onClick={() => setOpen(false)} className="shrink-0">
            <BrandMark height={118} priority className="h-[76px] w-auto lg:h-[118px]" />
          </a>
        )}

        <nav
          className="hidden items-center gap-5 lg:flex xl:gap-10"
          aria-label="Primary"
        >
          {desktopLinks.map((link) => {
            const active = travel && link.id === current;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`${linkClass} ${link.wideOnly ? "hidden xl:inline-block" : ""}`}
              >
                {link.label}
                <span className={underline(active)} />
              </Link>
            );
          })}
          {!travel && (
            <>
              <span aria-hidden="true" className="h-4 w-px bg-current opacity-30" />
              {CONSUMER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                  <span className={underline(false)} />
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="hidden items-center gap-5 lg:flex xl:gap-6">
          {travel && <LanguageMenu />}
          {travel ? (
            <Link href="/transfers#search" className="btn-action whitespace-nowrap px-4 py-3 xl:px-5">
              {NAV.cta}
            </Link>
          ) : (
            <EnquiryButton
              className={`whitespace-nowrap border px-5 py-3 font-sans text-small uppercase tracking-[0.1em] transition-colors duration-300 xl:px-6 ${
                solid
                  ? "border-ink/30 text-ink hover:border-ink"
                  : "border-ivory/40 text-ivory hover:border-ivory"
              }`}
            >
              Partner With Us
            </EnquiryButton>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
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
        className={`overflow-y-auto border-t border-graphite/15 bg-ivory text-ink transition-[max-height] duration-500 ease-editorial lg:hidden ${
          open ? "max-h-[calc(100svh-var(--header-h))]" : "max-h-0 border-t-0"
        }`}
      >
        <div className="edge flex flex-col gap-8 py-8">
          <MobileGroup
            title={NAV.travelGroup}
            links={travel ? TRAVEL_LINKS.slice(0, 3) : CONSUMER_LINKS}
            current={current}
            open={open}
            onNavigate={() => setOpen(false)}
            full
          />
          <MobileGroup
            title={NAV.companyGroup}
            links={travel ? TRAVEL_LINKS.slice(3) : CORPORATE_LINKS}
            current={current}
            open={open}
            onNavigate={() => setOpen(false)}
          />
          {travel ? (
            <div className="flex flex-col gap-6">
              <Link
                href="/transfers#search"
                tabIndex={open ? undefined : -1}
                className="btn-action w-full sm:w-fit"
                onClick={() => setOpen(false)}
              >
                {NAV.cta}
              </Link>
              <LanguageMenu tabIndex={open ? undefined : -1} align="left" />
            </div>
          ) : (
            /* Closes the menu before the drawer takes focus, so the
               collapsing panel cannot steal it back. */
            <EnquiryButton
              tabIndex={open ? undefined : -1}
              className="btn-primary w-fit"
              onActivate={() => setOpen(false)}
            >
              Partner With Us
            </EnquiryButton>
          )}
        </div>
      </nav>
    </header>
  );
}

function MobileGroup({
  title,
  links,
  current,
  open,
  onNavigate,
  full = false,
}: {
  title: string;
  links: NavLink[];
  current?: string;
  open: boolean;
  onNavigate: () => void;
  full?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              tabIndex={open ? undefined : -1}
              aria-current={link.id && link.id === current ? "page" : undefined}
              className={`font-sans text-body uppercase tracking-[0.08em] aria-[current=page]:underline aria-[current=page]:decoration-swt-orange aria-[current=page]:underline-offset-8`}
              onClick={onNavigate}
            >
              {full ? fullLabel(link) : link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Desktop space is tight enough that the bar uses short labels; the
 *  mobile menu has room for the full service names. */
function fullLabel(link: NavLink) {
  if (link.id === "transfers") return NAV.transfers;
  if (link.id === "tours") return NAV.tours;
  return link.label;
}
