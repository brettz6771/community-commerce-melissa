"use client";

import { useEffect, useRef } from "react";

const HERO_VIDEO_SRC = "https://ccm.t3.tigrisfiles.io/hero-banner-vfinal.mp4";

export default function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const startPlay = () => {
      const playAttempt = video.play();
      if (playAttempt !== undefined) {
        playAttempt.catch(() => {
          // Browsers may defer autoplay until a user gesture.
        });
      }
    };

    startPlay();

    const handleUserInteraction = () => {
      startPlay();
    };

    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("pointerdown", handleUserInteraction);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0E14]" aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-networking.jpg"
        className="h-full w-full object-cover opacity-75 scale-105"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
