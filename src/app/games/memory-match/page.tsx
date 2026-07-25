"use client";

import { useState } from "react";
import Link from "next/link";
import MemoryGame from "@/components/games/MemoryGame";
import Leaderboard from "@/components/Leaderboard";

const ACCENT = "var(--color-ibrahim)";

export default function MemoryMatchPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <Link href="/#games" className="text-sm font-medium text-ink/50 hover:text-ink">
          ← Oyunlara dön
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Hafıza Oyunu
        </h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Kartları çevir, eşlerini bul. Ne kadar az hamlede ve hızlı
          bitirirsen o kadar yüksek puan alırsın.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col items-center gap-6">
          <MemoryGame
            onScoreSubmitted={() => setRefreshKey((k) => k + 1)}
          />
        </div>

        <Leaderboard gameId="memory-match" refreshKey={refreshKey} accentColor={ACCENT} />
      </div>
    </main>
  );
}
