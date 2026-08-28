"use client";

import { useRef, type ReactNode } from "react";
import { useEnquiry } from "@/components/EnquiryProvider";

/**
 * Opens the enquiry drawer and hands the provider its own DOM node, so
 * focus returns here and not to some other trigger when the drawer closes.
 *
 * A <button> rather than an <a>: it performs an in-page action and goes
 * nowhere, so it should not be announced as a link or offer "open in new
 * tab". The visual classes are passed in unchanged, which is what lets
 * these replace the previous anchors without altering any styling.
 */
export function EnquiryButton({
  className = "",
  children,
  tabIndex,
  onActivate,
}: {
  className?: string;
  children: ReactNode;
  tabIndex?: number;
  /** Lets a caller run its own side effect too, e.g. the mobile menu
   *  closing itself before the drawer takes focus. */
  onActivate?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { open } = useEnquiry();

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      className={className}
      onClick={() => {
        onActivate?.();
        open(ref.current);
      }}
    >
      {children}
    </button>
  );
}
