"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EnquiryDrawer } from "@/components/EnquiryDrawer";

type EnquiryContextValue = {
  isOpen: boolean;
  /** Pass the element that opened the drawer so focus can return to it
   *  exactly, rather than to whichever trigger happens to be first. */
  open: (trigger: HTMLElement | null) => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const value = useContext(EnquiryContext);
  if (!value) {
    throw new Error("useEnquiry must be used within <EnquiryProvider>");
  }
  return value;
}

/**
 * Holds the drawer's open state for the whole page.
 *
 * The four conversion CTAs sit in three different components, two of which
 * are server components, so the state cannot live in any one of them. This
 * keeps it in one place and renders a single drawer instance, which also
 * means there is only ever one dialog in the accessibility tree.
 */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Focus the originating control synchronously. This was deferred with
    // requestAnimationFrame, which is throttled or suspended entirely in a
    // document that is not rendering, so the callback could simply never
    // run and focus would be stranded inside a closed dialog. The trigger
    // is always mounted, so there is nothing to wait for.
    triggerRef.current?.focus();
  }, []);

  return (
    <EnquiryContext.Provider value={{ isOpen, open, close }}>
      {children}
      <EnquiryDrawer isOpen={isOpen} onClose={close} />
    </EnquiryContext.Provider>
  );
}
