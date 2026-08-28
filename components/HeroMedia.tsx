"use client";

import { useEffect, useRef, useState } from "react";
import manifest from "@/public/images/opt/manifest.json";

const STILL = (manifest as unknown as Record<string, {
  slug: string;
  sourceWidth: number;
  sourceHeight: number;
  files: { avif: { w: number }[]; webp: { w: number }[]; jpg: { w: number }[] };
}>)["/images/swt-elite-hero-airport-vito.png"];

const srcSet = (variants: { w: number }[], ext: string) =>
  variants.map((v) => `/images/opt/${STILL.slug}-${v.w}.${ext} ${v.w}w`).join(", ");

/**
 * The hero background film, and the still underneath it.
 *
 * The still is a real responsive <picture> rather than the video's
 * `poster` attribute. A poster takes a single URL, so it cannot carry a
 * srcset or negotiate a format, and the previous one was a 2MB PNG
 * shipped to every device including phones. As the largest contentful
 * paint candidate that was the single most expensive thing on the page.
 * It is server-rendered, eager and high priority; the film is layered
 * over it and only becomes visible once it has frames to show.
 *
 * Two accessibility obligations shape the film itself.
 *
 * The loop runs 20 seconds, so WCAG 2.2.2 requires a way to stop it. The
 * control is a plain uppercase micro-label in the corner, in the same
 * register as the eyebrows, rather than an icon button: the site has no
 * icon vocabulary and no rounded controls to borrow from.
 *
 * The film also must not start under prefers-reduced-motion. The original
 * implementation set the autoplay attribute and carried a note saying
 * reduced-motion handling had been dropped, so it played regardless. The
 * <video> is now mounted only once motion is known to be allowed, which
 * means a reduced-motion visitor never sees a frame of movement and never
 * spends a byte on the 3.4MB file either.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [filmVisible, setFilmVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setMotionAllowed(!mq.matches);
      if (mq.matches) {
        videoRef.current?.pause();
        setPlaying(false);
        setFilmVisible(false);
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
        <picture>
          <source type="image/avif" srcSet={srcSet(STILL.files.avif, "avif")} sizes="100vw" />
          <source type="image/webp" srcSet={srcSet(STILL.files.webp, "webp")} sizes="100vw" />
          <img
            src={`/images/opt/${STILL.slug}-1280.jpg`}
            srcSet={srcSet(STILL.files.jpg, "jpg")}
            sizes="100vw"
            alt=""
            width={STILL.sourceWidth}
            height={STILL.sourceHeight}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[78%_38%]"
          />
        </picture>

        {motionAllowed && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => {
              const v = videoRef.current;
              if (!v) return;
              v.play().then(
                () => {
                  setPlaying(true);
                  setFilmVisible(true);
                },
                () => setPlaying(false)
              );
            }}
            className={`absolute inset-0 h-full w-full object-cover object-[78%_38%] transition-opacity duration-700 ease-editorial ${
              filmVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/swt-hero-final.webm" type="video/webm" />
            <source src="/videos/swt-hero-final.mp4" type="video/mp4" />
          </video>
        )}

        {/* Readability treatment, left side only, so the photograph is
            never globally darkened or flattened. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/10 to-transparent" />

        {/* Foot of the frame. Strong on mobile, where the content block
            sits over it; light on desktop, where it exists only so the
            playback control in the corner keeps a stable ground as the
            film changes underneath it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent lg:from-charcoal/40" />
      </div>

      {/* Hidden while reduced motion is in effect: nothing is playing to
          stop, and a control that does nothing is worse than none. */}
      {motionAllowed && (
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
