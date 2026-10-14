import { describe, expect, it } from "vitest";
import { readAdsConfig } from "../src/ads/config";
import { DISCLAIMER_FOOTER, DISCLAIMER_TITLE } from "../src/content/disclaimer";
import { chapitre1 } from "../src/content/chapitre1";
import {
  activate,
  choose,
  continueDialogue,
  countKind,
  currentNode,
  newGame,
  perform,
  selectItem,
  visibleChoices,
} from "../src/engine/logic";
import { parseSave, serialize } from "../src/engine/save";
import { validateChapter } from "../src/engine/validate";
import type { GameState } from "../src/engine/types";
import { renderTitle } from "../src/ui/render";

function chooseLabel(state: GameState, label: string): GameState {
  const node = currentNode(chapitre1, state);
  if (!node) throw new Error(`Pas de dialogue pour choisir « ${label} »`);
  const choices = visibleChoices(node, state);
  const index = choices.findIndex((choice) => choice.label === label);
  if (index < 0) {
    throw new Error(
      `Choix introuvable « ${label} ». Disponibles : ${choices.map((choice) => choice.label).join(" | ")}`,
    );
  }
  return choose(chapitre1, state, index);
}

function advance(state: GameState): GameState {
  return continueDialogue(chapitre1, state);
}

describe("règles affichées", () => {
  it("affiche l'avertissement satirique au titre et dans le pied de page", () => {
    expect(DISCLAIMER_TITLE.startsWith("Œuvre de fiction satirique")).toBe(true);
    expect(DISCLAIMER_FOOTER.startsWith("Œuvre de fiction satirique")).toBe(true);
    const title = renderTitle(false, chapitre1, null);
    expect(title).toContain("Œuvre de fiction satirique");
    expect(title).toContain("Œuvre de fiction satirique…");
  });
});

describe("chapitre", () => {
  it("relie toutes les scènes, les dialogues et les objets", () => {
    expect(validateChapter(chapitre1)).toEqual([]);
  });
});

describe("publicité", () => {
  it("reste éteinte sans variable d'environnement", () => {
    const config = readAdsConfig({}, "");
    expect(config.enabled).toBe(false);
    expect(config.preview).toBe(false);
  });

  it("réserve un aperçu sans charger AdSense", () => {
    const config = readAdsConfig({ VITE_ADS_ENABLED: "false" }, "?ads=preview");
    expect(config.enabled).toBe(false);
    expect(config.preview).toBe(true);
  });
});

describe("partie", () => {
  it("refuse une sauvegarde illisible", () => {
    expect(parseSave("non")).toBeNull();
    expect(parseSave(JSON.stringify({ version: 2 }))).toBeNull();
  });

  it("fait visiter une loge, tient le carnet, et ne compte pas Lisnard parmi les écarts", () => {
    let state = newGame(chapitre1);
    expect(perform(chapitre1, state, "porte", "aller").log.at(-1)?.text).toMatch(/badge/);

    state = perform(chapitre1, state, "jeanne", "parler");
    state = chooseLabel(state, "Vous voulez un article.");
    state = advance(state);
    state = chooseLabel(state, "Et s'il n'y a pas d'écart ?");
    state = advance(state);
    state = chooseLabel(state, "J'y vais.");
    expect(state.flags.briefed).toBe(true);
    expect(state.dialogue).toBeNull();

    state = perform(chapitre1, state, "portemanteau", "prendre");
    expect(state.inventory).toEqual(["badge", "crayon"]);

    state = perform(chapitre1, state, "porte", "aller");
    expect(state.sceneId).toBe("hall");

    state = perform(chapitre1, state, "pascal", "parler");
    state = chooseLabel(state, "J'ai un badge du Compte-Rendu.");
    state = chooseLabel(state, "Je prends le plan.");
    state = perform(chapitre1, state, "porte", "aller");
    expect(state.sceneId).toBe("couloir");
    expect(perform(chapitre1, state, "porte-regie", "aller").sceneId).toBe("couloir");

    state = perform(chapitre1, state, "porte-philippe", "aller");
    expect(perform(chapitre1, state, "chloe", "parler").dialogue).toBeNull();
    state = perform(chapitre1, state, "moniteur", "regarder");
    state = perform(chapitre1, state, "prompteur", "regarder");
    state = perform(chapitre1, state, "chloe", "parler");
    state = chooseLabel(state, "Le crayon. Je viens pour Fessenheim, et pour le reste.");
    state = chooseLabel(state, "Donc on les sépare.");
    state = chooseLabel(state, "Je souligne l'atome et l'esquive.");
    state = chooseLabel(state, "Je vais à la fiche.");
    state = selectItem(state, "crayon");
    state = perform(chapitre1, state, "fiche", "utiliser");
    expect(countKind(state, "ecart")).toBe(1);
    state = perform(chapitre1, state, "fiche", "utiliser");
    expect(state.journal).toHaveLength(1);

    state = perform(chapitre1, state, "sortie", "aller");
    state = perform(chapitre1, state, "porte-lisnard", "aller");
    state = activate(chapitre1, state, "ecran");
    state = perform(chapitre1, state, "ecran", "parler");
    state = advance(state);
    state = chooseLabel(state, "Numérotez, puisque vous numérotez.");
    state = advance(state);
    state = chooseLabel(state, "Ce n'est pas un écart. Je le classe à part.");
    state = perform(chapitre1, state, "fiche", "utiliser");
    expect(countKind(state, "ecart")).toBe(1);
    expect(countKind(state, "note")).toBe(1);
    expect(state.journal.some((entry) => entry.candidate === "David Lisnard" && entry.kind === "note")).toBe(
      true,
    );

    const restored = parseSave(serialize(state));
    expect(restored?.sceneId).toBe("lisnard");
    expect(restored?.journal).toHaveLength(2);
  });

  it("ouvre la régie après quatre fiches et une note, puis atteint une fin", () => {
    let state = prepared();
    state = stampLoge(state, "porte-attal", ["ardoise", "carton"], "marc", [
      "Le porte-parole n'écrivait pas le chèque.",
      null,
      "Je souligne le pupitre et le cachet.",
      "À la fiche.",
    ]);
    state = stampLoge(state, "porte-melenchon", ["moniteur", "programme"], "nadia", [
      "En 1992, le sénateur disait oui à Maastricht.",
      null,
      null,
      "Je souligne Maastricht et le rappel de 2026.",
      "Le moniteur peut s'éteindre.",
    ]);
    state = stampLoge(state, "porte-lepen", ["livret-2017", "livret-2022"], "thomas", [
      "En 2017, sortir de l'euro était central.",
      null,
      "J'écris les dates.",
    ]);
    expect(countKind(state, "ecart")).toBe(4);
    state = perform(chapitre1, state, "porte-regie", "aller");
    expect(state.sceneId).toBe("regie");
    state = perform(chapitre1, state, "solene", "parler");
    state = chooseLabel(state, "On diffuse le carnet tel quel.");
    state = chooseLabel(state, "Oui. Le carnet part au journal.");
    expect(state.endingId).toBe("ennui");
    expect(state.sceneId).toBe("epilogue");
    expect(state.dialogue).toBeNull();
  });
});

function prepared(): GameState {
  let state = newGame(chapitre1);
  state = perform(chapitre1, state, "jeanne", "parler");
  state = chooseLabel(state, "Vous voulez un article.");
  state = advance(state);
  state = chooseLabel(state, "Je prends la règle, et le matériel.");
  state = chooseLabel(state, "J'y vais.");
  state = perform(chapitre1, state, "portemanteau", "prendre");
  state = perform(chapitre1, state, "porte", "aller");
  state = perform(chapitre1, state, "pascal", "parler");
  state = chooseLabel(state, "J'ai un badge du Compte-Rendu.");
  state = chooseLabel(state, "Je prends le plan.");
  state = perform(chapitre1, state, "porte", "aller");
  state = stampLoge(state, "porte-philippe", ["moniteur", "prompteur"], "chloe", [
    "Le crayon. Je viens pour Fessenheim, et pour le reste.",
    "Donc on les sépare.",
    "Je souligne l'atome et l'esquive.",
    "Je vais à la fiche.",
  ]);
  state = perform(chapitre1, state, "sortie", "aller");
  state = perform(chapitre1, state, "porte-lisnard", "aller");
  state = activate(chapitre1, state, "ecran");
  state = perform(chapitre1, state, "ecran", "parler");
  state = advance(state);
  state = chooseLabel(state, "Numérotez, puisque vous numérotez.");
  state = advance(state);
  state = chooseLabel(state, "Ce n'est pas un écart. Je le classe à part.");
  state = perform(chapitre1, state, "fiche", "utiliser");
  return perform(chapitre1, state, "sortie", "aller");
}

function stampLoge(state: GameState, door: string, props: string[], person: string, labels: (string | null)[]): GameState {
  state = perform(chapitre1, state, door, "aller");
  for (const prop of props) state = perform(chapitre1, state, prop, "regarder");
  state = perform(chapitre1, state, person, "parler");
  for (const label of labels) state = label ? chooseLabel(state, label) : advance(state);
  if (state.selectedItemId !== "crayon") state = selectItem(state, "crayon");
  state = perform(chapitre1, state, "fiche", "utiliser");
  return perform(chapitre1, state, "sortie", "aller");
}
