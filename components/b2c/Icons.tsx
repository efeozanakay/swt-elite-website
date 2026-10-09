/** Hairline icon set for the travel pages. Stroke only, currentColor,
 *  matching the footer's map pin; the project has no icon dependency. */
type P = { className?: string; size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconCheck = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);
export const IconArrow = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 12h15M14 7l5 5-5 5" /></svg>
);
export const IconUsers = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><circle cx="17" cy="9.5" r="2.4" /><path d="M15.5 14.4c2.6-.3 4.6 1.3 5 4.1" /></svg>
);
export const IconCar = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 16v-4l2-5h11l3 5h2v4" /><path d="M3 12h18" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
);
export const IconBus = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="4" width="18" height="12" /><path d="M3 10h18M8 4v6M14 4v6" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
export const IconClock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const IconPin = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21c4.667-4.4 7-7.933 7-10.6a7 7 0 1 0-14 0C5 13.067 7.333 16.6 12 21Z" /><circle cx="12" cy="10.4" r="2.4" /></svg>
);
export const IconBag = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="5" y="7" width="14" height="13" /><path d="M9 7V4h6v3M9 20v1M15 20v1" /></svg>
);
export const IconSearch = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
);
export const IconPlane = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M10.5 21l1.5-6.5L5 12l.8-1.6 6.7 1.4L16 4.5c.6-1 1.7-1.3 2.4-.8.7.5.6 1.6-.1 2.5L13.9 12l2.6 6.4-1.4.8-3.4-4.9-1.2 6.7z" /></svg>
);
export const IconClose = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconInfo = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8v.01" /></svg>
);
