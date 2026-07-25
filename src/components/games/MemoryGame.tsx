"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { memoryCardImages } from "@/lib/memoryCards";
import { usePlayerName } from "@/hooks/usePlayerName";
import PlayerNamePrompt from "@/components/PlayerNamePrompt";
import SubmitScoreForm from "@/components/SubmitScoreForm";

const PAIR_COUNT = memoryCardImages.length;
const MATCH_DELAY_MS = 800;

interface Card {
  key: string;
  image: string;
  flipped: boolean;
  matched: boolean;
}

type GameState = "idle" | "playing" | "gameover";

function shuffledDeck(): Card[] {
  const deck: Card[] = memoryCardImages.flatMap((image, pairIndex) => [
    { key: `${pairIndex}-a`, image, flipped: false, matched: false },
    { key: `${pairIndex}-b`, image, flipped: false, matched: false },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function computeScore(moves: number, seconds: number): number {
  const raw = 1000 - (moves - PAIR_COUNT) * 15 - seconds * 3;
  return Math.max(0, Math.round(raw));
}

export default function MemoryGame({
  onScoreSubmitted,
  onGameOver,
}: {
  onScoreSubmitted?: () => void;
  onGameOver?: (score: number, playerName: string) => void;
}) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [cards, setCards] = useState<Card[]>(() => shuffledDeck());
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [finalPlayerName, setFinalPlayerName] = useState("");
  const { promptOpen, ensureName, confirmName } = usePlayerName();
  const playerNameRef = useRef("");

  const flippedIndicesRef = useRef<number[]>([]);
  const busyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function start() {
    const name = await ensureName();
    playerNameRef.current = name;

    setCards(shuffledDeck());
    setMoves(0);
    setElapsed(0);
    flippedIndicesRef.current = [];
    busyRef.current = false;
    // eslint-disable-next-line react-hooks/purity -- click handler, not render
    startedAtRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);

    setGameState("playing");
  }

  function endGame(finalMoves: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/purity -- click handler, not render
    const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
    setElapsed(seconds);
    const finalSc = computeScore(finalMoves, seconds);
    setScore(finalSc);
    setFinalPlayerName(playerNameRef.current);
    setGameState("gameover");
    if (onGameOver) onGameOver(finalSc, playerNameRef.current);
  }

  function handleCardClick(index: number) {
    if (gameState !== "playing" || busyRef.current) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;
    if (flippedIndicesRef.current.includes(index)) return;

    const nextCards = cards.map((c, i) =>
      i === index ? { ...c, flipped: true } : c
    );
    setCards(nextCards);
    flippedIndicesRef.current = [...flippedIndicesRef.current, index];

    if (flippedIndicesRef.current.length < 2) return;

    const [firstIdx, secondIdx] = flippedIndicesRef.current;
    const isMatch = nextCards[firstIdx].image === nextCards[secondIdx].image;
    const newMoves = moves + 1;
    setMoves(newMoves);

    if (isMatch) {
      const matchedCards = nextCards.map((c, i) =>
        i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
      );
      setCards(matchedCards);
      flippedIndicesRef.current = [];

      if (matchedCards.every((c) => c.matched)) {
        endGame(newMoves);
      }
      return;
    }

    busyRef.current = true;
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c, i) =>
          i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
        )
      );
      flippedIndicesRef.current = [];
      busyRef.current = false;
    }, MATCH_DELAY_MS);
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="mb-2 flex items-center justify-between px-1 text-sm font-semibold text-ink/70">
        <span>Hamle: {gameState === "idle" ? 0 : moves}</span>
        <span className="tabular-nums">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-line bg-mist p-3">
          {cards.map((card, index) => {
            const showFace = card.flipped || card.matched;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => handleCardClick(index)}
                disabled={gameState !== "playing"}
                className="relative aspect-square overflow-hidden rounded-lg shadow-sm transition-transform duration-150 active:scale-95 disabled:pointer-events-none"
                style={{
                  backgroundColor: showFace ? "#ffffff" : "var(--color-ibrahim)",
                }}
              >
                {showFace ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image}
                    alt=""
                    className={`h-full w-full object-cover ${
                      card.matched ? "opacity-80" : ""
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Image
                      src="/images/logo.png"
                      alt=""
                      width={28}
                      height={28}
                      className="opacity-90"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/90 backdrop-blur-sm">
            <p className="max-w-[220px] text-center text-sm text-ink/70">
              Eşleri bul, kartları çevir. Ne kadar az hamlede bitirirsen o
              kadar yüksek puan.
            </p>
            <button
              onClick={start}
              className="rounded-full px-6 py-3 font-display text-sm font-semibold text-white shadow-lg"
              style={{ backgroundColor: "var(--color-ibrahim)" }}
            >
              Başla
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-6 text-center backdrop-blur-sm">
            <p className="font-display text-2xl font-bold text-ink">
              Oyun bitti — {score} puan
            </p>
            <SubmitScoreForm
              gameId="memory-match"
              score={score}
              playerName={finalPlayerName}
              onSubmitted={() => {
                if (onScoreSubmitted) onScoreSubmitted();
              }}
            />
            <button
              onClick={start}
              className="mt-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: "var(--color-ibrahim)" }}
            >
              Tekrar Oyna
            </button>
          </div>
        )}

        <PlayerNamePrompt open={promptOpen} onConfirm={confirmName} />
      </div>
    </div>
  );
}
