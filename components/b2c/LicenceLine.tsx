import { LICENCE } from "@/lib/b2c/business";

/**
 * TÜRSAB licence statement, as approved. Plain text and a link to TÜRSAB
 * itself: no badge or seal is drawn, because an imitation of an official
 * mark would misrepresent it.
 */
export function LicenceLine({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-ivory/70" : "text-graphite";
  return (
    <p className={`font-sans text-small ${muted} ${className}`}>
      <span className={tone === "dark" ? "text-ivory" : "text-ink"}>{LICENCE.agencyName}</span>
      <span aria-hidden="true"> · </span>
      {LICENCE.line}
      <span aria-hidden="true"> · </span>
      <a
        href={LICENCE.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 transition-colors hover:text-current"
      >
        {LICENCE.verifyLabel}
        <span className="sr-only"> (opens the TÜRSAB website in a new tab)</span>
      </a>
    </p>
  );
}
