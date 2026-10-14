export type RGB = readonly [number, number, number];

export const C = (r: number, g: number, b: number): RGB =>
  [
    Math.max(0, Math.min(63, r)) * 4,
    Math.max(0, Math.min(63, g)) * 4,
    Math.max(0, Math.min(63, b)) * 4,
  ] as const;

export const BLK: RGB = C(0, 0, 0);
export const WHITE: RGB = C(58, 56, 50);
export const INK: RGB = C(46, 40, 30);
export const RED: RGB = C(46, 8, 6);
export const AMBER: RGB = C(54, 36, 10);
export const BR0: RGB = C(10, 6, 2);
export const BR1: RGB = C(18, 10, 4);
export const BR2: RGB = C(28, 16, 6);
export const BR3: RGB = C(40, 24, 10);
export const BR4: RGB = C(52, 34, 14);
export const CREAM: RGB = C(50, 42, 28);
export const PAPER: RGB = C(48, 42, 30);
export const DARK: RGB = C(4, 3, 2);
export const BLUE: RGB = C(8, 14, 32);
