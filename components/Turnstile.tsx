"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type TurnstileHandle = {
  /** Discard the current token and re-run the challenge for a new one. */
  reset: () => void;
};

/**
 * Cloudflare Turnstile, rendered explicitly rather than by auto-scanning
 * the page, so the script is only requested when the drawer is actually
 * opened rather than on every page load.
 *
 * Managed mode with interaction-only appearance: nothing is drawn for
 * almost every visitor, and the container collapses when empty so the
 * form gains no gap where a widget would otherwise sit.
 *
 * Token lifecycle matters here. A Turnstile token is single use and
 * expires after roughly 300 seconds, so the widget has to be re-run
 * rather than read once and remembered. `reset` is exposed for the form
 * to call after every submission, and the expiry and timeout callbacks
 * re-run the challenge on their own so a drawer left open overnight still
 * has a live token when the visitor finally submits.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is absent this renders nothing and
 * reports no token. The server decides what to do about that; the form is
 * never blocked client-side by a misconfiguration the visitor cannot fix.
 */
export const Turnstile = forwardRef<
  TurnstileHandle,
  { onToken: (token: string | null) => void }
>(function Turnstile({ onToken }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  /** Re-runs the challenge. Turnstile fires `callback` again with a new
   *  token, which is what keeps consecutive submissions distinct. */
  const resetWidget = useRef(() => {
    onTokenRef.current(null);
    if (widgetRef.current && window.turnstile) {
      window.turnstile.reset(widgetRef.current);
    }
  });

  useImperativeHandle(ref, () => ({ reset: () => resetWidget.current() }), []);

  useEffect(() => {
    if (!SITE_KEY) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(host, {
        sitekey: SITE_KEY,
        appearance: "interaction-only",
        theme: "dark",
        // Let Turnstile retry transient network failures itself rather
        // than driving that from here, which risks a tight loop against
        // a challenge that is failing for a persistent reason.
        retry: "auto",
        callback: (token: string) => onTokenRef.current(token),
        // A token that expires or times out is worthless, so drop it and
        // immediately ask for another. Without this the form silently
        // becomes unsubmittable about five minutes after it is opened.
        "expired-callback": () => resetWidget.current(),
        "timeout-callback": () => resetWidget.current(),
        // Do not re-run on error: `retry: auto` already handles that, and
        // resetting here as well would compound into a loop.
        "error-callback": () => onTokenRef.current(null),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render, { once: true });
    }

    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
      }
      widgetRef.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;

  // Managed mode usually renders nothing, so this must not reserve space
  // or add a gap to the form when it is empty.
  return <div ref={hostRef} className="empty:hidden" />;
});

export const turnstileConfigured = Boolean(SITE_KEY);
