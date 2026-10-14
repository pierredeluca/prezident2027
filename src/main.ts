import "./style.css";
import { readAdsConfig, shouldLoadAdsense } from "./ads/config";
import { getChapter } from "./content/registry";
import {
  activate,
  choose,
  closeDialogue,
  continueDialogue,
  newGame,
  perform,
  selectItem,
  setVerb,
} from "./engine/logic";
import { clearGame, loadGame, saveGame } from "./engine/save";
import type { GameState, Verb } from "./engine/types";
import { bannerMarkup, renderGame, renderTitle, type Modal } from "./ui/render";

const app = document.querySelector<HTMLElement>("#app");
const banner = document.querySelector<HTMLElement>("#ad-banner");
if (!app || !banner) throw new Error("Page incomplète.");

const ads = readAdsConfig(import.meta.env, window.location.search);
const ui: { screen: "title" | "game"; modal: Modal; interstitial: boolean } = {
  screen: "title",
  modal: null,
  interstitial: false,
};

let state: GameState | null = null;
let trackedScene: string | null = null;
let pushedInterstitialFor: string | null = null;

banner.innerHTML = bannerMarkup(ads);
banner.hidden = banner.innerHTML.length === 0;
if (shouldLoadAdsense(ads)) {
  injectAdsense(ads.client);
  queueAdsense();
}

document.addEventListener("click", (event) => {
  const target = (event.target as Element | null)?.closest<HTMLElement>("[data-action]");
  if (!target || !app.contains(target)) return;
  const action = target.dataset.action;
  if (action === "new") {
    if (loadGame(localStorage)) ui.modal = "confirm-new";
    else startNew();
  } else if (action === "ask-new") ui.modal = "confirm-new";
  else if (action === "confirm-new") startNew();
  else if (action === "continue-save") resume();
  else if (action === "title") {
    ui.screen = "title";
    ui.modal = null;
    ui.interstitial = false;
  } else if (action === "open") ui.modal = (target.dataset.modal as Modal) ?? null;
  else if (action === "close-modal") ui.modal = null;
  else if (action === "close-ad") ui.interstitial = false;
  else if (state && action === "verb" && target.dataset.verb) {
    state = setVerb(state, target.dataset.verb as Verb);
    saveGame(localStorage, state);
  } else if (state && action === "hotspot" && target.dataset.id) {
    commit(perform(chapterOf(state), state, target.dataset.id, state.verb));
  } else if (state && action === "chip" && target.dataset.id && target.dataset.verb) {
    commit(perform(chapterOf(state), state, target.dataset.id, target.dataset.verb as Verb));
  } else if (state && action === "act" && target.dataset.id) {
    commit(activate(chapterOf(state), state, target.dataset.id));
  } else if (state && action === "choice" && target.dataset.index) {
    commit(choose(chapterOf(state), state, Number(target.dataset.index)));
  } else if (state && action === "continue") commit(continueDialogue(chapterOf(state), state));
  else if (state && action === "close-dialogue") commit(closeDialogue(state));
  else if (state && action === "item" && target.dataset.id) {
    state = selectItem(state, target.dataset.id);
    saveGame(localStorage, state);
  }
  draw();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && ui.modal) {
    ui.modal = null;
    draw();
    return;
  }
  if (!state || ui.screen !== "game" || ui.modal || ui.interstitial || state.dialogue) return;
  const verbs: Record<string, Verb> = {
    "1": "regarder",
    "2": "prendre",
    "3": "parler",
    "4": "utiliser",
    "5": "aller",
  };
  const verb = verbs[event.key];
  if (!verb) return;
  state = setVerb(state, verb);
  saveGame(localStorage, state);
  draw();
});

draw();

function startNew(): void {
  const chapter = getChapter(undefined);
  if (!chapter) return;
  clearGame(localStorage);
  state = newGame(chapter);
  trackedScene = state.sceneId;
  ui.screen = "game";
  ui.modal = null;
  ui.interstitial = false;
  saveGame(localStorage, state);
}

function resume(): void {
  const saved = loadGame(localStorage);
  const chapter = saved ? getChapter(saved.chapterId) : undefined;
  if (!saved || !chapter || !chapter.scenes.some((scene) => scene.id === saved.sceneId)) return;
  state = saved;
  trackedScene = saved.sceneId;
  ui.screen = "game";
  ui.modal = null;
  ui.interstitial = false;
}

function commit(next: GameState): void {
  const changed = trackedScene !== null && next.sceneId !== trackedScene;
  state = next;
  trackedScene = next.sceneId;
  saveGame(localStorage, next);
  if (changed && (ads.enabled || ads.preview)) ui.interstitial = true;
}

function chapterOf(current: GameState) {
  const chapter = getChapter(current.chapterId);
  if (!chapter) throw new Error("Chapitre introuvable.");
  return chapter;
}

function draw(): void {
  const chapter = getChapter(state?.chapterId);
  if (!chapter) return;
  if (ui.screen === "title" || !state) app!.innerHTML = renderTitle(loadGame(localStorage) !== null, chapter, ui.modal);
  else app!.innerHTML = renderGame(chapter, state, ui.modal, ui.interstitial, ads);
  const log = app!.querySelector(".log");
  if (log) log.scrollTop = log.scrollHeight;
  if (ui.interstitial && shouldLoadAdsense(ads) && state && pushedInterstitialFor !== state.sceneId) {
    pushedInterstitialFor = state.sceneId;
    queueAdsense();
  }
}

function injectAdsense(client: string): void {
  if (document.querySelector("script[data-adsense]")) return;
  const script = document.createElement("script");
  script.async = true;
  script.dataset.adsense = "true";
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(script);
}

function queueAdsense(): void {
  const win = window as Window & { adsbygoogle?: Record<string, unknown>[] };
  win.adsbygoogle = win.adsbygoogle || [];
  win.adsbygoogle.push({});
}
