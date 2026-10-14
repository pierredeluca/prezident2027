import type {
  Chapter,
  Choice,
  Cond,
  DialogueNode,
  GameState,
  Hotspot,
  JournalKind,
  Scene,
  Verb,
} from "./types";

const LOG_LIMIT = 80;

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

export function countKind(state: GameState, kind: JournalKind): number {
  return state.journal.filter((entry) => entry.kind === kind).length;
}

export function meets(cond: Cond | undefined, state: GameState): boolean {
  if (!cond) return true;
  if (cond.flag && !state.flags[cond.flag]) return false;
  if (cond.missingFlag && state.flags[cond.missingFlag]) return false;
  if (cond.missingFlags?.some((flag) => state.flags[flag])) return false;
  if (cond.flagsAll?.some((flag) => !state.flags[flag])) return false;
  if (cond.item && !state.inventory.includes(cond.item)) return false;
  if (cond.missingItem && state.inventory.includes(cond.missingItem)) return false;
  if (cond.minFiches != null && countKind(state, "ecart") < cond.minFiches) return false;
  if (cond.maxFiches != null && countKind(state, "ecart") > cond.maxFiches) return false;
  return true;
}

export function fill(text: string, state: GameState): string {
  return text
    .replaceAll("{{fiches}}", String(countKind(state, "ecart")))
    .replaceAll("{{notes}}", String(countKind(state, "note")));
}

export function formatClock(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours} h ${mins.toString().padStart(2, "0")}`;
}

export function newGame(chapter: Chapter): GameState {
  const scene = requireScene(chapter, chapter.startScene);
  const state: GameState = {
    version: 1,
    chapterId: chapter.id,
    sceneId: scene.id,
    minutes: chapter.startMinutes,
    flags: {},
    inventory: [],
    selectedItemId: null,
    verb: "regarder",
    focusId: null,
    journal: [],
    dialogue: null,
    log: [],
    endingId: null,
    entered: { [scene.id]: true },
  };
  pushLog(state, { text: scene.intro });
  return state;
}

export function getScene(chapter: Chapter, state: GameState): Scene {
  return requireScene(chapter, state.sceneId);
}

export function visibleHotspots(scene: Scene, state: GameState): Hotspot[] {
  return scene.hotspots.filter((hotspot) => meets(hotspot.when, state));
}

export function findNode(
  chapter: Chapter,
  dialogueId: string,
  nodeId: string,
): DialogueNode | undefined {
  return chapter.dialogues[dialogueId]?.find((node) => node.id === nodeId);
}

export function currentNode(chapter: Chapter, state: GameState): DialogueNode | undefined {
  if (!state.dialogue) return undefined;
  return findNode(chapter, state.dialogue.dialogueId, state.dialogue.nodeId);
}

export function visibleChoices(node: DialogueNode, state: GameState): Choice[] {
  return (node.choices ?? []).filter((choice) => meets(choice.when, state));
}

export function perform(
  chapter: Chapter,
  input: GameState,
  hotspotId: string,
  verb: Verb,
): GameState {
  const state = cloneState(input);
  state.verb = "regarder";
  if (state.dialogue) {
    pushLog(state, { text: "Vous êtes en pleine conversation." });
    return state;
  }
  const scene = requireScene(chapter, state.sceneId);
  const hotspot = visibleHotspots(scene, state).find((item) => item.id === hotspotId);
  if (!hotspot) {
    pushLog(state, { text: "Vous ne voyez pas ça." });
    return state;
  }
  state.focusId = hotspot.id;
  if (verb === "regarder") return doLook(chapter, state, hotspot);
  if (verb === "prendre") return doTake(chapter, state, hotspot);
  if (verb === "parler") return doTalk(chapter, state, hotspot);
  if (verb === "aller") return doGo(chapter, state, hotspot);
  return doUse(chapter, state, hotspot);
}

export function choose(chapter: Chapter, input: GameState, index: number): GameState {
  const state = cloneState(input);
  const node = currentNode(chapter, state);
  if (!node) return state;
  const choice = visibleChoices(node, state)[index];
  if (!choice) return state;
  applyEffects(chapter, state, choice.effects ?? []);
  if (state.dialogue && choice.goto) {
    state.dialogue.nodeId = choice.goto;
    const next = currentNode(chapter, state);
    if (next) pushLog(state, { speaker: next.speaker, text: fill(next.text, state) });
  } else if (!choice.goto) {
    state.dialogue = null;
    state.focusId = null;
  }
  return state;
}

export function continueDialogue(chapter: Chapter, input: GameState): GameState {
  const state = cloneState(input);
  const node = currentNode(chapter, state);
  if (!node || !state.dialogue) return state;
  if (visibleChoices(node, state).length > 0) return state;
  if (node.next) {
    state.dialogue.nodeId = node.next;
    const next = currentNode(chapter, state);
    if (next) pushLog(state, { speaker: next.speaker, text: fill(next.text, state) });
    return state;
  }
  state.dialogue = null;
  state.focusId = null;
  return state;
}

export function closeDialogue(input: GameState): GameState {
  const state = cloneState(input);
  state.dialogue = null;
  state.focusId = null;
  return state;
}

export function activate(chapter: Chapter, input: GameState, hotspotId: string): GameState {
  const state = cloneState(input);
  state.verb = "regarder";
  if (state.dialogue) {
    pushLog(state, { text: "Vous êtes en pleine conversation." });
    return state;
  }
  const scene = requireScene(chapter, state.sceneId);
  const hotspot = visibleHotspots(scene, state).find((item) => item.id === hotspotId);
  if (!hotspot?.act) {
    pushLog(state, { text: "Rien à actionner." });
    return state;
  }
  state.focusId = hotspot.id;
  runAct(chapter, state, hotspot);
  return state;
}

export function selectItem(input: GameState, itemId: string | null): GameState {
  const state = cloneState(input);
  if (itemId && !state.inventory.includes(itemId)) return state;
  state.selectedItemId = state.selectedItemId === itemId ? null : itemId;
  return state;
}

export function setVerb(input: GameState, verb: Verb): GameState {
  const state = cloneState(input);
  state.verb = verb;
  return state;
}

function doLook(chapter: Chapter, state: GameState, hotspot: Hotspot): GameState {
  applyEffects(chapter, state, hotspot.lookEffects ?? []);
  pushLog(state, { text: fill(lookText(hotspot, state), state) });
  return state;
}

function lookText(hotspot: Hotspot, state: GameState): string {
  for (const alt of hotspot.lookWhen ?? []) {
    if (meets(alt.when, state)) return alt.text;
  }
  return hotspot.look;
}

function doTake(chapter: Chapter, state: GameState, hotspot: Hotspot): GameState {
  const take = hotspot.take;
  if (!take) {
    pushLog(state, { text: "Ça ne se prend pas." });
    return state;
  }
  if (!meets(take.when, state)) {
    pushLog(state, { text: take.blockedText ?? "Pas maintenant." });
    return state;
  }
  if (state.inventory.includes(take.itemId)) {
    pushLog(state, { text: take.alreadyText });
    return state;
  }
  applyEffects(chapter, state, [{ op: "give", itemId: take.itemId }, ...(take.effects ?? [])]);
  pushLog(state, { text: take.text });
  return state;
}

function doTalk(chapter: Chapter, state: GameState, hotspot: Hotspot): GameState {
  const talk = hotspot.talk;
  if (!talk) {
    pushLog(state, { text: "Personne ne vous répond." });
    return state;
  }
  const missing = (talk.requiresAllFlags ?? []).filter((flag) => !state.flags[flag]);
  if (missing.length > 0 || !meets(talk.requires, state)) {
    pushLog(state, { text: talk.blockedText ?? "Pas encore." });
    return state;
  }
  const dialogue = chapter.dialogues[talk.dialogueId];
  if (!dialogue) {
    pushLog(state, { text: "La réplique manque. Le silence, lui, est entier." });
    return state;
  }
  let nodeId = talk.nodeId;
  for (const route of talk.routes ?? []) {
    if (meets(route.when, state)) {
      nodeId = route.nodeId;
      break;
    }
  }
  const node = dialogue.find((item) => item.id === nodeId);
  if (!node) {
    pushLog(state, { text: "La réplique manque. Le silence, lui, est entier." });
    return state;
  }
  state.dialogue = { dialogueId: talk.dialogueId, nodeId };
  pushLog(state, { speaker: node.speaker, text: fill(node.text, state) });
  return state;
}

function doGo(chapter: Chapter, state: GameState, hotspot: Hotspot): GameState {
  if (!hotspot.go) {
    pushLog(state, { text: "Ça ne mène nulle part." });
    return state;
  }
  if (!meets(hotspot.go.when, state)) {
    pushLog(state, { text: hotspot.go.blockedText ?? "C'est fermé." });
    return state;
  }
  travel(chapter, state, hotspot.go.sceneId);
  return state;
}

function doUse(chapter: Chapter, state: GameState, hotspot: Hotspot): GameState {
  if (state.selectedItemId) {
    const match = (hotspot.useWith ?? []).find(
      (use) => use.itemId === state.selectedItemId && meets(use.when, state),
    );
    if (!match) {
      pushLog(state, { text: "Ça ne sert à rien ici." });
      return state;
    }
    if (match.onceFlag && state.flags[match.onceFlag]) {
      pushLog(state, { text: match.alreadyText ?? "C'est déjà fait." });
      return state;
    }
    applyEffects(chapter, state, match.effects ?? []);
    if (match.onceFlag) state.flags[match.onceFlag] = true;
    pushLog(state, { text: fill(match.text, state) });
    return state;
  }
  if (!hotspot.act) {
    pushLog(state, {
      text: "Sélectionnez un objet dans l'inventaire, ou contentez-vous de regarder.",
    });
    return state;
  }
  runAct(chapter, state, hotspot);
  return state;
}

function runAct(chapter: Chapter, state: GameState, hotspot: Hotspot): void {
  const act = hotspot.act;
  if (!act) return;
  if (act.onceFlag && state.flags[act.onceFlag]) {
    pushLog(state, { text: act.alreadyText ?? "C'est déjà fait." });
    return;
  }
  applyEffects(chapter, state, act.effects ?? []);
  if (act.onceFlag) state.flags[act.onceFlag] = true;
  pushLog(state, { text: act.text });
}

function applyEffects(chapter: Chapter, state: GameState, effects: import("./types").Effect[]): void {
  for (const effect of effects) {
    if (effect.op === "flag") state.flags[effect.id] = true;
    else if (effect.op === "unflag") delete state.flags[effect.id];
    else if (effect.op === "give") {
      if (!state.inventory.includes(effect.itemId)) state.inventory.push(effect.itemId);
    } else if (effect.op === "journal") {
      const entry = structuredClone(effect.entry);
      const index = state.journal.findIndex((item) => item.id === entry.id);
      if (index >= 0) state.journal[index] = entry;
      else state.journal.push(entry);
    } else if (effect.op === "forgetJournal") {
      state.journal = state.journal.filter((item) => item.id !== effect.id);
    } else if (effect.op === "ending") {
      state.endingId = effect.id;
    } else if (effect.op === "goto") {
      travel(chapter, state, effect.sceneId);
      state.dialogue = null;
    }
  }
}

function travel(chapter: Chapter, state: GameState, sceneId: string): void {
  const scene = requireScene(chapter, sceneId);
  state.sceneId = scene.id;
  state.focusId = null;
  if (!state.entered[scene.id]) {
    state.entered[scene.id] = true;
    state.minutes += scene.timeCost;
    pushLog(state, { text: scene.intro });
  } else {
    pushLog(state, { text: `Vous revenez : ${scene.title}.` });
  }
}

function pushLog(state: GameState, line: { speaker?: string; text: string }): void {
  state.log.push({ speaker: line.speaker, text: line.text });
  if (state.log.length > LOG_LIMIT) {
    state.log.splice(0, state.log.length - LOG_LIMIT);
  }
}

function requireScene(chapter: Chapter, sceneId: string): Scene {
  const scene = chapter.scenes.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Scène inconnue : ${sceneId}`);
  return scene;
}
