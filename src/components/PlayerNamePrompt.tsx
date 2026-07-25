"use client";

import { FormEvent, useState } from "react";
import Button from "./ui/Button";
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH } from "@/lib/scores";

export default function PlayerNamePrompt({
  open,
  accentColor = "var(--color-ibrahim)",
  onConfirm,
}: {
  open: boolean;
  accentColor?: string;
  onConfirm: (name: string) => void;
}) {
  const [value, setValue] = useState("");

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim().length < NAME_MIN_LENGTH) return;
    onConfirm(value);
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/95 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[260px] flex-col items-center gap-4 text-center"
      >
        <p className="font-display text-lg font-semibold text-ink">
          Skor tablosunda görünmek için adını yaz
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Adın"
          minLength={NAME_MIN_LENGTH}
          maxLength={NAME_MAX_LENGTH}
          required
          className="w-full rounded-full border border-line px-4 py-2.5 text-center text-sm text-ink outline-none focus:border-ink/30"
        />
        <Button type="submit" accentColor={accentColor} className="w-full">
          Devam et
        </Button>
      </form>
    </div>
  );
}
