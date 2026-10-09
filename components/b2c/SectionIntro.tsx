import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

export function SectionIntro({
  eyebrow,
  title,
  body,
  id,
  aside,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  /** id for the heading, so the section can be aria-labelledby it. */
  id?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="max-w-2xl">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-swt-orange" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-display">
          {title}
        </h2>
        {body && <p className="mt-6 max-w-xl font-sans text-body-lg opacity-80">{body}</p>}
      </div>
      {aside}
    </Reveal>
  );
}
