import { iconRect } from "./layout";
import { actAt, demoState, hoverAt, inventory, newGame, reduce, urlAt, type Action, type GameState } from "./logic";
import { Pix, type RgbImage } from "./pix";
import { draw, type Assets, type Drag } from "./render";
import "./style.css";

const SAVE = "le-grand-ecart-v2";

async function loadImage(src: string): Promise<RgbImage> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height);
  return { w: img.width, h: img.height, rgba: data.data };
}

function fit(canvas: HTMLCanvasElement) {
  const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / 320, window.innerHeight / 200)));
  canvas.style.width = `${320 * scale}px`;
  canvas.style.height = `${200 * scale}px`;
}

function pos(canvas: HTMLCanvasElement, event: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(((event.clientX - rect.left) * 320) / rect.width),
    y: Math.floor(((event.clientY - rect.top) * 200) / rect.height),
  };
}

function iconAt(state: GameState, x: number, y: number): string | null {
  if (!state.run || (state.screen !== "face" && state.screen !== "room")) return null;
  const items = inventory(state.run);
  for (let i = 0; i < items.length && i < 9; i++) {
    const rect = iconRect(i);
    if (x >= rect.x && y >= rect.y && x < rect.x + rect.w && y < rect.y + rect.h) return items[i];
  }
  return null;
}

function readSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; state?: GameState };
    if (parsed.v !== 2 || !parsed.state?.screen) return null;
    return { ...parsed.state, cursor: null };
  } catch {
    return null;
  }
}

function writeSave(state: GameState, demo: boolean) {
  if (demo) return;
  const { cursor: _cursor, ...rest } = state;
  localStorage.setItem(SAVE, JSON.stringify({ v: 2, state: rest }));
}

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#vga");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const pix = new Pix();
  const base = import.meta.env.BASE_URL;
  const faceIds = ["philippe", "lepen", "melenchon", "lisnard"];
  const bgIds = ["bureau", "archives", "regie", "defeat", "defeat2"];
  const faces: Record<string, RgbImage> = {};
  const bg: Record<string, RgbImage> = {};
  await Promise.all([
    ...faceIds.map(async (id) => {
      faces[id] = await loadImage(`${base}faces/${id}.png`);
    }),
    ...bgIds.map(async (id) => {
      bg[id] = await loadImage(`${base}bg/${id}.png`);
    }),
  ]);
  const assets: Assets = { faces, bg };
  const params = new URLSearchParams(location.search);
  const demo = params.get("demo");
  const fresh = params.has("new");
  if (fresh) localStorage.removeItem(SAVE);
  let state: GameState = demo
    ? demoState(demo, params.get("face") || "philippe", params.get("ending") || "facture")
    : fresh
      ? newGame((Date.now() >>> 0) || 1)
      : (readSave() ?? newGame((Date.now() >>> 0) || 1));
  let drag: Drag | null = null;
  let down: { x: number; y: number; moved: boolean } | null = null;

  const paint = () => {
    draw(pix, state, assets, drag);
    pix.flush(ctx);
  };
  const show = (next: GameState, save: boolean) => {
    state = next;
    if (save) writeSave(state, Boolean(demo));
    paint();
  };

  fit(canvas);
  window.addEventListener("resize", () => {
    fit(canvas);
    paint();
  });
  paint();

  canvas.addEventListener("pointerdown", (event) => {
    canvas.setPointerCapture(event.pointerId);
    const p = pos(canvas, event);
    const id = iconAt(state, p.x, p.y);
    down = { x: p.x, y: p.y, moved: false };
    if (id && state.screen === "face" && state.run?.phase === "claim") drag = { id, x: p.x, y: p.y };
  });

  canvas.addEventListener("pointermove", (event) => {
    const p = pos(canvas, event);
    if (down) {
      if (Math.abs(p.x - down.x) + Math.abs(p.y - down.y) > 4) down.moved = true;
      if (drag) drag = { ...drag, x: p.x, y: p.y };
      paint();
      return;
    }
    show(hoverAt(state, p.x, p.y), false);
  });

  canvas.addEventListener("pointerup", (event) => {
    const p = pos(canvas, event);
    const url = urlAt(state, p.x, p.y);
    if (url) window.open(url, "_blank", "noopener");
    if (down?.moved && drag && state.screen === "face" && p.x < 200 && p.y < 160) {
      show(reduce(state, { t: "use", id: drag.id }), true);
    } else if (!down?.moved) {
      show(actAt(state, p.x, p.y), true);
    } else {
      paint();
    }
    drag = null;
    down = null;
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const action: Action = state.screen === "pause" ? { t: "resume" } : { t: "pause" };
      show(reduce(state, action), true);
    }
    if (event.key === "Enter" && state.screen === "title") show(reduce(state, { t: "enter" }), true);
  });

  const api = {
    get state() {
      return state;
    },
    act(action: Action) {
      show(reduce(state, action), true);
    },
    click(x: number, y: number) {
      show(actAt(state, x, y), true);
    },
  };
  Object.assign(window, { __game: api, __ready: true });
}

void main();
