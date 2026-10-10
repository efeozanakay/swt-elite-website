"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { IconArrow, IconInfo } from "@/components/b2c/Icons";
import { SERVICES } from "@/lib/b2c/copy";
import { COMPLETE } from "@/lib/b2c/copy-booking";
import { PAYMENT_METHOD } from "@/lib/b2c/booking/status-copy";
import type { BookingRequest } from "@/lib/b2c/booking/types";

/**
 * The end of the preview journey. It must not read as a confirmation:
 * no reference, no "booked", no "paid". It says what a real booking
 * would produce next and links to the My Transfer demo.
 */
export function PreviewComplete({
  request,
  onBack,
  onRestart,
}: {
  request: BookingRequest;
  onBack: () => void;
  onRestart: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section aria-labelledby="complete-title" className="bg-ivory py-10 text-ink sm:py-14">
      <div className="edge wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">{COMPLETE.eyebrow}</p>
          <h2 id="complete-title" ref={headingRef} tabIndex={-1} className="font-display text-display focus:outline-none">
            {COMPLETE.title}
          </h2>
          <div role="status" className="mt-5 flex gap-3 border-l-2 border-[#9A3A12] bg-bone/70 p-4 font-sans text-body text-ink">
            <IconInfo size={20} className="mt-1 shrink-0" />
            <p>{COMPLETE.body}</p>
          </div>
          <h3 className="mt-8 font-display text-[1.375rem]">{COMPLETE.next}</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-sans text-body text-graphite">
            {COMPLETE.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-6 font-sans text-small text-graphite">{COMPLETE.contact}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/my-transfer" className="btn-action">
              {COMPLETE.myTransfer}
              <IconArrow size={16} />
            </Link>
            <button type="button" onClick={onBack} className="btn-outline">
              {COMPLETE.edit}
            </button>
            <button type="button" onClick={onRestart} className="btn-outline">
              {COMPLETE.restart}
            </button>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="border border-graphite/20 bg-white/60 p-6">
            <p className="eyebrow text-ink">Your preview selection</p>
            <dl className="mt-4 divide-y divide-graphite/15 font-sans text-small">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-graphite">Service</dt>
                <dd className="text-right">{SERVICES[request.service].name}</dd>
              </div>
              {request.legs.map((l) => (
                <div key={l.id} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-graphite">{l.id === "out" ? "Journey" : "Return"}</dt>
                  <dd className="text-right">{l.from.name} → {l.to.name}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-graphite">Payment method</dt>
                <dd className="text-right">{request.paymentMethod ? PAYMENT_METHOD[request.paymentMethod] : "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-graphite">Status</dt>
                <dd className="text-right">Not booked · Not paid</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
