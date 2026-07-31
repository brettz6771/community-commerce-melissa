"use client";

import React, { useState } from "react";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { 
  Calendar, 
  Search, 
  Users, 
  Award, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  UserPlus,
  Handshake,
  Building2,
  Clock,
  MapPin,
  ZoomIn
} from "lucide-react";
import Link from "next/link";
import { MOCK_EVENTS, MOCK_BUSINESSES } from "@/data/mockData";

interface HomeCardsGridProps {
  onOpenJoinModal?: () => void;
  onOpenRSVPModal?: (eventTitle: string) => void;
  onOpenSponsorModal?: () => void;
}

export default function HomeCardsGrid({
  onOpenJoinModal,
  onOpenRSVPModal,
  onOpenSponsorModal
}: HomeCardsGridProps) {
  // Hidden for now until ready
  return null;
}
  );
}
