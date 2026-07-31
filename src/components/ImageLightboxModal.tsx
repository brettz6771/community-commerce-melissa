"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  title
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] bg-[#0B0E14] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#151922]">
          <div className="text-xs sm:text-sm font-bold font-outfit uppercase tracking-wider text-slate-200 truncate">
            {title || imageAlt || "Event Image Preview"}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-red-700 text-slate-300 hover:text-white transition-colors"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full Image Display */}
        <div className="relative w-full flex-1 flex items-center justify-center p-3 overflow-hidden bg-black/40">
          <img
            src={imageSrc}
            alt={imageAlt || "Full preview"}
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
