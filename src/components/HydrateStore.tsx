"use client";

import { useEffect } from "react";
import { usePracticeStore } from "@/store/usePracticeStore";

export function HydrateStore() {
  const hydrate = usePracticeStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
