import { BLK, DARK, type RGB } from "./colors";

export interface RgbImage {
  w: number;
  h: number;
  rgba: Uint8ClampedArray;
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function mix(x: number, y: number, a: RGB, b: RGB, t: number): RGB {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return BAYER[y & 3][x & 3] < t * 16 ? b : a;
}

export class Pix {
  readonly w = 320;
  readonly h = 200;
  readonly buf = new Uint8ClampedArray(320 * 200 * 4);

  clear(c: RGB = BLK) {
    for (let i = 0; i < this.buf.length; i += 4) {
      this.buf[i] = c[0];
      this.buf[i + 1] = c[1];
      this.buf[i + 2] = c[2];
      this.buf[i + 3] = 255;
    }
  }

  pset(x: number, y: number, c: RGB | null) {
    if (!c) return;
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    this.buf[i] = c[0];
    this.buf[i + 1] = c[1];
    this.buf[i + 2] = c[2];
    this.buf[i + 3] = 255;
  }

  rect(x: number, y: number, w: number, h: number, c: RGB) {
    for (let yy = y | 0; yy < (y | 0) + (h | 0); yy++) {
      for (let xx = x | 0; xx < (x | 0) + (w | 0); xx++) this.pset(xx, yy, c);
    }
  }

  hline(x: number, y: number, w: number, c: RGB) {
    for (let xx = x | 0; xx < (x | 0) + (w | 0); xx++) this.pset(xx, y | 0, c);
  }

  vline(x: number, y: number, h: number, c: RGB) {
    for (let yy = y | 0; yy < (y | 0) + (h | 0); yy++) this.pset(x | 0, yy, c);
  }

  bevel(x: number, y: number, w: number, h: number, fill: RGB, lit: RGB, dark: RGB, inset = false) {
    this.rect(x, y, w, h, fill);
    const a = inset ? dark : lit;
    const b = inset ? lit : dark;
    this.hline(x, y, w, a);
    this.vline(x, y, h, a);
    if (h > 1) this.hline(x, y + h - 1, w, b);
    if (w > 1) this.vline(x + w - 1, y, h, b);
  }

  blit(img: RgbImage, x0: number, y0: number, fadeRight = 0) {
    for (let y = 0; y < img.h; y++) {
      for (let x = 0; x < img.w; x++) {
        const i = (y * img.w + x) * 4;
        let c: RGB = [img.rgba[i], img.rgba[i + 1], img.rgba[i + 2]];
        if (fadeRight && x > img.w - fadeRight) {
          const k = (x - (img.w - fadeRight)) / fadeRight;
          c = mix(x0 + x, y0 + y, c, DARK, k);
        }
        this.pset(x0 + x, y0 + y, c);
      }
    }
  }

  blitBox(img: RgbImage, x0: number, y0: number, w: number, h: number) {
    for (let y = 0; y < h; y++) {
      const sy = Math.min(img.h - 1, Math.floor((y * img.h) / h));
      for (let x = 0; x < w; x++) {
        const sx = Math.min(img.w - 1, Math.floor((x * img.w) / w));
        const i = (sy * img.w + sx) * 4;
        this.pset(x0 + x, y0 + y, [img.rgba[i], img.rgba[i + 1], img.rgba[i + 2]]);
      }
    }
  }

  flush(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(new ImageData(this.buf, this.w, this.h), 0, 0);
  }
}
