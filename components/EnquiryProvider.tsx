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
    // After the drawer unmounts, put focus back on the exact control that
    // opened it. Deferred a frame so the element is focusable again and
    // the browser does not scroll to a still-hidden target.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <EnquiryContext.Provider value={{ isOpen, open, close }}>
      {children}
      <EnquiryDrawer isOpen={isOpen} onClose={close} />
    </EnquiryContext.Provider>
  );
}
