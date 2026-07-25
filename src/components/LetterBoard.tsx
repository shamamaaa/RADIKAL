"use client";

import { FormEvent, useEffect, useState } from "react";
import { members, type MemberId, type Member } from "@/lib/members";
import {
  fetchLetters,
  isBoardUnlocked,
  unlockBoard,
  type LetterRow,
} from "@/lib/letters";
import Button from "./ui/Button";

const BOARD_PASSWORD =
  process.env.NEXT_PUBLIC_LETTERS_PASSWORD || "HayranizBuArada5";

function EnvelopeIcon({
  color,
  isCreator,
}: {
  color: string;
  isCreator?: boolean;
}) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 64 48" className="h-full w-full drop-shadow-sm">
        <rect
          x="2"
          y="4"
          width="60"
          height="40"
          rx="6"
          fill={color}
          stroke={isCreator ? "#f59e0b" : "none"}
          strokeWidth={isCreator ? "2.5" : "0"}
        />
        <path
          d="M6 9 L32 27 L58 9"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <circle cx="32" cy="30" r="7" fill="white" />
        <path
          d="M32 25.5 L33.2 28.6 L36.5 28.8 L34 31 L34.8 34.2 L32 32.4 L29.2 34.2 L30 31 L27.5 28.8 L30.8 28.6 Z"
          fill={color}
        />
      </svg>
      {isCreator && (
        <span
          className="absolute -right-1 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] shadow-sm ring-2 ring-white"
          title="Site Yapımcısının Mektubu"
        >
          ⭐
        </span>
      )}
    </div>
  );
}

export default function LetterBoard() {
  // Starts locked on both server and client so the first client render
  // matches SSR output, then syncs the real sessionStorage value post-mount.
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [letters, setLetters] = useState<LetterRow[] | null>(null);
  const [filter, setFilter] = useState<MemberId | "all">("all");
  const [openLetter, setOpenLetter] = useState<LetterRow | null>(null);

  useEffect(() => {
    if (isBoardUnlocked()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from sessionStorage after mount
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    fetchLetters().then(setLetters);
  }, [unlocked]);

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (password === BOARD_PASSWORD) {
      unlockBoard();
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-mist py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          ✉️
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            Bu mektuplar kilitli
          </p>
          <p className="text-sm text-ink/50">Okumak için şifreyi gir</p>
        </div>
        <form
          onSubmit={handleUnlock}
          className="flex w-full max-w-xs flex-col items-center gap-3"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Şifre"
            className="w-full rounded-full border border-line px-4 py-2.5 text-center text-sm text-ink outline-none focus:border-ink/30"
          />
          {error && (
            <p className="text-xs text-red-500">Şifre yanlış, tekrar dene.</p>
          )}
          <Button type="submit" className="w-full">
            Aç
          </Button>
        </form>
      </div>
    );
  }

  const allFiltered =
    letters?.filter((l) => filter === "all" || l.member_id === filter) ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold text-ink">
          Gelen mektuplar
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Tümü"
          />
          {Object.values(members).map((m) => (
            <FilterPill
              key={m.id}
              active={filter === m.id}
              onClick={() => setFilter(m.id)}
              label={m.name}
              color={m.color}
            />
          ))}
        </div>
      </div>

      {letters === null ? (
        <p className="text-sm text-ink/50">Yükleniyor…</p>
      ) : allFiltered.length === 0 ? (
        <p className="text-sm text-ink/50">Henüz mektup yok.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {allFiltered.map((letter) => {
            const member = members[letter.member_id];
            return (
              <button
                key={letter.id}
                onClick={() => setOpenLetter(letter)}
                className="group flex w-20 flex-col items-center gap-1.5 transition-transform hover:-translate-y-1"
              >
                <span className="h-12 w-16">
                  <EnvelopeIcon color={member.color} isCreator={letter.is_creator} />
                </span>
                <span className="w-full truncate text-center text-xs font-medium text-ink/70">
                  {letter.sender_name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {openLetter && (
        <LetterPopup
          letter={openLetter}
          member={members[openLetter.member_id]}
          onClose={() => setOpenLetter(null)}
        />
      )}
    </div>
  );
}

function LetterPopup({
  letter,
  member,
  onClose,
}: {
  letter: LetterRow;
  member: Member;
  onClose: () => void;
}) {
  const date = new Date(letter.created_at).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-paper shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-line p-6">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.15em]"
              style={{ color: member.color }}
            >
              {member.dative}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">
              {letter.sender_name}
            </p>
            <p className="mt-1 text-xs text-ink/40">{date}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-mist hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {letter.message}
          </p>
        </div>

        <div className="border-t border-line px-6 py-4 text-right">
          <p
            className="font-display text-sm font-semibold"
            style={{ color: member.color }}
          >
            Sevgilerimle... ♥
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
      style={
        active
          ? { backgroundColor: color ?? "var(--color-ink)", color: "white" }
          : {
              backgroundColor: "var(--color-mist)",
              color: "var(--color-ink)",
              opacity: 0.6,
            }
      }
    >
      {label}
    </button>
  );
}
