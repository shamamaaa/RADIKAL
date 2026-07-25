"use client";

import { useCallback, useRef, useState } from "react";
import {
  getSavedPlayerName,
  savePlayerName,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from "@/lib/scores";

export function usePlayerName() {
  const [name, setName] = useState(() => getSavedPlayerName());
  const [promptOpen, setPromptOpen] = useState(false);
  const resolveRef = useRef<((name: string) => void) | null>(null);

  const ensureName = useCallback((): Promise<string> => {
    const existing = getSavedPlayerName();
    if (existing) {
      setName(existing);
      return Promise.resolve(existing);
    }
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setPromptOpen(true);
    });
  }, []);

  const confirmName = useCallback((value: string) => {
    const trimmed = value.trim().slice(0, NAME_MAX_LENGTH);
    if (trimmed.length < NAME_MIN_LENGTH) return;
    savePlayerName(trimmed);
    setName(trimmed);
    setPromptOpen(false);
    resolveRef.current?.(trimmed);
    resolveRef.current = null;
  }, []);

  return { name, promptOpen, ensureName, confirmName };
}
