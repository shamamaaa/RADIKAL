"use client";

import { useEffect, useRef, useState } from "react";
import { submitScore } from "@/lib/scores";

export default function SubmitScoreForm({
  gameId,
  score,
  playerName,
  onSubmitted,
}: {
  gameId: string;
  score: number;
  playerName: string;
  onSubmitted: () => void;
}) {
  const [done, setDone] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    submitScore(gameId, playerName, score).then(() => {
      setDone(true);
      onSubmitted();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p className="text-sm font-medium text-ink/60">
      {done
        ? `${playerName} olarak skor tablosuna kaydedildi!`
        : "Skor kaydediliyor…"}
    </p>
  );
}
