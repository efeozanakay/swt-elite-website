"use client";

import { useEffect, useRef, useState } from "react";

const POSTER = "/images/swt-elite-hero-airport-vito.png";

/**
 * The hero background film.
 *
 * Two accessibility obligations shape this component.
 *
 * The loop runs 20 seconds, so WCAG 2.2.2 requires a way to stop it. The
 * control is a plain uppercase micro-label in the corner, in the same
 * register as the eyebrows, rather than an icon button: the site has no
 * icon vocabulary and no rounded controls to borrow from.
 *
 * The film also must not start at all under prefers-reduced-motion. The
 * previous implementation set the autoplay attribute and left a note
 * saying reduced-motion handling had been dropped, so the film played
 * regardless of the setting. Autoplay is therefore not declared on the
 * element; playback is started from the effect only when motion is
 * allowed, which also means a reduced-motion visitor never sees a frame
 * of movement rather than seeing it start and then stop. The poster is
 * the same still either way, so there is no layout or art-direction
 * difference between the two paths.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const v = videoRef.current;
      setReduced(mq.matches);
      if (!v) return;
      if (mq.matches) {
        v.pause();
        setPlaying(false);
      } else {
        // play() rejects when the browser blocks autoplay; the poster is
        // already the visible frame, so failing here is not a problem.
        v.play().then(
          () => setPlaying(true),
          () => setPlaying(false)
        );
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          className="absolute inset-0 h-full w-full object-cover object-[78%_38%]"
        >
          <source src="/videos/swt-hero-final.webm" type="video/webm" />
          <source src="/videos/swt-hero-final.mp4" type="video/mp4" />
        </video>

        {/* Readability treatment, left side only, so the photograph is
            never globally darkened or flattened. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/10 to-transparent" />

        {/* Foot of the frame. Strong on mobile, where the content block
            sits over it; light on desktop, where it exists only so the
            playback control in the corner keeps a stable ground as the
            film changes underneath it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent lg:from-charcoal/40" />
      </div>

      {/* Hidden while reduced motion is in effect: there is nothing
          playing to stop, and offering a control that does nothing is
          worse than offering none. */}
      {!reduced && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!playing}
          className="absolute bottom-7 right-6 z-20 font-sans text-eyebrow uppercase tracking-[0.2em] text-ivory/80 transition-colors duration-300 hover:text-ivory sm:right-10 lg:bottom-9 lg:right-16 xl:right-24"
        >
          {playing ? "Pause" : "Play"}
          <span className="sr-only"> background film</span>
        </button>
      )}
    </>
  );
}
