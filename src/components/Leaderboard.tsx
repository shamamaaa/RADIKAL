"use client";

import { useEffect, useState } from "react";
import { fetchTopScores, ScoreRow } from "@/lib/scores";

export default function Leaderboard({
  gameId,
  refreshKey,
  accentColor = "var(--color-ibrahim)",
}: {
  gameId: string;
  refreshKey?: number;
  accentColor?: string;
}) {
  const [rows, setRows] = useState<ScoreRow[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchTopScores(gameId).then((data) => {
      if (active) setRows(data);
    });
    return () => {
      active = false;
    };
  }, [gameId, refreshKey]);

  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <h3 className="font-display text-lg font-semibold text-ink">
        Skor Tablosu
      </h3>

      {rows === null ? (
        <p className="mt-4 text-sm text-ink/50">Yükleniyor…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">
          Henüz skor yok. İlk skoru sen yap!
        </p>
      ) : (
        <ol className="mt-4 flex flex-col gap-2">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: i === 0 ? "var(--color-mist)" : "transparent",
              }}
            >
              <span
                className="w-5 text-center font-display font-semibold"
                style={{ color: i < 3 ? accentColor : undefined }}
              >
                {i + 1}
              </span>
              <span className="font-medium text-ink">
                {row.player_name} -{" "}
                <span className="font-display font-semibold tabular-nums">
                  {row.score.toLocaleString("tr-TR")}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
