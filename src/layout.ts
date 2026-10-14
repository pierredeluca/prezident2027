export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function inside(r: Rect, x: number, y: number): boolean {
  return x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
}

export const THEME_X = 46;
export const THEME_Y = 46;
export const THEME_H = 12;
export const THEME_W = 220;

export function themeRect(i: number): Rect {
  return { x: THEME_X, y: THEME_Y + i * THEME_H, w: THEME_W, h: THEME_H };
}

export const SELECT_NOTE: Rect = { x: 48, y: 130, w: 40, h: 12 };
export const NOTE_BTN: Rect = { x: 230, y: 170, w: 16, h: 16 };

export function iconRect(i: number): Rect {
  return { x: 6 + i * 11, y: 171, w: 10, h: 14 };
}

export const CARD_CLOSE: Rect = { x: 22, y: 132, w: 58, h: 14 };
export const CARD_SOURCE: Rect = { x: 88, y: 132, w: 58, h: 14 };

export const SOURCE_TOP = 24;
export const SOURCE_STEP = 50;
export function sourceOpenRect(i: number): Rect {
  return { x: 22, y: SOURCE_TOP + i * SOURCE_STEP + 36, w: 58, h: 12 };
}
export const SOURCE_CLOSE: Rect = { x: 230, y: 136, w: 64, h: 14 };

export const ASSEZ: Rect = { x: 212, y: 78, w: 50, h: 14 };
export const FACE_SOURCE: Rect = { x: 266, y: 78, w: 48, h: 14 };
export const FACE_IMG: Rect = { x: 0, y: 2, w: 200, h: 156 };
export const RIGHT_COL: Rect = { x: 206, y: 0, w: 114, h: 160 };

export const NEXT_BTN: Rect = { x: 78, y: 112, w: 164, h: 18 };
export const NOTE_BACK: Rect = { x: 22, y: 136, w: 64, h: 14 };
export const NOTE_PHOTOS: Rect = { x: 96, y: 136, w: 64, h: 14 };
export const PAUSE_RESUME: Rect = { x: 36, y: 128, w: 110, h: 16 };
export const PAUSE_RESTART: Rect = { x: 160, y: 128, w: 124, h: 16 };
