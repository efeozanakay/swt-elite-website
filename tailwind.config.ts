import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F5F0E4",
        bone: "#EAE2D0",
        stone: "#C7BEA7",
        graphite: "#4A4638",
        charcoal: "#15130F",
        ink: "#1D1B15",
        // Placeholder brand values only — replace with exact hex from the
        // official SWT Elite brand guideline once supplied. Micro-accent
        // use only (see brand/SWT-DESIGN-BIBLE.md): never a background fill.
        "swt-orange": "#D2601F",
        "swt-blue": "#1F3A5C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        hero: [
          "clamp(2.75rem, 2rem + 3.5vw, 6.25rem)",
          { lineHeight: "1.04", letterSpacing: "-0.01em" },
        ],
        // Sub-sm counterpart to `hero`. The hero headline carries a hard
        // line break, and below 640px `hero` renders each half too wide
        // for the measure, so both halves wrap again and the headline
        // breaks into four lines with two orphans. This curve keeps each
        // half on one line from 320px up, and its 3.4rem ceiling is the
        // exact value `hero` resolves to at 640px, so the two meet
        // continuously at the sm breakpoint.
        "hero-sm": [
          "clamp(1.9rem, 9.3vw, 3.4rem)",
          { lineHeight: "1.04", letterSpacing: "-0.01em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 1.65rem + 2.75vw, 4.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.01em" },
        ],
        display: [
          "clamp(1.875rem, 1.5rem + 1.6vw, 3.25rem)",
          { lineHeight: "1.12" },
        ],
        "display-sm": [
          "clamp(1.5rem, 1.3rem + 0.9vw, 2.25rem)",
          { lineHeight: "1.18" },
        ],
        stat: [
          "clamp(3.5rem, 2.25rem + 5.75vw, 8rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.2em" }],
        "body-lg": ["1.1875rem", { lineHeight: "1.6" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      maxWidth: {
        canvas: "1440px",
        measure: "38rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
