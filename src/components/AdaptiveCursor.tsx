"use client";

import { useEffect } from "react";

export default function AdaptiveCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Buffer distance from viewport edges to switch back to standard mouse pointer
    const RIGHT_EDGE_THRESHOLD = 36; // Covers standard scrollbar (8px-17px) + proximity buffer
    const BOTTOM_EDGE_THRESHOLD = 24;

    const handleMouseMove = (e: MouseEvent) => {
      const distanceToRight = window.innerWidth - e.clientX;
      const distanceToBottom = window.innerHeight - e.clientY;

      const isNearScrollbar =
        distanceToRight <= RIGHT_EDGE_THRESHOLD ||
        distanceToBottom <= BOTTOM_EDGE_THRESHOLD;

      if (isNearScrollbar) {
        document.documentElement.classList.add("near-scrollbar");
      } else {
        document.documentElement.classList.remove("near-scrollbar");
      }
    };

    const handleMouseLeave = () => {
      document.documentElement.classList.remove("near-scrollbar");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.classList.remove("near-scrollbar");
    };
  }, []);

  return null;
}
