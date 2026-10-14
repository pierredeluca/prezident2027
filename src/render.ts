import { PHOTO_LINES, UI, DISCLAIMER } from "./content/copy";
import { THEME_LIST } from "./content/themes";
import type { Clue } from "./content/types";
import {
  AMBER,
  BLK,
  BLUE,
  BR0,
  BR1,
  BR2,
  BR3,
  C,
  CREAM,
  DARK,
  INK,
  PAPER,
  RED,
  WHITE,
  type RGB,
} from "./colors";
import { block, text, textScale, wrap } from "./font";
import {
  ASSEZ,
  CARD_CLOSE,
  CARD_SOURCE,
  FACE_SOURCE,
  iconRect,
  NEXT_BTN,
  NOTE_BACK,
  NOTE_BTN,
  NOTE_PHOTOS,
  PAUSE_RESTART,
  PAUSE_RESUME,
  SELECT_NOTE,
  SOURCE_CLOSE,
  SOURCE_STEP,
  SOURCE_TOP,
  sourceOpenRect,
  themeRect,
  type Rect,
} from "./layout";
import { activeSources, captionOf, clockOf, GAUGE_MAX, inventory, outcomeLine, politicianOf, themeOf, type GameState } from "./logic";
import { mix, Pix, type RgbImage } from "./pix";

export interface Assets {
  bg: Record<string, RgbImage>;
  faces: Record<string, RgbImage>;
}

export interface Drag {
  id: string;
  x: number;
  y: number;
}

function button(pix: Pix, r: Rect, label: string) {
  pix.bevel(r.x, r.y, r.w, r.h, BR1, BR3, BR0);
  text(pix, r.x + 4, r.y + 3, label, CREAM, r.x + r.w - 2);
}

function dark(pix: Pix) {
  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 320; x++) {
      const t = y / 160;
      const side = Math.abs(x - 150) / 180;
      pix.pset(x, y, mix(x, y, DARK, BR0, 0.25 + t * 0.35 + side * 0.2));
    }
  }
}

function corners(pix: Pix, x: number, y: number, w: number, h: number, c: RGB) {
  const x1 = x + w - 1;
  const y1 = y + h - 1;
  for (let i = 0; i < 5; i++) {
    pix.pset(x + i, y, c);
    pix.pset(x, y + i, c);
    pix.pset(x1 - i, y, c);
    pix.pset(x1, y + i, c);
    pix.pset(x + i, y1, c);
    pix.pset(x, y1 - i, c);
    pix.pset(x1 - i, y1, c);
    pix.pset(x1, y1 - i, c);
  }
}

function playMark(pix: Pix, x: number, y: number) {
  for (let i = 0; i < 7; i++) {
    pix.hline(x, y + i, 2 + i, WHITE);
    pix.hline(x, y + 12 - i, 2 + i, WHITE);
  }
}

function clueIcon(pix: Pix, x: number, y: number, kind: Clue["kind"]) {
  if (kind === "video") {
    pix.rect(x, y, 8, 10, BLK);
    pix.hline(x + 2, y + 4, 2, WHITE);
    pix.hline(x + 2, y + 5, 3, WHITE);
    pix.hline(x + 2, y + 6, 2, WHITE);
    return;
  }
  if (kind === "chart") {
    pix.rect(x, y, 8, 10, BR0);
    pix.rect(x + 1, y + 6, 2, 3, AMBER);
    pix.rect(x + 4, y + 3, 2, 6, CREAM);
    return;
  }
  if (kind === "book") {
    pix.rect(x, y, 8, 10, BLUE);
    pix.vline(x, y, 10, WHITE);
    return;
  }
  if (kind === "flyer") {
    pix.rect(x, y, 8, 10, RED);
    pix.hline(x, y, 8, WHITE);
    return;
  }
  pix.rect(x, y, 8, 10, PAPER);
  pix.hline(x, y, 8, WHITE);
}

function bar(pix: Pix, state: GameState) {
  pix.bevel(0, 160, 320, 40, BR1, BR3, BR0);
  pix.hline(1, 161, 318, BR2);
  pix.bevel(2, 166, 108, 28, BR0, BR0, BR3, true);
  const theme = themeOf(state);
  const run = state.run;
  if (theme && run && (state.screen === "room" || state.screen === "face" || state.screen === "card" || state.screen === "result")) {
    const items = inventory(run);
    items.slice(0, 9).forEach((id, i) => {
      const clue = theme.clues.find((c) => c.id === id);
      if (!clue) return;
      const r = iconRect(i);
      if (state.selected === id) pix.rect(r.x - 1, r.y - 1, r.w + 2, r.h + 2, AMBER);
      clueIcon(pix, r.x + 1, r.y + 2, clue.kind);
      if (run.shown.includes(id)) pix.hline(r.x, r.y + 13, 8, RED);
    });
  }
  text(pix, 114, 176, captionOf(state), RED, 228);
  pix.bevel(NOTE_BTN.x, NOTE_BTN.y, NOTE_BTN.w, NOTE_BTN.h, BR2, BR3, BR0);
  text(pix, NOTE_BTN.x + 6, NOTE_BTN.y + 4, "i", CREAM, 250);
  pix.bevel(250, 168, 66, 22, BR0, BR0, BR3, true);
  text(pix, 258, 174, clockOf(state), CREAM, 312);
}

function cursor(pix: Pix, x: number, y: number) {
  const rows = ["1.......", "11......", "121.....", "1221....", "12221...", "122221..", "1221221.", "121.122.", "11..121.", "1....11.", "......1."];
  rows.forEach((bits, row) => {
    for (let col = 0; col < bits.length; col++) {
      const bit = bits[col];
      if (bit === "1") pix.pset(x + col, y + row, BLK);
      else if (bit === "2") pix.pset(x + col, y + row, WHITE);
    }
  });
}

function frame(pix: Pix, state: GameState, drag: Drag | null, assets: Assets) {
  bar(pix, state);
  if (drag && state.run) {
    const clue = themeOf(state)?.clues.find((c) => c.id === drag.id);
    if (clue) clueIcon(pix, drag.x, drag.y, clue.kind);
  }
  if (state.cursor) cursor(pix, state.cursor.x, state.cursor.y);
}

function drawTitle(pix: Pix) {
  dark(pix);
  textScale(pix, 36, 12, UI.titleA, CREAM, 2, 300);
  textScale(pix, 36, 32, UI.titleB, CREAM, 2, 300);
  text(pix, 36, 54, UI.date, AMBER, 300);
  block(pix, 36, 68, DISCLAIMER, INK, 250, 8);
  text(pix, 36, 142, UI.enter, CREAM, 300);
}

function drawSelect(pix: Pix, state: GameState) {
  dark(pix);
  pix.bevel(36, 16, 248, 136, BR0, BR0, BR3, true);
  pix.rect(40, 20, 240, 128, C(8, 4, 2));
  text(pix, 48, 26, UI.choose, AMBER, 280);
  pix.hline(48, 36, 120, BR2);
  THEME_LIST.forEach((theme, i) => {
    const r = themeRect(i);
    if (theme.open) {
      pix.rect(r.x, r.y, r.w, r.h, BR2);
      text(pix, r.x + 6, r.y + 2, "> " + theme.title, C(8, 4, 2), 270);
    } else {
      text(pix, r.x + 16, r.y + 2, theme.title, INK, 270);
    }
  });
  if (state.notice) text(pix, 48, 132, state.notice, RED, 280);
  else text(pix, SELECT_NOTE.x, SELECT_NOTE.y, UI.note, AMBER, 120);
}

function drawRoom(pix: Pix, state: GameState, assets: Assets) {
  const bg = assets.bg[state.roomId];
  if (bg) pix.blit(bg, 0, 0);
  else dark(pix);
  const theme = themeOf(state);
  const room = theme?.rooms.find((r) => r.id === state.roomId);
  room?.hotspots.forEach((spot) => {
    const taken = spot.clueId ? state.run?.collected.includes(spot.clueId) : false;
    const hot = state.hover === spot.id ? WHITE : taken ? BR2 : AMBER;
    corners(pix, spot.x, spot.y, spot.w, spot.h, hot);
  });
  const line = state.notice ?? (state.run && state.run.collected.length === 0 ? UI.help : null);
  if (line) text(pix, 8, 6, line, CREAM, 300);
}

function drawCard(pix: Pix, state: GameState, assets: Assets) {
  dark(pix);
  pix.bevel(10, 6, 300, 148, BR2, BR3, BR0);
  pix.rect(14, 10, 292, 140, C(12, 8, 4));
  const clue = themeOf(state)?.clues.find((c) => c.id === state.cardId);
  if (!clue) return;
  pix.bevel(20, 16, 118, 100, BLK, BR0, BR3, true);
  if (clue.kind === "video" && clue.still && assets.faces[clue.still]) {
    pix.blitBox(assets.faces[clue.still], 24, 20, 110, 78);
    playMark(pix, 70, 48);
  } else if (clue.kind === "book") {
    pix.rect(36, 28, 80, 70, BLUE);
    text(pix, 48, 50, "2050", WHITE, 120);
  } else if (clue.kind === "chart") {
    pix.rect(40, 36, 10, 40, AMBER);
    pix.rect(56, 48, 10, 28, CREAM);
    pix.rect(72, 28, 10, 48, AMBER);
    pix.rect(88, 44, 10, 32, CREAM);
  } else if (clue.kind === "flyer") {
    pix.rect(36, 28, 84, 70, RED);
    text(pix, 48, 54, "PUB", WHITE, 120);
  } else {
    pix.rect(36, 28, 84, 70, PAPER);
    text(pix, 42, 36, clue.date || "NOTE", INK, 120);
  }
  let y = 20;
  if (clue.date) {
    text(pix, 148, y, clue.date, AMBER, 300);
    y += 12;
  }
  y = block(pix, 148, y, clue.quote, CREAM, 148, 9);
  y += 4;
  text(pix, 148, y, UI.proves, AMBER, 300);
  y += 10;
  block(pix, 148, y, clue.proves, WHITE, 148, 9);
  button(pix, CARD_CLOSE, UI.close);
  button(pix, CARD_SOURCE, UI.source);
}

function drawSources(pix: Pix, state: GameState) {
  dark(pix);
  pix.bevel(10, 6, 300, 148, BR2, BR3, BR0);
  pix.rect(14, 10, 292, 140, C(10, 7, 4));
  const sources = activeSources(state);
  if (!sources.length) {
    block(pix, 24, 36, UI.none, CREAM, 260, 9);
  }
  sources.forEach((source, i) => {
    const y = SOURCE_TOP + i * SOURCE_STEP;
    text(pix, 22, y, source.outlet, AMBER, 300);
    text(pix, 22, y + 10, source.date, CREAM, 300);
    const rows = wrap(source.note, 270).slice(0, 2);
    rows.forEach((row, n) => text(pix, 22, y + 20 + n * 8, row, INK, 300));
    button(pix, sourceOpenRect(i), UI.open);
  });
  button(pix, SOURCE_CLOSE, UI.close);
}

function drawHint(pix: Pix, state: GameState) {
  dark(pix);
  const npc = themeOf(state)?.npcs.find((n) => n.id === state.hintId);
  pix.bevel(30, 40, 260, 80, BR1, BR3, BR0);
  pix.rect(34, 44, 252, 72, C(12, 8, 4));
  text(pix, 42, 50, npc?.name ?? "", AMBER, 280);
  if (npc) block(pix, 42, 64, npc.line, CREAM, 230, 9);
  text(pix, 42, 100, UI.suit, INK, 100);
}

function drawGauge(pix: Pix, gauge: number) {
  text(pix, 212, 116, UI.gauge, CREAM, 316);
  pix.bevel(212, 128, 100, 12, BR0, BR0, BR3, true);
  const inner = 96;
  const mark = 214 + Math.round((gauge / GAUGE_MAX) * inner);
  if (mark > 214) pix.rect(214, 130, mark - 214, 8, AMBER);
  if (mark < 214 + inner) pix.rect(mark, 130, 214 + inner - mark, 8, RED);
  pix.vline(mark, 129, 10, WHITE);
  text(pix, 212, 142, UI.you, CREAM, 250);
  text(pix, 280, 142, UI.him, RED, 316);
}

function drawFace(pix: Pix, state: GameState, assets: Assets) {
  dark(pix);
  const pol = politicianOf(state);
  const face = pol ? assets.faces[pol.id] : undefined;
  if (face) pix.blit(face, 0, 2, 28);
  if (!pol || !state.run) return;
  const run = state.run;
  let body = pol.honest ? pol.line : (pol.claims[run.claim]?.text ?? "");
  let label: string = UI.says;
  let color: RGB = WHITE;
  if (run.phase === "reply" && run.reply) {
    label = UI.answers;
    body = run.reply;
    color = run.replyKind === "corner" || run.replyKind === "honest" ? AMBER : RED;
  } else if (run.phase === "concede") {
    label = UI.concedes;
    body = pol.concede;
    color = CREAM;
  }
  text(pix, 212, 8, label, CREAM, 316);
  const end = block(pix, 212, 18, body, color, 100, 9);
  if (run.phase !== "claim" && end < 96) text(pix, 212, end + 2, UI.suit, INK, 316);
  if (pol.honest && run.phase === "claim") button(pix, ASSEZ, UI.assez);
  if (!pol.honest && inventory(run).length === 0 && run.phase === "claim") button(pix, ASSEZ, UI.laisser);
  button(pix, FACE_SOURCE, UI.source);
  drawGauge(pix, run.gauge);
  if (state.notice) text(pix, 212, 104, state.notice, RED, 316);
}

function drawResult(pix: Pix, state: GameState) {
  dark(pix);
  block(pix, 28, 48, outcomeLine(state), CREAM, 260, 12);
  button(pix, NEXT_BTN, UI.next);
}

function drawDefeat(pix: Pix, state: GameState, assets: Assets) {
  const key = state.defeatKind === "vert" ? "defeat2" : "defeat";
  const bg = assets.bg[key];
  if (bg) pix.blit(bg, 0, 0);
  else pix.rect(0, 0, 320, 160, BLK);
  text(pix, 200, 146, UI.retry, CREAM, 316);
}

function drawNote(pix: Pix, state: GameState) {
  dark(pix);
  pix.bevel(12, 8, 296, 146, BR1, BR3, BR0);
  pix.rect(16, 12, 288, 138, C(10, 6, 3));
  if (state.notePage === 0) block(pix, 22, 18, DISCLAIMER, CREAM, 270, 8);
  else {
    text(pix, 22, 18, UI.photoIntro, AMBER, 300);
    PHOTO_LINES.forEach((line, i) => text(pix, 22, 36 + i * 10, line, i % 2 ? INK : CREAM, 300));
  }
  button(pix, NOTE_BACK, UI.back);
  button(pix, NOTE_PHOTOS, UI.photos);
}

function drawPause(pix: Pix) {
  dark(pix);
  pix.bevel(16, 12, 288, 140, BR1, BR3, BR0);
  pix.rect(20, 16, 280, 132, C(10, 6, 3));
  text(pix, 28, 22, UI.pause, AMBER, 200);
  block(pix, 28, 36, DISCLAIMER, CREAM, 250, 8);
  button(pix, PAUSE_RESUME, UI.resume);
  button(pix, PAUSE_RESTART, UI.restart);
}

export function draw(pix: Pix, state: GameState, assets: Assets, drag: Drag | null = null) {
  pix.clear(BLK);
  switch (state.screen) {
    case "title":
      drawTitle(pix);
      break;
    case "select":
      drawSelect(pix, state);
      break;
    case "room":
      drawRoom(pix, state, assets);
      break;
    case "card":
      drawCard(pix, state, assets);
      break;
    case "sources":
      drawSources(pix, state);
      break;
    case "hint":
      drawHint(pix, state);
      break;
    case "face":
      drawFace(pix, state, assets);
      break;
    case "result":
      drawResult(pix, state);
      break;
    case "defeat":
      drawDefeat(pix, state, assets);
      break;
    case "note":
      drawNote(pix, state);
      break;
    case "pause":
      drawPause(pix);
      break;
    default:
      dark(pix);
  }
  frame(pix, state, drag, assets);
}
