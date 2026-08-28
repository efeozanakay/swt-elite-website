"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero background film.
 *
 * Playback is declarative and has no JavaScript dependency. The <video>
 * carries autoplay/muted/loop/playsinline and ships inside the
 * server-rendered HTML, so the film starts from markup alone. An earlier
 * pass moved it behind client state, dropped the autoplay attribute and
 * started playback from an onCanPlay handler; that made the animation
 * contingent on React hydrating, a media query resolving, an event firing
 * and a promise settling, and it stopped playing. Nothing here may
 * reintroduce that chain.
 *
 * prefers-reduced-motion is deliberately NOT consulted. The film is part
 * of the intended design for this site, and the decision on record is
 * that it plays for everyone. WCAG 2.2.2 is met by the Pause control
 * rather than by suppressing the film, which is a legitimate reading of
 * the criterion: it asks for a mechanism to stop moving content, not for
 * the content to be withheld. Reveal and scroll animations elsewhere on
 * the site still respect the preference through the global rule in
 * globals.css; this is a targeted exception, not a blanket one.
 *
 * The still is the poster attribute, pointing at the original lossless
 * asset, exactly as approved.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Mirrors the element's own state rather than driving it. Starts true
  // because the element autoplays; the listeners below keep the label
  // honest if the browser refuses or the visitor intervenes.
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => setPlaying(!v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    sync();
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/swt-elite-hero-airport-vito.png"
          className="absolute inset-0 h-full w-full object-cover object-[78%_38%]"
        >
          <source src="/videos/swt-hero-final.webm" type="video/webm" />
          <source src="/videos/swt-hero-final.mp4" type="video/mp4" />
        </video>

        {/* Readability treatment, left side only, so the photograph is
            never globally darkened or flattened. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/10 to-transparent" />

        {/* Foot of the frame. Strong on mobile, where the content block
            sits over it; light on desktop, where it exists so the
            playback control keeps a stable ground as the film changes
            underneath it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent lg:from-charcoal/40" />
      </div>

      {/* The WCAG 2.2.2 mechanism for a loop longer than five seconds. A
          plain uppercase micro-label in the eyebrow register: the site has
          no icon vocabulary and no rounded controls to borrow from. */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="absolute bottom-7 right-6 z-20 font-sans text-eyebrow uppercase tracking-[0.2em] text-ivory/80 transition-colors duration-300 hover:text-ivory sm:right-10 lg:bottom-9 lg:right-16 xl:right-24"
      >
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> background film</span>
      </button>
    </>
  );
}
