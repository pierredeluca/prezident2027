import type { RGB } from "./colors";
import { FONT } from "./font.data";
import type { Pix } from "./pix";

export function hasGlyph(ch: string): boolean {
  return Object.prototype.hasOwnProperty.call(FONT, ch);
}

export function measure(s: string): number {
  let w = 0;
  for (const ch of s) {
    const g = FONT[ch];
    if (!g) throw new Error(`missing glyph ${JSON.stringify(ch)} in ${JSON.stringify(s)}`);
    w += g[0].length + 1;
  }
  return Math.max(0, w - (s.length ? 1 : 0));
}

export function text(pix: Pix, x: number, y: number, s: string, color: RGB, limit = 319): number {
  let cx = x;
  for (const ch of s) {
    const g = FONT[ch];
    if (!g) throw new Error(`missing glyph ${JSON.stringify(ch)} in ${JSON.stringify(s)}`);
    const gw = g[0].length;
    if (cx + gw > limit) return cx;
    for (let row = 0; row < g.length; row++) {
      const bits = g[row];
      for (let col = 0; col < bits.length; col++) {
        if (bits[col] === "1") pix.pset(cx + col, y + row, color);
      }
    }
    cx += gw + 1;
  }
  return cx;
}

export function textScale(pix: Pix, x: number, y: number, s: string, color: RGB, scale: number, limit = 319) {
  let cx = x;
  for (const ch of s) {
    const g = FONT[ch];
    if (!g) throw new Error(`missing glyph ${JSON.stringify(ch)} in ${JSON.stringify(s)}`);
    const gw = g[0].length * scale;
    if (cx + gw > limit) return;
    for (let row = 0; row < g.length; row++) {
      const bits = g[row];
      for (let col = 0; col < bits.length; col++) {
        if (bits[col] !== "1") continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) pix.pset(cx + col * scale + dx, y + row * scale + dy, color);
        }
      }
    }
    cx += gw + scale;
  }
}

export function wrap(s: string, maxW: number): string[] {
  const words = s.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (measure(next) <= maxW) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function block(pix: Pix, x: number, y: number, s: string, color: RGB, maxW: number, step = 9): number {
  const rows = wrap(s, maxW);
  rows.forEach((row, i) => text(pix, x, y + i * step, row, color, x + maxW));
  return y + rows.length * step;
}
