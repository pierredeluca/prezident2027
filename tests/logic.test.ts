import { describe, expect, it } from "vitest";
import { DISCLAIMER, UI } from "../src/content/copy";
import { NUCLEAIRE } from "../src/content/nucleaire";
import { THEME_LIST } from "../src/content/themes";
import type { Clue } from "../src/content/types";
import { hasGlyph } from "../src/font";
import { actAt, demoState, GAUGE_START, inventory, newGame, outcomeLine, reduce, type GameState } from "../src/logic";
import { Pix } from "../src/pix";
import { draw } from "../src/render";

const emptyAssets = { bg: {}, faces: {} };

function paint(state: GameState) {
  draw(new Pix(), state, emptyAssets);
}

function face(id: string): GameState {
  let state = newGame(1);
  state = reduce(state, { t: "enter" });
  state = reduce(state, { t: "theme", id: "nucleaire" });
  state = {
    ...state,
    roomId: "regie",
    run: {
      ...state.run!,
      collected: NUCLEAIRE.clues.map((clue) => clue.id),
      politicianId: id,
    },
  };
  return reduce(state, { t: "hotspot", id: "door-face" });
}

describe("nucléaire", () => {
  it("keeps the satire line and refuses invented crimes", () => {
    const blob = JSON.stringify(NUCLEAIRE) + DISCLAIMER;
    expect(DISCLAIMER.toLowerCase()).toContain("œuvre de fiction satirique");
    expect(DISCLAIMER.toLowerCase()).toContain("aucun délit");
    expect(DISCLAIMER.toLowerCase()).toContain("position publique");
    expect(DISCLAIMER.toLowerCase()).toContain("culte");
    expect(DISCLAIMER.toLowerCase()).toContain("origine");
    expect(DISCLAIMER.toLowerCase()).toContain("groupe social");
    expect(blob.toLowerCase()).not.toContain("quoi qu'il en coûte");
    expect(blob.toLowerCase()).not.toContain("attal");
    expect(blob.toLowerCase()).not.toContain("corruption pénale");
  });

  it("is data-driven: only Nucléaire is open", () => {
    const open = THEME_LIST.filter((theme) => theme.open);
    expect(open.map((theme) => theme.id)).toEqual(["nucleaire"]);
    expect(THEME_LIST.length).toBeGreaterThan(1);
    expect(NUCLEAIRE.clues.filter((clue) => !clue.decoy).length).toBeGreaterThanOrEqual(6);
    expect(NUCLEAIRE.clues.filter((clue) => clue.decoy).length).toBeGreaterThanOrEqual(2);
    for (const pol of NUCLEAIRE.politicians) {
      if (pol.honest) {
        expect(pol.claims).toHaveLength(0);
        expect(pol.source?.url.startsWith("https://")).toBe(true);
      } else {
        expect(pol.claims.length).toBeGreaterThanOrEqual(3);
        expect(pol.claims.length).toBeLessThanOrEqual(4);
      }
    }
  });

  it("ties every claim to a real clue and a source", () => {
    const clues = new Map(NUCLEAIRE.clues.map((clue) => [clue.id, clue]));
    for (const pol of NUCLEAIRE.politicians) {
      for (const claim of pol.claims) {
        expect(claim.right.length).toBeGreaterThan(0);
        expect(claim.source.url.startsWith("https://")).toBe(true);
        expect(claim.source.date.length).toBeGreaterThan(0);
        for (const id of claim.right) {
          const clue = clues.get(id);
          expect(clue, id).toBeTruthy();
          expect(clue?.decoy).toBe(false);
        }
      }
    }
    for (const clue of NUCLEAIRE.clues) {
      if (clue.decoy) expect(clue.sources).toHaveLength(0);
      else {
        expect(clue.sources.length).toBeGreaterThan(0);
        for (const source of clue.sources) expect(source.url.startsWith("https://")).toBe(true);
      }
    }
    for (const room of NUCLEAIRE.rooms) {
      for (const spot of room.hotspots) {
        if (spot.clueId) expect(clues.has(spot.clueId)).toBe(true);
        if (spot.to && spot.to !== "@face") expect(NUCLEAIRE.rooms.some((r) => r.id === spot.to)).toBe(true);
        if (spot.npcId) expect(NUCLEAIRE.npcs.some((npc) => npc.id === spot.npcId)).toBe(true);
      }
    }
  });

  it("corners a right clue, punishes a decoy, and concedes", () => {
    let state = face("philippe");
    expect(state.screen).toBe("face");
    expect(state.run?.gauge).toBe(GAUGE_START);
    state = reduce(state, { t: "use", id: "echos2017" });
    expect(state.run?.gauge).toBe(2);
    expect(state.run?.replyKind).toBe("corner");
    state = reduce(state, { t: "advance" });
    expect(state.run?.claim).toBe(1);
    state = reduce(state, { t: "use", id: "clip2026" });
    expect(state.run?.gauge).toBe(0);
    state = reduce(state, { t: "advance" });
    expect(state.run?.phase).toBe("concede");
    state = reduce(state, { t: "face" });
    expect(state.screen).toBe("result");
    expect(outcomeLine(state)).toBe(UI.win);

    let reuse = face("philippe");
    reuse = reduce(reuse, { t: "use", id: "flyer" });
    reuse = reduce(reuse, { t: "advance" });
    reuse = reduce(reuse, { t: "use", id: "clip2026" });
    expect(reuse.run?.replyKind).toBe("corner");
    reuse = reduce(reuse, { t: "advance" });
    reuse = reduce(reuse, { t: "use", id: "clip2026" });
    expect(reuse.run?.replyKind).toBe("corner");
    expect(reuse.run?.gauge).toBe(2);
  });

  it("loses when the politician gets the upper hand, then retries the same face", () => {
    let state = face("lepen");
    state = reduce(state, { t: "use", id: "flyer" });
    state = reduce(state, { t: "advance" });
    state = reduce(state, { t: "use", id: "slogan" });
    expect(state.run?.gauge).toBe(8);
    state = reduce(state, { t: "advance" });
    expect(state.screen).toBe("defeat");
    state = reduce(state, { t: "retry" });
    expect(state.screen).toBe("room");
    expect(state.run?.politicianId).toBe("lepen");
    expect(state.run?.gauge).toBe(GAUGE_START);
    expect(inventory(state.run!)).toContain("flyer");
  });

  it("does not let Lisnard lie, and wastes the clue", () => {
    let state = face("lisnard");
    const before = state.run!.gauge;
    state = reduce(state, { t: "use", id: "part" });
    expect(state.run?.gauge).toBe(before);
    expect(state.run?.replyKind).toBe("honest");
    expect(state.run?.wasted).toContain("part");
    expect(inventory(state.run!)).not.toContain("part");
    state = reduce(state, { t: "advance" });
    expect(state.run?.phase).toBe("claim");
    state = reduce(state, { t: "assez" });
    expect(state.screen).toBe("result");
    expect(outcomeLine(state)).toBe(UI.lessonWaste);
    expect(outcomeLine(state)).not.toBe(UI.win);

    let calm = face("lisnard");
    calm = reduce(calm, { t: "assez" });
    expect(outcomeLine(calm)).toBe(UI.lessonStop);
  });

  it("opens Nucléaire from the list and keeps the other rows shut", () => {
    let state = reduce(newGame(4), { t: "enter" });
    state = actAt(state, 80, 50);
    expect(state.screen).toBe("room");
    expect(state.roomId).toBe("bureau");
    state = reduce(newGame(4), { t: "enter" });
    state = actAt(state, 80, 64);
    expect(state.screen).toBe("select");
    expect(state.notice).toBe(UI.later);
  });

  it("draws the screens without a missing letter", () => {
    let state = newGame(1);
    paint(state);
    state = reduce(state, { t: "enter" });
    paint(state);
    state = reduce(state, { t: "note" });
    paint(state);
    state = reduce(state, { t: "note-page" });
    paint(state);
    state = reduce(state, { t: "close" });
    state = reduce(state, { t: "theme", id: "nucleaire" });
    paint(state);
    for (const clue of NUCLEAIRE.clues) {
      const card = { ...state, screen: "card" as const, cardId: clue.id, cardFrom: "room" as const };
      paint(card);
      paint(reduce(card, { t: "sources" }));
    }
    paint({ ...state, screen: "hint", hintId: "marc" });
    paint({ ...state, screen: "hint", hintId: "lea" });
    for (const pol of NUCLEAIRE.politicians) {
      const confronted = face(pol.id);
      paint(confronted);
      paint(reduce(confronted, { t: "sources" }));
      if (!pol.honest) {
        paint({
          ...confronted,
          run: { ...confronted.run!, phase: "concede", reply: null, replyKind: null },
        });
      }
    }
    paint(demoState("room"));
    paint(demoState("card"));
    paint(demoState("face"));
    paint(demoState("defeat", "philippe", "facture"));
    paint(demoState("defeat", "philippe", "vert"));
    paint(reduce(face("philippe"), { t: "pause" }));
    for (const value of Object.values(UI)) {
      for (const ch of value) expect(hasGlyph(ch), `${ch} in ${value}`).toBe(true);
    }
    const clues: Clue[] = NUCLEAIRE.clues;
    for (const clue of clues) {
      for (const ch of `${clue.date}${clue.quote}${clue.proves}`) expect(hasGlyph(ch)).toBe(true);
    }
  });
});
