"use client";

import { useEffect, useRef, useState } from "react";

const YOUTUBE_VIDEO_ID = "un7p_KUez04";
const CLIP_START_SECONDS = 34;
const CLIP_END_SECONDS = 44;
const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";

type YouTubePlayer = {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeApi() {
  if (document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = YOUTUBE_API_SRC;
  script.async = true;
  document.body.appendChild(script);
}

export default function HeroBackgroundVideo() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const watchRef = useRef<number | null>(null);
  const [isClipPlaying, setIsClipPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    const interactionListeners: Array<["click" | "touchstart", () => void]> = [];

    const stopWatch = () => {
      if (watchRef.current != null) {
        window.clearInterval(watchRef.current);
        watchRef.current = null;
      }
    };

    const keepClipInRange = (player: YouTubePlayer) => {
      try {
        const currentTime = player.getCurrentTime();
        if (Number.isNaN(currentTime)) {
          return;
        }

        if (currentTime < CLIP_START_SECONDS - 0.2 || currentTime >= CLIP_END_SECONDS - 0.12) {
          player.seekTo(CLIP_START_SECONDS, true);
          player.playVideo();
          return;
        }

        setIsClipPlaying(true);
      } catch {
        // Player can throw while the iframe is still initializing.
      }
    };

    const startWatch = (player: YouTubePlayer) => {
      if (watchRef.current != null) {
        return;
      }

      watchRef.current = window.setInterval(() => {
        keepClipInRange(player);
      }, 120);
    };

    const createPlayer = () => {
      if (cancelled || !mountRef.current || !window.YT?.Player || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          cc_load_policy: 0,
          enablejsapi: 1,
          start: CLIP_START_SECONDS,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.seekTo(CLIP_START_SECONDS, true);
            event.target.playVideo();
            startWatch(event.target);

            const resumePlayback = () => {
              event.target.mute();
              event.target.seekTo(CLIP_START_SECONDS, true);
              event.target.playVideo();
            };

            document.addEventListener("click", resumePlayback, { once: true });
            document.addEventListener("touchstart", resumePlayback, { once: true });
            interactionListeners.push(["click", resumePlayback], ["touchstart", resumePlayback]);
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              event.target.seekTo(CLIP_START_SECONDS, true);
              event.target.playVideo();
            }

            if (event.data === window.YT?.PlayerState.PLAYING) {
              startWatch(event.target);
              keepClipInRange(event.target);
            }
          },
        },
      });
    };

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      createPlayer();
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      loadYouTubeIframeApi();
    }

    return () => {
      cancelled = true;
      stopWatch();
      interactionListeners.forEach(([type, listener]) => {
        document.removeEventListener(type, listener);
      });
      window.onYouTubeIframeAPIReady = previousReadyHandler;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 ${
          isClipPlaying ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "177.78vh",
          height: "56.25vw",
          minWidth: "100%",
          minHeight: "100%",
          transform: "translate(-50%, -50%) scale(1.45)",
        }}
      >
        <div ref={mountRef} className="h-full w-full" />
      </div>
      <img
        src="/hero-networking.jpg"
        alt=""
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
          isClipPlaying ? "opacity-0" : "opacity-80"
        }`}
      />
    </div>
  );
}
