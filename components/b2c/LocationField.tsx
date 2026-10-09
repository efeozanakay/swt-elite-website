"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  LOCATIONS,
  locationById,
  locationLabel,
  normalise,
  type TransferLocation,
} from "@/lib/b2c/demo/locations";
import { SEARCH } from "@/lib/b2c/copy";

/**
 * Location picker built on the ARIA 1.2 combobox pattern: the input keeps
 * focus while the arrow keys move a virtual cursor through the listbox,
 * announced via aria-activedescendant.
 *
 * Only places in the list can be chosen. Free text that matches nothing
 * leaves the value empty, and validation says so, rather than sending an
 * unknown place to the results page.
 */
export function LocationField({
  label,
  placeholder,
  value,
  onChange,
  other,
  error,
  inputRef,
  className = "",
  cellClassName = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (id: string) => void;
  /** The opposite end of the journey, used to order suggestions. */
  other: TransferLocation | null;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
  cellClassName?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const selected = locationById(value);
  const [query, setQuery] = useState(selected ? locationLabel(selected) : "");
  const [open, setOpen] = useState(false);
  // -1 until the visitor moves with the arrow keys; Enter then takes the
  // first match, so "bel" + Enter selects Belek.
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  // Set when typing clears the value, so the sync below does not wipe the
  // text the visitor is in the middle of typing.
  const clearedByTyping = useRef(false);

  // Keep the visible text in step when the value changes from outside:
  // the swap button, a destination shortcut, or a search being restored.
  useEffect(() => {
    if (!selected && clearedByTyping.current) {
      clearedByTyping.current = false;
      return;
    }
    setQuery(selected ? locationLabel(selected) : "");
  }, [selected]);

  const options = useMemo(() => {
    const q = normalise(query.trim());
    const showAll = !q || (selected && query === locationLabel(selected));
    let list = showAll
      ? LOCATIONS
      : LOCATIONS.filter((l) =>
          [l.name, l.code ?? "", l.region].some((f) => normalise(f).includes(q))
        );
    // With the other end chosen, the useful suggestions are the other
    // kind of place in the same region: resorts near an airport, or the
    // airport that serves a resort.
    if (other) {
      const score = (l: TransferLocation) =>
        (l.region === other.region ? 0 : 2) + (l.kind !== other.kind ? 0 : 1);
      list = [...list].sort((a, b) => score(a) - score(b));
    }
    list = list.filter((l) => l.id !== other?.id);
    const airports = list.filter((l) => l.kind === "airport");
    const areas = list.filter((l) => l.kind === "area");
    // Group order follows what is most likely wanted next.
    return other?.kind === "airport" ? [...areas, ...airports] : [...airports, ...areas];
  }, [query, other, selected]);

  useEffect(() => setActive(-1), [query, open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open || active < 0) return;
    document
      .getElementById(`${id}-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);

  const choose = (l: TransferLocation) => {
    onChange(l.id);
    setQuery(locationLabel(l));
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open) {
      const pick = options[active >= 0 ? active : 0];
      if (pick) {
        e.preventDefault();
        choose(pick);
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  let lastKind: string | null = null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className={`sf-cell ${cellClassName}`} data-invalid={error ? "true" : undefined}>
        <label htmlFor={id} className="sf-label">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="mt-1 shrink-0 text-graphite">
            {selected?.kind === "airport" ? (
              <path d="M10.5 21l1.5-6.5L5 12l.8-1.6 6.7 1.4L16 4.5c.6-1 1.7-1.3 2.4-.8.7.5.6 1.6-.1 2.5L13.9 12l2.6 6.4-1.4.8-3.4-4.9-1.2 6.7z" />
            ) : (
              <>
                <path d="M12 21c4.667-4.4 7-7.933 7-10.6a7 7 0 1 0-14 0C5 13.067 7.333 16.6 12 21Z" />
                <circle cx="12" cy="10.4" r="2.4" />
              </>
            )}
          </svg>
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open && options[active] ? `${id}-opt-${active}` : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (value) {
                clearedByTyping.current = true;
                onChange("");
              }
            }}
            onFocus={(e) => {
              e.currentTarget.select();
              setOpen(true);
            }}
            onClick={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="sf-input"
          />
        </div>
      </div>
      {error && (
        <p id={errorId} className="sf-error">
          {error}
        </p>
      )}

      <div
        className={`absolute left-0 top-full z-30 mt-1 w-full min-w-[18rem] border border-graphite/25 bg-ivory shadow-[0_24px_48px_-24px_rgba(21,19,15,0.5)] ${
          open ? "" : "hidden"
        }`}
      >
        <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto py-1">
          {options.length === 0 && (
            <li className="px-4 py-3 font-sans text-small text-graphite" role="presentation">
              {SEARCH.noMatches}
            </li>
          )}
          {options.map((l, i) => {
            const header = l.kind !== lastKind;
            lastKind = l.kind;
            return (
              <li key={l.id} role="presentation">
                {header && (
                  <div role="presentation" className="px-4 pb-1.5 pt-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-graphite">
                    {l.kind === "airport" ? SEARCH.airportGroup : SEARCH.areaGroup}
                  </div>
                )}
                <div
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={l.id === value}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(l)}
                  onMouseMove={() => setActive(i)}
                  className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2.5 font-sans text-body ${
                    i === active ? "bg-bone" : ""
                  }`}
                >
                  <span className="text-ink">
                    {l.name}
                    {l.code && <span className="ml-2 text-small text-graphite">{l.code}</span>}
                  </span>
                  <span className="shrink-0 text-small text-graphite">{l.region}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-graphite/15 px-4 py-2.5 font-sans text-[0.8125rem] leading-snug text-graphite">
          {SEARCH.hotelHint}
        </p>
      </div>
    </div>
  );
}
