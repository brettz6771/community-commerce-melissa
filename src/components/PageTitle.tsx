"use client";

import { useEffect } from "react";

export default function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | Community Commerce Melissa`;
  }, [title]);

  return null;
}
