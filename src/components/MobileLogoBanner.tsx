"use client";

import React, { useEffect, useRef } from "react";

export default function MobileLogoBanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted and playsinline properties directly on the DOM element for mobile Safari/Chrome
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const startPlay = () => {
      if (video) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch((err) => {
            console.log("Mobile autoplay deferred until touch:", err);
          });
        }
      }
    };

    // Try playing immediately
    startPlay();

    // Bypass low-power mode autoplay restrictions on first user interaction (touch, scroll, tap)
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
    <div className="block md:hidden w-full bg-white border-b border-slate-200 py-6 px-4 text-center shadow-md">
      <video
        ref={videoRef}
        src="/logo-animation.mp4"
        poster="/logo-animation-still.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full max-w-[360px] h-auto max-h-[260px] object-contain mx-auto rounded-xl transform scale-105"
      />
    </div>
  );
}
