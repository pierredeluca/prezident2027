import type { GameState } from "./types";

export const SAVE_KEY = "le-grand-ecart-v1";

export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

export function parseSave(raw: string | null): GameState | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isGameState(data)) return null;
    return data;
  } catch {
    return null;
  }
}

export function loadGame(storage: Pick<Storage, "getItem">): GameState | null {
  return parseSave(storage.getItem(SAVE_KEY));
}

export function saveGame(storage: Pick<Storage, "setItem">, state: GameState): void {
  storage.setItem(SAVE_KEY, serialize(state));
}

export function clearGame(storage: Pick<Storage, "removeItem">): void {
  storage.removeItem(SAVE_KEY);
}

function isGameState(data: unknown): data is GameState {
  if (!data || typeof data !== "object") return false;
  const state = data as Partial<GameState>;
  return (
    state.version === 1 &&
    typeof state.chapterId === "string" &&
    typeof state.sceneId === "string" &&
    typeof state.minutes === "number" &&
    !!state.flags &&
    Array.isArray(state.inventory) &&
    Array.isArray(state.journal) &&
    Array.isArray(state.log) &&
    !!state.entered
  );
}
