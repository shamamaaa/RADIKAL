import { supabase } from "./supabase";

export interface ScoreRow {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

const LOCAL_KEY_PREFIX = "radikal_scores_";
const NAME_KEY = "radikal_player_name";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 25;

export function getSavedPlayerName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function savePlayerName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name);
}

function getLocalScores(gameId: string): ScoreRow[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOCAL_KEY_PREFIX + gameId);
  return raw ? JSON.parse(raw) : [];
}

function saveLocalScore(gameId: string, row: ScoreRow) {
  if (typeof window === "undefined") return;
  const rows = getLocalScores(gameId);
  const existing = rows.find((r) => r.player_name === row.player_name);

  if (!existing) {
    rows.push(row);
  } else if (row.score > existing.score) {
    existing.score = row.score;
    existing.created_at = row.created_at;
  }

  rows.sort((a, b) => b.score - a.score);
  window.localStorage.setItem(
    LOCAL_KEY_PREFIX + gameId,
    JSON.stringify(rows.slice(0, 20))
  );
}

export async function submitScore(
  gameId: string,
  playerName: string,
  score: number
): Promise<void> {
  savePlayerName(playerName);

  if (!supabase) {
    saveLocalScore(gameId, {
      id: crypto.randomUUID(),
      player_name: playerName,
      score,
      created_at: new Date().toISOString(),
    });
    return;
  }

  await supabase.rpc("submit_score", {
    p_game_id: gameId,
    p_player_name: playerName,
    p_score: score,
  });
}

export async function fetchTopScores(
  gameId: string,
  limit = 10
): Promise<ScoreRow[]> {
  if (!supabase) {
    return getLocalScores(gameId).slice(0, limit);
  }

  const { data, error } = await supabase
    .from("scores")
    .select("id, player_name, score, created_at")
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}
