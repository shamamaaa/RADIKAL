"use client";

import { useEffect, useRef, useState } from "react";
import { ayranSkins, salgamSkin, type AyranSkin } from "@/lib/brands";
import { isImageReady, loadImage } from "@/lib/imageCache";
import { drawContainFit } from "@/lib/canvasDraw";
import { usePlayerName } from "@/hooks/usePlayerName";
import PlayerNamePrompt from "@/components/PlayerNamePrompt";
import SubmitScoreForm from "@/components/SubmitScoreForm";

const BASKET_IMAGE_SRC = "/images/games/basket.png";

const WIDTH = 360;
const HEIGHT = 560;
const BASKET_WIDTH = 74;
const BASKET_HEIGHT = 40;
const ITEM_SIZE = 34;
const MAX_STRIKES = 3;

interface FallingItem {
  x: number;
  y: number;
  vy: number;
  type: "ayran" | "salgam";
  skin?: AyranSkin;
  caught?: boolean;
}

type GameState = "idle" | "playing" | "gameover";

function drawMiniCanVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  skin: AyranSkin
) {
  ctx.fillStyle = skin.cupColor;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 5);
  ctx.fill();

  ctx.fillStyle = skin.swirlColor;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h * 0.1);
  ctx.quadraticCurveTo(x, y - h * 0.3, x + w / 2, y - h * 0.05);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.lineTo(x - w / 2, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = skin.lidColor;
  ctx.fillRect(x - w / 2, y - h / 2, w, 5);
}

function drawMiniCan(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  skin: AyranSkin
) {
  const w = ITEM_SIZE;
  const h = ITEM_SIZE * 1.15;

  const img = loadImage(skin.image);
  if (isImageReady(img)) {
    drawContainFit(ctx, img, x - w / 2, y - h / 2, w, h);
  } else {
    drawMiniCanVector(ctx, x, y, w, h, skin);
  }
}

function drawMiniSalgamVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = salgamSkin.bottleColor;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2 + 6, w, h - 6, 6);
  ctx.fill();

  ctx.fillStyle = salgamSkin.neckColor;
  ctx.fillRect(x - w / 5, y - h / 2 - 6, w / 2.5, 12);

  ctx.fillStyle = salgamSkin.capColor;
  ctx.fillRect(x - w / 5, y - h / 2 - 10, w / 2.5, 6);
}

function drawMiniSalgam(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = ITEM_SIZE * 0.8;
  const h = ITEM_SIZE * 1.3;

  const img = loadImage(salgamSkin.image);
  if (isImageReady(img)) {
    drawContainFit(ctx, img, x - w / 2, y - h / 2, w, h);
  } else {
    drawMiniSalgamVector(ctx, x, y, w, h);
  }
}

function drawBasketVector(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#e8332b";
  ctx.beginPath();
  ctx.moveTo(x - BASKET_WIDTH / 2, y);
  ctx.lineTo(x + BASKET_WIDTH / 2, y);
  ctx.lineTo(x + BASKET_WIDTH / 2 - 8, y + BASKET_HEIGHT);
  ctx.lineTo(x - BASKET_WIDTH / 2 + 8, y + BASKET_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#a11f19";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = "#a11f19";
  ctx.lineWidth = 2;
  for (const dx of [-18, 0, 18]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y + 6);
    ctx.lineTo(x + dx * 0.85, y + BASKET_HEIGHT - 6);
    ctx.stroke();
  }
}

function drawBasket(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const img = loadImage(BASKET_IMAGE_SRC);
  if (isImageReady(img)) {
    drawContainFit(
      ctx,
      img,
      x - BASKET_WIDTH / 2,
      y,
      BASKET_WIDTH,
      BASKET_HEIGHT
    );
  } else {
    drawBasketVector(ctx, x, y);
  }
}

export default function AyranCatchGame({
  onScoreSubmitted,
  onGameOver,
}: {
  onScoreSubmitted?: () => void;
  onGameOver?: (score: number, playerName: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [finalPlayerName, setFinalPlayerName] = useState("");
  const { promptOpen, ensureName, confirmName } = usePlayerName();
  const playerNameRef = useRef("");

  const stateRef = useRef({
    basketX: WIDTH / 2,
    items: [] as FallingItem[],
    frame: 0,
    framesSinceSpawn: 0,
    spawnEvery: 55,
    running: false,
    score: 0,
    strikes: 0,
  });

  const restartRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    let rafId: number;

    function reset() {
      stateRef.current.basketX = WIDTH / 2;
      stateRef.current.items = [];
      stateRef.current.frame = 0;
      stateRef.current.framesSinceSpawn = 40;
      stateRef.current.spawnEvery = 55;
      stateRef.current.score = 0;
      stateRef.current.strikes = 0;
      setScore(0);
      setStrikes(0);
      spawnItem();
    }

    function spawnItem() {
      const isSalgam = Math.random() < 0.22;
      const x = 24 + Math.random() * (WIDTH - 48);
      const speed =
        2.2 + Math.random() * 1.3 + Math.min(stateRef.current.frame / 900, 4.5);
      stateRef.current.items.push({
        x,
        y: -ITEM_SIZE,
        vy: speed,
        type: isSalgam ? "salgam" : "ayran",
        skin: isSalgam ? undefined : ayranSkins[Math.floor(Math.random() * ayranSkins.length)],
      });
    }

    function endGame() {
      const s = stateRef.current;
      s.running = false;
      setFinalPlayerName(playerNameRef.current);
      setGameState("gameover");
      if (onGameOver) onGameOver(s.score, playerNameRef.current);
    }

    restartRef.current = () => {
      reset();
      stateRef.current.running = true;
    };

    function tick() {
      const s = stateRef.current;
      const ctx2 = ctx as CanvasRenderingContext2D;
      ctx2.clearRect(0, 0, WIDTH, HEIGHT);

      const grad = ctx2.createLinearGradient(0, 0, 0, HEIGHT);
      grad.addColorStop(0, "#eaf8ee");
      grad.addColorStop(1, "#f8f9fb");
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, WIDTH, HEIGHT);

      if (s.running) {
        s.frame++;
        s.framesSinceSpawn++;
        if (s.framesSinceSpawn >= s.spawnEvery) {
          spawnItem();
          s.framesSinceSpawn = 0;
          s.spawnEvery = Math.max(16, s.spawnEvery - 0.8);
        }

        const basketY = HEIGHT - 60;
        for (const item of s.items) {
          if (item.caught) continue;
          item.y += item.vy;

          if (
            !item.caught &&
            item.y + ITEM_SIZE / 2 >= basketY &&
            item.y - ITEM_SIZE / 2 <= basketY + BASKET_HEIGHT &&
            Math.abs(item.x - s.basketX) < BASKET_WIDTH / 2
          ) {
            item.caught = true;
            if (item.type === "ayran") {
              s.score += 1;
              setScore(s.score);
            } else {
              s.strikes += 1;
              setStrikes(s.strikes);
              if (s.strikes >= MAX_STRIKES) {
                endGame();
                break;
              }
            }
          }
        }

        s.items = s.items.filter((i) => !i.caught && i.y < HEIGHT + ITEM_SIZE);
      }

      for (const item of s.items) {
        if (item.type === "ayran" && item.skin) {
          drawMiniCan(ctx2, item.x, item.y, item.skin);
        } else if (item.type === "salgam") {
          drawMiniSalgam(ctx2, item.x, item.y);
        }
      }

      drawBasket(ctx2, s.basketX, HEIGHT - 60);

      rafId = requestAnimationFrame(tick);
    }

    function movePointer(clientX: number) {
      const rect = canvas!.getBoundingClientRect();
      const scale = WIDTH / rect.width;
      const x = (clientX - rect.left) * scale;
      stateRef.current.basketX = Math.min(WIDTH - BASKET_WIDTH / 2, Math.max(BASKET_WIDTH / 2, x));
    }

    function handlePointerMove(e: PointerEvent) {
      if (stateRef.current.running) movePointer(e.clientX);
    }
    function handleTouchMove(e: TouchEvent) {
      if (stateRef.current.running && e.touches[0]) {
        e.preventDefault();
        movePointer(e.touches[0].clientX);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (!stateRef.current.running) return;
      if (e.code === "ArrowLeft") stateRef.current.basketX -= 24;
      if (e.code === "ArrowRight") stateRef.current.basketX += 24;
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKey);

    reset();
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    const name = await ensureName();
    playerNameRef.current = name;
    setGameState("playing");
    restartRef.current();
  }

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: WIDTH }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: WIDTH,
          height: "auto",
          aspectRatio: `${WIDTH} / ${HEIGHT}`,
        }}
        className="touch-none rounded-2xl border border-line bg-mist shadow-sm"
      />

      {gameState !== "idle" && (
        <div className="pointer-events-none absolute inset-x-0 top-4 flex items-center justify-between px-5">
          <span className="font-display text-3xl font-bold text-ink/80 tabular-nums">
            {score}
          </span>
          <span className="flex gap-1.5">
            {Array.from({ length: MAX_STRIKES }).map((_, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    i < strikes ? "#5b1030" : "rgba(91,16,48,0.2)",
                }}
              />
            ))}
          </span>
        </div>
      )}

      {gameState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/85 backdrop-blur-sm">
          <p className="max-w-[220px] text-center text-sm text-ink/70">
            Sepeti sürükle, ayranları topla. 3 Şalgam yakalarsan oyun biter.
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
            gameId="ayran-catch"
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
  );
}
