"use client";

import { useEffect, useRef, useState } from "react";
import { ayranSkins, type AyranSkin } from "@/lib/brands";
import { isImageReady, loadImage } from "@/lib/imageCache";
import { usePlayerName } from "@/hooks/usePlayerName";
import PlayerNamePrompt from "@/components/PlayerNamePrompt";
import SubmitScoreForm from "@/components/SubmitScoreForm";

const WIDTH = 360;
const HEIGHT = 560;
const BASE_BLOCK_WIDTH = 105;
const MIN_WIDTH = 22;
const PERFECT_TOLERANCE = 7;
const BASE_Y = HEIGHT - 40;
const CRANE_RAIL_Y = 40;
const GRAVITY = 0.45;
const TARGET_TOP_Y = 155;

interface Block {
  x: number;
  width: number;
  skin: AyranSkin;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface FloatText {
  text: string;
  x: number;
  y: number;
  alpha: number;
}

type GameState = "idle" | "playing" | "gameover";

function pickSkin(exclude?: AyranSkin): AyranSkin {
  const options = ayranSkins.filter((s) => s !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function getCupAspectRatio(skin: AyranSkin): number {
  const img = loadImage(skin.image);
  if (isImageReady(img) && img.naturalWidth > 0 && img.naturalHeight > 0) {
    return img.naturalHeight / img.naturalWidth;
  }
  return 1.55;
}

function getCupHeight(width: number, skin: AyranSkin): number {
  const ar = getCupAspectRatio(skin);
  return Math.round(width * ar);
}

function computeStackYs(blocks: Block[]): { heights: number[]; ys: number[] } {
  const heights: number[] = [];
  const ys: number[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const h = getCupHeight(blocks[i].width, blocks[i].skin);
    heights.push(h);

    if (i === 0) {
      ys.push(BASE_Y - h);
    } else {
      const overlap = Math.min(12, Math.round(h * 0.12));
      ys.push(ys[i - 1] - h + overlap);
    }
  }

  return { heights, ys };
}

function drawCanVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  skin: AyranSkin
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.clip();

  ctx.fillStyle = skin.cupColor;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = skin.swirlColor;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.35);
  ctx.quadraticCurveTo(
    x + width * 0.5,
    y + height * 0.15,
    x + width,
    y + height * 0.4
  );
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = skin.lidColor;
  ctx.fillRect(x, y, width, Math.min(10, height * 0.15));

  if (width > 30) {
    ctx.fillStyle = skin.textColor;
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AYRAN", x + width / 2, y + height - 10);
  }

  ctx.restore();
}

function drawCupSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  skin: AyranSkin,
  flash: boolean
) {
  const img = loadImage(skin.image);
  ctx.save();

  // Soft ambient drop shadow for 3D depth
  ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  if (isImageReady(img)) {
    ctx.drawImage(img, x, y, width, height);
  } else {
    drawCanVector(ctx, x, y, width, height, skin);
  }

  ctx.restore();

  if (flash) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    ctx.restore();
  }
}

function drawCrane(
  ctx: CanvasRenderingContext2D,
  movingX: number,
  movingWidth: number,
  movingY: number
) {
  // Top overhead rail
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(10, CRANE_RAIL_Y);
  ctx.lineTo(WIDTH - 10, CRANE_RAIL_Y);
  ctx.stroke();

  // Rail end stoppers
  ctx.fillStyle = "#334155";
  ctx.fillRect(12, CRANE_RAIL_Y - 8, 8, 20);
  ctx.fillRect(WIDTH - 20, CRANE_RAIL_Y - 8, 8, 20);

  const cx = movingX + movingWidth / 2;

  // Steel wire cable
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, CRANE_RAIL_Y);
  ctx.lineTo(cx, movingY);
  ctx.stroke();

  // Trolley carriage on rail
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(cx - 12, CRANE_RAIL_Y - 5, 24, 10);

  // Hook / claw gripping top of moving cup
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 10, movingY - 4);
  ctx.lineTo(cx + 10, movingY - 4);
  ctx.moveTo(cx - 8, movingY - 4);
  ctx.lineTo(cx - 8, movingY + 5);
  ctx.moveTo(cx + 8, movingY - 4);
  ctx.lineTo(cx + 8, movingY + 5);
  ctx.stroke();
}

export default function AyranStackGame({
  onScoreSubmitted,
  onGameOver,
}: {
  onScoreSubmitted?: () => void;
  onGameOver?: (score: number, playerName: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [finalPlayerName, setFinalPlayerName] = useState("");
  const { promptOpen, ensureName, confirmName } = usePlayerName();
  const playerNameRef = useRef("");
  const restartRef = useRef<() => void>(() => {});

  const stateRef = useRef({
    blocks: [] as Block[],
    moving: null as (Block & { dir: 1 | -1; speed: number }) | null,
    particles: [] as Particle[],
    floatTexts: [] as FloatText[],
    cameraOffset: 0,
    targetCameraOffset: 0,
    flashUntil: 0,
    running: false,
    score: 0,
  });

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

    function spawnMoving(targetWidth: number, excludeSkin?: AyranSkin) {
      const fromLeft = Math.random() > 0.5;
      const speed = 2.2 + Math.min(stateRef.current.score * 0.07, 3.8);
      const skin = pickSkin(excludeSkin);
      stateRef.current.moving = {
        x: fromLeft ? -targetWidth : WIDTH,
        width: targetWidth,
        skin,
        dir: fromLeft ? 1 : -1,
        speed,
      };
    }

    function reset() {
      const baseSkin = pickSkin();
      const base: Block = {
        x: (WIDTH - BASE_BLOCK_WIDTH) / 2,
        width: BASE_BLOCK_WIDTH,
        skin: baseSkin,
      };
      stateRef.current.blocks = [base];
      stateRef.current.particles = [];
      stateRef.current.floatTexts = [];
      stateRef.current.cameraOffset = 0;
      stateRef.current.targetCameraOffset = 0;
      stateRef.current.score = 0;
      stateRef.current.flashUntil = 0;
      spawnMoving(base.width, baseSkin);
      setScore(0);
    }

    function spawnSplashes(x: number, y: number, color: string) {
      for (let k = 0; k < 12; k++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        stateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          radius: 2 + Math.random() * 3.5,
          alpha: 1.0,
          color: Math.random() > 0.4 ? "#ffffff" : color,
        });
      }
    }

    function triggerPerfectText(x: number, y: number) {
      stateRef.current.floatTexts.push({
        text: "MÜKEMMEL! ✨",
        x,
        y,
        alpha: 1.0,
      });
    }

    function drop() {
      const s = stateRef.current;
      const moving = s.moving;
      if (!moving || !s.running) return;

      const below = s.blocks[s.blocks.length - 1];
      const overlapLeft = Math.max(moving.x, below.x);
      const overlapRight = Math.min(moving.x + moving.width, below.x + below.width);
      const overlapWidth = overlapRight - overlapLeft;

      if (overlapWidth <= 0) {
        // Missed stack completely
        const { ys } = computeStackYs(s.blocks);
        const topY = ys[ys.length - 1];
        spawnSplashes(moving.x + moving.width / 2, topY, moving.skin.cupColor);
        endGame();
        return;
      }

      const centerDiff = Math.abs(
        moving.x + moving.width / 2 - (below.x + below.width / 2)
      );
      const isPerfect = centerDiff < PERFECT_TOLERANCE;

      let placed: Block;

      if (isPerfect) {
        placed = {
          x: below.x,
          width: below.width,
          skin: moving.skin,
        };
        const { ys } = computeStackYs(s.blocks);
        const topY = ys[ys.length - 1];
        triggerPerfectText(below.x + below.width / 2, topY - 20);
      } else {
        placed = {
          x: overlapLeft,
          width: overlapWidth,
          skin: moving.skin,
        };

        const { ys } = computeStackYs(s.blocks);
        const topY = ys[ys.length - 1];
        const splashX = moving.x < below.x ? overlapLeft : overlapRight;
        spawnSplashes(splashX, topY, moving.skin.cupColor);
      }

      if (placed.width < MIN_WIDTH) {
        endGame();
        return;
      }

      s.blocks.push(placed);
      s.score += 1;
      s.flashUntil = performance.now() + (isPerfect ? 250 : 0);
      setScore(s.score);

      const { ys } = computeStackYs(s.blocks);
      const topBlockY = ys[ys.length - 1];
      const movingH = getCupHeight(placed.width, placed.skin);
      const movingNaturalY = topBlockY - movingH - 50;

      s.targetCameraOffset = Math.max(0, TARGET_TOP_Y - movingNaturalY);

      spawnMoving(placed.width, placed.skin);
    }

    function endGame() {
      const s = stateRef.current;
      s.running = false;
      s.moving = null;
      setFinalPlayerName(playerNameRef.current);
      setGameState("gameover");
      if (onGameOver) onGameOver(s.score, playerNameRef.current);
    }

    function tick() {
      const s = stateRef.current;
      const ctx2 = ctx as CanvasRenderingContext2D;
      ctx2.clearRect(0, 0, WIDTH, HEIGHT);

      s.cameraOffset += (s.targetCameraOffset - s.cameraOffset) * 0.12;

      // Soft ambient background gradient
      const grad = ctx2.createLinearGradient(0, 0, 0, HEIGHT);
      grad.addColorStop(0, "#f1f5f9");
      grad.addColorStop(1, "#f8fafc");
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, WIDTH, HEIGHT);

      if (s.moving && s.running) {
        s.moving.x += s.moving.dir * s.moving.speed;
        if (s.moving.dir === 1 && s.moving.x > WIDTH + 10) s.moving.dir = -1;
        if (s.moving.dir === -1 && s.moving.x < -s.moving.width - 10) s.moving.dir = 1;
      }

      const flash = performance.now() < s.flashUntil;

      // Compute stack coordinates
      const { heights, ys } = computeStackYs(s.blocks);

      // Render stack blocks
      s.blocks.forEach((b, i) => {
        const screenY = ys[i] + s.cameraOffset;
        const h = heights[i];
        if (screenY < -h || screenY > HEIGHT + 40) return;

        drawCupSprite(
          ctx2,
          b.x,
          screenY,
          b.width,
          h,
          b.skin,
          flash && i === s.blocks.length - 1
        );
      });

      // Update & render milk splash particles
      s.particles = s.particles.filter((p) => {
        p.x += p.vx;
        p.vy += GRAVITY;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) return false;

        const screenY = p.y + s.cameraOffset;
        ctx2.save();
        ctx2.globalAlpha = Math.max(0, p.alpha);
        ctx2.fillStyle = p.color;
        ctx2.beginPath();
        ctx2.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();
        return true;
      });

      // Update & render floating text (e.g. PERFECT!)
      s.floatTexts = s.floatTexts.filter((ft) => {
        ft.y -= 0.8;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) return false;

        const screenY = ft.y + s.cameraOffset;
        ctx2.save();
        ctx2.globalAlpha = Math.max(0, ft.alpha);
        ctx2.fillStyle = "#d97706";
        ctx2.font = "bold 15px sans-serif";
        ctx2.textAlign = "center";
        ctx2.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx2.shadowBlur = 4;
        ctx2.fillText(ft.text, ft.x, screenY);
        ctx2.restore();
        return true;
      });

      // Render crane & moving cup
      if (s.moving) {
        const topBlockY = ys[ys.length - 1];
        const movingH = getCupHeight(s.moving.width, s.moving.skin);
        const movingNaturalY = topBlockY - movingH - 50;
        const screenY = movingNaturalY + s.cameraOffset;

        drawCrane(ctx2, s.moving.x, s.moving.width, screenY);
        drawCupSprite(
          ctx2,
          s.moving.x,
          screenY,
          s.moving.width,
          movingH,
          s.moving.skin,
          false
        );
      }

      rafId = requestAnimationFrame(tick);
    }

    function handleInput(e: Event) {
      e.preventDefault();
      if (stateRef.current.running) drop();
    }

    canvas.addEventListener("pointerdown", handleInput);
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") handleInput(e);
    };
    window.addEventListener("keydown", keyHandler);

    reset();
    tick();

    restartRef.current = () => {
      reset();
      stateRef.current.running = true;
    };

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", handleInput);
      window.removeEventListener("keydown", keyHandler);
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
    <div className="mx-auto w-full" style={{ maxWidth: WIDTH }}>
      <div className="mb-2 h-9 text-center font-display text-3xl font-bold text-ink/80 tabular-nums">
        {gameState !== "idle" && score}
      </div>

      <div className="relative">
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

        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/85 backdrop-blur-sm">
            <p className="max-w-[220px] text-center text-sm text-ink/70">
              Vinç ayran kutularını taşıyor. Doğru anda bırak, kuleni
              yükselt.
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
              gameId="ayran-stack"
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
