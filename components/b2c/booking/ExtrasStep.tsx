"use client";

import { useId } from "react";
import { IconInfo } from "@/components/b2c/Icons";
import { Group, Notice, TextArea } from "@/components/b2c/booking/Fields";
import { EQUIPMENT_NOTE, EQUIPMENT_OPTIONS } from "@/lib/b2c/business";
import { FLOW } from "@/lib/b2c/copy-booking";
import { NOTES_MAX, type BookingDraft, type FieldErrors } from "@/lib/b2c/booking/draft";
import type { EquipmentId } from "@/lib/b2c/booking/types";
import type { TransferSearch } from "@/lib/b2c/transfer-search";

/** Step 2. Child seats, special equipment and notes, as in the former
 *  booking-details form, now a step of their own. */
export function ExtrasStep({
  search,
  draft,
  errors,
  onChange,
  registerField,
}: {
  search: TransferSearch;
  draft: BookingDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<BookingDraft>) => void;
  registerField: (key: string) => (el: HTMLElement | null) => void;
}) {
  const id = useId();
  const toggle = (e: EquipmentId) =>
    onChange({ equipment: draft.equipment.includes(e) ? draft.equipment.filter((x) => x !== e) : [...draft.equipment, e] });

  return (
    <div className="space-y-10">
      <Group title={FLOW.extras.seats} hint={FLOW.extras.seatsHint}>
        {search.children > 0 ? (
          <div className="flex items-center justify-between gap-4 border border-graphite/20 bg-white/60 p-4">
            <p className="font-sans text-small text-ink" id={`${id}-seats`}>
              Child seats requested
              <span className="block text-[0.8125rem] text-graphite">
                {search.children} {search.children === 1 ? "child" : "children"} travelling
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="One fewer child seat"
                disabled={draft.childSeats <= 0}
                onClick={() => onChange({ childSeats: draft.childSeats - 1 })}
                className="flex h-11 w-11 items-center justify-center border border-graphite/30 bg-ivory hover:border-ink disabled:opacity-35"
              >
                −
              </button>
              <output aria-labelledby={`${id}-seats`} aria-live="polite" className="w-6 text-center font-sans text-body tabular-nums">
                {draft.childSeats}
              </output>
              <button
                type="button"
                aria-label="One more child seat"
                disabled={draft.childSeats >= search.children}
                onClick={() => onChange({ childSeats: draft.childSeats + 1 })}
                className="flex h-11 w-11 items-center justify-center border border-graphite/30 bg-ivory hover:border-ink disabled:opacity-35"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <p className="font-sans text-small text-graphite">{FLOW.extras.seatsNone}</p>
        )}
        {errors.childSeats && <p className="sf-error">{errors.childSeats}</p>}
      </Group>

      <Group title={FLOW.extras.declare} hint={FLOW.extras.declareHint}>
        <div className="grid gap-2 sm:grid-cols-3">
          {EQUIPMENT_OPTIONS.map((o) => {
            const on = draft.equipment.includes(o.id);
            return (
              <label
                key={o.id}
                className={`flex min-h-[3.5rem] cursor-pointer items-center gap-3 border px-4 py-3 font-sans text-small transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                  on ? "border-ink bg-ink text-ivory" : "border-graphite/25 bg-white/60 text-ink hover:border-ink"
                }`}
              >
                <input type="checkbox" className="h-4 w-4 accent-[#FAA529]" checked={on} onChange={() => toggle(o.id)} />
                {o.label}
              </label>
            );
          })}
        </div>
        <p className="mt-3 font-sans text-[0.8125rem] text-graphite">{EQUIPMENT_NOTE}</p>
        {draft.equipment.includes("wheelchair") && (
          <div className="mt-3">
            <Notice icon={<IconInfo size={18} className="mt-0.5 shrink-0" />}>{FLOW.extras.wheelchairNote}</Notice>
          </div>
        )}
      </Group>

      <Group title={FLOW.extras.notes}>
        <TextArea
          id={`${id}-notes`}
          label="Notes for our operations team"
          hint={FLOW.extras.notesHint}
          value={draft.notes}
          onChange={(notes) => onChange({ notes })}
          error={errors.notes}
          max={NOTES_MAX}
          ref={registerField("notes")}
        />
      </Group>
    </div>
  );
}
