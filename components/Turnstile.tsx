"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
    onTurnstileReady?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile, rendered explicitly rather than by auto-scanning
 * the page, so the script is only requested when the drawer is actually
 * opened rather than on every page load.
 *
 * Managed mode: invisible for almost every visitor, and only escalates to
 * an interaction for traffic Cloudflare finds suspicious. That is why
 * there is no visible checkbox here and nothing in the layout reserves
 * space for one.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is absent the component renders
 * nothing and reports no token. The server decides what to do about a
 * missing token; the form is never blocked client-side by a
 * misconfiguration the visitor cannot fix.
 */
export function Turnstile({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(host, {
        sitekey: SITE_KEY,
        // Managed decides for itself whether to show anything at all.
        appearance: "interaction-only",
        theme: "dark",
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
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
}

export const turnstileConfigured = Boolean(SITE_KEY);
