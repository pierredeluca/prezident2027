import { UI } from "./content/copy";
import { requireTheme, THEME_LIST, themeContent } from "./content/themes";
import type { Politician, Source, ThemeContent } from "./content/types";
import {
  ASSEZ,
  CARD_CLOSE,
  CARD_SOURCE,
  FACE_IMG,
  FACE_SOURCE,
  iconRect,
  inside,
  NEXT_BTN,
  NOTE_BACK,
  NOTE_BTN,
  NOTE_PHOTOS,
  PAUSE_RESTART,
  PAUSE_RESUME,
  RIGHT_COL,
  SELECT_NOTE,
  SOURCE_CLOSE,
  sourceOpenRect,
  themeRect,
} from "./layout";

export const GAUGE_MAX = 8;
export const GAUGE_START = 4;

export type Screen =
  | "title"
  | "select"
  | "room"
  | "card"
  | "sources"
  | "hint"
  | "face"
  | "defeat"
  | "result"
  | "note"
  | "pause";

export interface Run {
  themeId: string;
  politicianId: string;
  collected: string[];
  wasted: string[];
  wastedAtEntry: number;
  shown: string[];
  claim: number;
  gauge: number;
  phase: "claim" | "reply" | "concede";
  reply: string | null;
  replyKind: "corner" | "twist" | "decoy" | "honest" | "repeat" | null;
}

export interface GameState {
  screen: Screen;
  under: Screen | null;
  noteFrom: Screen | null;
  notePage: 0 | 1;
  roomId: string;
  hintId: string | null;
  cardId: string | null;
  cardFrom: Screen | null;
  sourceKind: "clue" | "claim" | null;
  sourceFrom: Screen | null;
  selected: string | null;
  notice: string | null;
  hover: string | null;
  cursor: { x: number; y: number } | null;
  run: Run | null;
  defeatKind: "facture" | "vert";
  rng: number;
  moves: number;
}

export type Action =
  | { t: "enter" }
  | { t: "theme"; id: string }
  | { t: "hotspot"; id: string }
  | { t: "icon"; id: string }
  | { t: "use"; id: string }
  | { t: "face" }
  | { t: "advance" }
  | { t: "close" }
  | { t: "sources" }
  | { t: "assez" }
  | { t: "laisser" }
  | { t: "next" }
  | { t: "retry" }
  | { t: "note" }
  | { t: "note-page" }
  | { t: "pause" }
  | { t: "resume" }
  | { t: "restart" }
  | { t: "hover"; id: string | null; x: number; y: number };

export function rand(seed: number): { value: number; seed: number } {
  let s = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, seed: s >>> 0 };
}

export function newGame(seed = 1): GameState {
  return {
    screen: "title",
    under: null,
    noteFrom: null,
    notePage: 0,
    roomId: "bureau",
    hintId: null,
    cardId: null,
    cardFrom: null,
    sourceKind: null,
    sourceFrom: null,
    selected: null,
    notice: null,
    hover: null,
    cursor: null,
    run: null,
    defeatKind: "facture",
    rng: seed >>> 0,
    moves: 0,
  };
}

export function inventory(run: Run): string[] {
  const gone = new Set(run.wasted);
  return run.collected.filter((id) => !gone.has(id));
}

export function themeOf(state: GameState): ThemeContent | null {
  if (!state.run) return null;
  return themeContent(state.run.themeId);
}

export function politicianOf(state: GameState): Politician | null {
  const theme = themeOf(state);
  if (!theme || !state.run?.politicianId) return null;
  return theme.politicians.find((p) => p.id === state.run!.politicianId) ?? null;
}

export function outcomeLine(state: GameState): string {
  const pol = politicianOf(state);
  if (pol?.honest) {
    const spent = (state.run?.wasted.length ?? 0) > (state.run?.wastedAtEntry ?? 0);
    return spent ? UI.lessonWaste : UI.lessonStop;
  }
  return UI.win;
}

export function activeSources(state: GameState): Source[] {
  const theme = themeOf(state);
  if (!theme || !state.run || !state.sourceKind) return [];
  if (state.sourceKind === "clue" && state.cardId) {
    return theme.clues.find((c) => c.id === state.cardId)?.sources ?? [];
  }
  const pol = politicianOf(state);
  if (!pol) return [];
  if (pol.honest) return pol.source ? [pol.source] : [];
  const claim = pol.claims[Math.min(state.run.claim, pol.claims.length - 1)];
  return claim ? [claim.source] : [];
}

function withRun(state: GameState, run: Partial<Run>, extra: Partial<GameState> = {}): GameState {
  return { ...state, ...extra, notice: extra.notice ?? null, run: { ...state.run!, ...run } };
}

function rollId(seed: number, ids: string[], avoid: string): { id: string; seed: number } {
  const r = rand(seed);
  let i = Math.floor(r.value * ids.length) % ids.length;
  if (ids.length > 1 && ids[i] === avoid) i = (i + 1) % ids.length;
  return { id: ids[i], seed: r.seed };
}

function enterFace(state: GameState, reroll: boolean): GameState {
  const run = state.run;
  if (!run) return state;
  const theme = requireTheme(run.themeId);
  if (run.collected.length < theme.minClues) return { ...state, notice: UI.need };
  let rng = state.rng;
  let politicianId = run.politicianId;
  if (reroll || !politicianId) {
    const rolled = rollId(rng, theme.politicians.map((p) => p.id), politicianId);
    rng = rolled.seed;
    politicianId = rolled.id;
  }
  return withRun(
    { ...state, rng, moves: state.moves + 1 },
    {
      politicianId,
      wastedAtEntry: run.wasted.length,
      shown: [],
      claim: 0,
      gauge: GAUGE_START,
      phase: "claim",
      reply: null,
      replyKind: null,
    },
    { screen: "face", selected: null, notice: null },
  );
}

function goDefeat(state: GameState): GameState {
  const r = rand(state.rng);
  return {
    ...state,
    rng: r.seed,
    screen: "defeat",
    defeatKind: r.value < 0.5 ? "facture" : "vert",
    selected: null,
    notice: null,
  };
}

function afterReply(state: GameState): GameState {
  const run = state.run;
  const pol = politicianOf(state);
  if (!run || !pol) return state;
  if (run.replyKind === "repeat" || pol.honest) {
    return withRun(state, { phase: "claim", reply: null, replyKind: null });
  }
  if (run.gauge <= 0) return withRun(state, { phase: "concede", reply: null, replyKind: null });
  if (run.gauge >= GAUGE_MAX) return goDefeat(state);
  const last = run.claim + 1 >= pol.claims.length;
  if (last) {
    if (run.gauge <= GAUGE_START) return withRun(state, { phase: "concede", reply: null, replyKind: null });
    return goDefeat(state);
  }
  return withRun(state, { claim: run.claim + 1, shown: [], phase: "claim", reply: null, replyKind: null });
}

function useClue(state: GameState, clueId: string): GameState {
  const run = state.run;
  const theme = themeOf(state);
  const pol = politicianOf(state);
  if (!run || !theme || !pol || state.screen !== "face" || run.phase !== "claim") return state;
  if (!inventory(run).includes(clueId)) return state;
  const clue = theme.clues.find((c) => c.id === clueId);
  if (!clue) return state;

  if (pol.honest) {
    return withRun(
      state,
      {
        wasted: [...run.wasted, clueId],
        phase: "reply",
        reply: pol.honestReply,
        replyKind: "honest",
      },
      { selected: null },
    );
  }

  if (run.shown.includes(clueId)) {
    return withRun(state, { phase: "reply", reply: UI.shown, replyKind: "repeat" }, { selected: null });
  }

  const claim = pol.claims[run.claim];
  if (!claim) return state;
  let gauge = run.gauge;
  let reply = claim.twist;
  let kind: Run["replyKind"] = "twist";
  if (clue.decoy) {
    gauge += 2;
    reply = UI.pub;
    kind = "decoy";
  } else if (claim.right.includes(clue.id)) {
    gauge -= 2;
    reply = claim.corner;
    kind = "corner";
  } else {
    gauge += 2;
  }
  gauge = Math.max(0, Math.min(GAUGE_MAX, gauge));
  return withRun(
    state,
    { shown: [...run.shown, clueId], gauge, phase: "reply", reply, replyKind: kind },
    { selected: null },
  );
}

function openCard(state: GameState, clueId: string, from: Screen): GameState {
  return { ...state, screen: "card", cardId: clueId, cardFrom: from, notice: null };
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.t) {
    case "hover":
      return { ...state, hover: action.id, cursor: { x: action.x, y: action.y } };
    case "enter":
      if (state.screen !== "title") return state;
      return { ...state, screen: "select", moves: 1, notice: null };
    case "theme": {
      if (state.screen !== "select") return state;
      const info = THEME_LIST.find((t) => t.id === action.id);
      if (!info?.open || !themeContent(action.id)) return { ...state, notice: UI.later };
      const theme = requireTheme(action.id);
      return {
        ...state,
        screen: "room",
        roomId: theme.startRoom,
        notice: null,
        selected: null,
        moves: state.moves + 1,
        run: {
          themeId: action.id,
          politicianId: "",
          collected: [],
          wasted: [],
          wastedAtEntry: 0,
          shown: [],
          claim: 0,
          gauge: GAUGE_START,
          phase: "claim",
          reply: null,
          replyKind: null,
        },
      };
    }
    case "hotspot": {
      if (state.screen !== "room" || !state.run) return state;
      const theme = requireTheme(state.run.themeId);
      const room = theme.rooms.find((r) => r.id === state.roomId);
      const spot = room?.hotspots.find((h) => h.id === action.id);
      if (!spot) return state;
      if (spot.clueId) {
        if (state.run.collected.includes(spot.clueId)) return { ...state, notice: UI.deja };
        return openCard(
          withRun(state, { collected: [...state.run.collected, spot.clueId] }),
          spot.clueId,
          "room",
        );
      }
      if (spot.npcId) return { ...state, screen: "hint", hintId: spot.npcId, notice: null };
      if (spot.to === "@face") return enterFace(state, false);
      if (spot.to) return { ...state, roomId: spot.to, moves: state.moves + 1, notice: null, hover: null };
      return state;
    }
    case "icon": {
      if (!state.run) return state;
      const from = state.screen;
      if (from !== "room" && from !== "face" && from !== "card") return state;
      if (from === "face" && state.run.phase === "claim") {
        if (state.selected === action.id) return openCard(state, action.id, "face");
        return { ...state, selected: action.id, notice: null };
      }
      return openCard(state, action.id, from === "card" ? state.cardFrom ?? "room" : from);
    }
    case "use":
      return useClue(state, action.id);
    case "face": {
      if (state.screen !== "face" || !state.run) return state;
      if (state.run.phase === "reply") return afterReply(state);
      if (state.run.phase === "concede") return { ...state, screen: "result", notice: null };
      if (state.selected) return useClue(state, state.selected);
      return { ...state, notice: inventory(state.run).length ? UI.pick : UI.empty };
    }
    case "advance":
      if (state.screen === "face" && state.run?.phase === "reply") return afterReply(state);
      if (state.screen === "face" && state.run?.phase === "concede") {
        return { ...state, screen: "result", notice: null };
      }
      if (state.screen === "hint") return { ...state, screen: "room", hintId: null };
      return state;
    case "assez": {
      const pol = politicianOf(state);
      if (state.screen !== "face" || !pol?.honest) return state;
      return { ...state, screen: "result", notice: null };
    }
    case "laisser":
      if (state.screen !== "face" || politicianOf(state)?.honest) return state;
      return goDefeat(state);
    case "close":
      if (state.screen === "card") return { ...state, screen: state.cardFrom ?? "room", notice: null };
      if (state.screen === "sources") return { ...state, screen: state.sourceFrom ?? "card", notice: null };
      if (state.screen === "hint") return { ...state, screen: "room", hintId: null };
      if (state.screen === "note") return { ...state, screen: state.noteFrom ?? "select", notePage: 0 };
      return state;
    case "sources": {
      if (state.screen === "card" && state.cardId) {
        return { ...state, screen: "sources", sourceKind: "clue", sourceFrom: "card" };
      }
      if (state.screen === "face") {
        return { ...state, screen: "sources", sourceKind: "claim", sourceFrom: "face", cardId: state.cardId };
      }
      return state;
    }
    case "next":
      if (state.screen !== "result") return state;
      return enterFace(state, true);
    case "retry": {
      if (state.screen !== "defeat" || !state.run) return state;
      const theme = requireTheme(state.run.themeId);
      const back = theme.rooms.some((r) => r.id === "regie") ? "regie" : theme.startRoom;
      return withRun(state, { shown: [], claim: 0, gauge: GAUGE_START, phase: "claim", reply: null, replyKind: null }, {
        screen: "room",
        roomId: back,
        selected: null,
        notice: null,
      });
    }
    case "note":
      if (state.screen === "note" || state.screen === "pause") return state;
      return { ...state, screen: "note", noteFrom: state.screen, notePage: 0 };
    case "note-page":
      if (state.screen !== "note") return state;
      return { ...state, notePage: state.notePage === 0 ? 1 : 0 };
    case "pause":
      if (state.screen === "pause" || state.screen === "title") return state;
      return { ...state, screen: "pause", under: state.screen };
    case "resume":
      if (state.screen !== "pause") return state;
      return { ...state, screen: state.under ?? "select", under: null };
    case "restart":
      return { ...newGame(rand(state.rng).seed), screen: "select", moves: 1 };
    default:
      return state;
  }
}

export function urlAt(state: GameState, x: number, y: number): string | null {
  if (state.screen !== "sources") return null;
  const sources = activeSources(state);
  for (let i = 0; i < sources.length; i++) {
    if (inside(sourceOpenRect(i), x, y)) return sources[i].url;
  }
  return null;
}

export function actAt(state: GameState, x: number, y: number): GameState {
  if (inside(NOTE_BTN, x, y) && state.screen !== "title" && state.screen !== "note" && state.screen !== "pause") {
    return reduce(state, { t: "note" });
  }

  if (state.screen === "title") return reduce(state, { t: "enter" });

  if (state.screen === "select") {
    if (inside(SELECT_NOTE, x, y)) return reduce(state, { t: "note" });
    for (let i = 0; i < THEME_LIST.length; i++) {
      if (inside(themeRect(i), x, y)) return reduce(state, { t: "theme", id: THEME_LIST[i].id });
    }
    return state;
  }

  if (state.screen === "note") {
    if (inside(NOTE_BACK, x, y)) return reduce(state, { t: "close" });
    if (inside(NOTE_PHOTOS, x, y)) return reduce(state, { t: "note-page" });
    return state;
  }

  if (state.screen === "pause") {
    if (inside(PAUSE_RESUME, x, y)) return reduce(state, { t: "resume" });
    if (inside(PAUSE_RESTART, x, y)) return reduce(state, { t: "restart" });
    return state;
  }

  if (state.screen === "defeat") return reduce(state, { t: "retry" });
  if (state.screen === "result") {
    if (inside(NEXT_BTN, x, y)) return reduce(state, { t: "next" });
    return state;
  }
  if (state.screen === "hint") return reduce(state, { t: "advance" });

  if (state.screen === "card") {
    if (inside(CARD_CLOSE, x, y)) return reduce(state, { t: "close" });
    if (inside(CARD_SOURCE, x, y)) return reduce(state, { t: "sources" });
  }

  if (state.screen === "sources") {
    if (urlAt(state, x, y)) return state;
    if (inside(SOURCE_CLOSE, x, y)) return reduce(state, { t: "close" });
    return state;
  }

  if (state.run && y >= 166 && (state.screen === "room" || state.screen === "face" || state.screen === "card")) {
    const items = inventory(state.run);
    for (let i = 0; i < items.length && i < 9; i++) {
      if (inside(iconRect(i), x, y)) return reduce(state, { t: "icon", id: items[i] });
    }
  }

  if (state.screen === "room" && state.run) {
    const room = requireTheme(state.run.themeId).rooms.find((r) => r.id === state.roomId);
    const spots = room?.hotspots ?? [];
    for (let i = spots.length - 1; i >= 0; i--) {
      const spot = spots[i];
      if (inside(spot, x, y)) return reduce(state, { t: "hotspot", id: spot.id });
    }
    return { ...state, notice: null };
  }

  if (state.screen === "face" && state.run) {
    const honest = politicianOf(state)?.honest ?? false;
    if (honest && inside(ASSEZ, x, y) && state.run.phase === "claim") return reduce(state, { t: "assez" });
    if (!honest && inventory(state.run).length === 0 && inside(ASSEZ, x, y)) return reduce(state, { t: "laisser" });
    if (inside(FACE_SOURCE, x, y)) return reduce(state, { t: "sources" });
    if (inside(FACE_IMG, x, y)) return reduce(state, { t: "face" });
    if (inside(RIGHT_COL, x, y) && (state.run.phase === "reply" || state.run.phase === "concede")) {
      return reduce(state, { t: "advance" });
    }
    if (inside(RIGHT_COL, x, y) && state.run.phase === "claim") return reduce(state, { t: "face" });
  }

  return state;
}

export function hoverAt(state: GameState, x: number, y: number): GameState {
  let id: string | null = null;
  if (state.screen === "room" && state.run) {
    const room = themeContent(state.run.themeId)?.rooms.find((r) => r.id === state.roomId);
    const spots = room?.hotspots ?? [];
    for (let i = spots.length - 1; i >= 0; i--) {
      if (inside(spots[i], x, y)) {
        id = spots[i].id;
        break;
      }
    }
  }
  return reduce(state, { t: "hover", id, x, y });
}

const CLOCKS = ["20:40", "20:55", "21:05", "21:20", "21:40", "21:55", "22:10"];

export function clockOf(state: GameState): string {
  if (state.screen === "defeat") return UI.clockOff;
  return CLOCKS[Math.min(CLOCKS.length - 1, state.moves)];
}

export function captionOf(state: GameState): string {
  if (state.screen === "title" || state.screen === "select") return UI.dossiers;
  if (state.screen === "card" || state.screen === "sources") return UI.preuves;
  if (state.screen === "defeat") return UI.dark;
  if (state.screen === "pause" || state.screen === "note") return UI.pause;
  if (state.screen === "face" || state.screen === "result") {
    const name = politicianOf(state)?.name ?? "";
    return UI.face + name;
  }
  const theme = themeOf(state);
  const room = theme?.rooms.find((r) => r.id === state.roomId);
  if (state.hover && room) {
    const spot = room.hotspots.find((h) => h.id === state.hover);
    if (spot) return spot.label;
  }
  return room?.name ?? UI.dossiers;
}

export function demoState(kind: string, face = "philippe", ending = "facture"): GameState {
  let state = newGame(1);
  state = reduce(state, { t: "enter" });
  state = reduce(state, { t: "theme", id: "nucleaire" });
  const theme = requireTheme("nucleaire");
  state = withRun(state, { collected: theme.clues.map((c) => c.id), politicianId: face });
  if (kind === "room") {
    return { ...state, screen: "room", roomId: "bureau", moves: 2, cursor: { x: 120, y: 124 }, run: { ...state.run!, collected: [] } };
  }
  if (kind === "card") {
    return { ...state, screen: "card", cardId: "video2020", cardFrom: "room", moves: 3 };
  }
  if (kind === "face") {
    return withRun(state, { politicianId: face, phase: "claim", claim: 0, gauge: GAUGE_START, shown: [] }, {
      screen: "face",
      moves: 4,
      selected: "echos2017",
    });
  }
  if (kind === "defeat") {
    return { ...state, screen: "defeat", defeatKind: ending === "vert" ? "vert" : "facture", moves: 5 };
  }
  return state;
}
