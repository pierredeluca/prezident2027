import { adsActive, type AdsConfig } from "../ads/config";
import { DISCLAIMER_FOOTER, DISCLAIMER_TITLE } from "../content/disclaimer";
import type { Chapter, GameState, Hotspot, Verb } from "../engine/types";
import { countKind, currentNode, formatClock, visibleChoices, visibleHotspots } from "../engine/logic";
import { htmlText } from "../text";

export type Modal = "carnet" | "sources" | "help" | "menu" | "confirm-new" | null;

const VERBS: { id: Verb; label: string; key: string }[] = [
  { id: "regarder", label: "Regarder", key: "1" },
  { id: "prendre", label: "Prendre", key: "2" },
  { id: "parler", label: "Parler", key: "3" },
  { id: "utiliser", label: "Utiliser", key: "4" },
  { id: "aller", label: "Aller", key: "5" },
];

export function renderTitle(hasSave: boolean, chapter: Chapter, modal: Modal): string {
  return `
    <main class="title-screen">
      <p class="eyebrow">Présidentielle 2027 · une nuit d'octobre</p>
      <h1>Le Grand Écart</h1>
      <p class="subtitle">Chapitre I — La nuit des fiches</p>
      <p class="lede">Vous entrez dans les loges pour voir qui plie sa phrase. Pas pour inventer un délit. Le moins plié n'est pas un saint : il est resté lisible.</p>
      <div class="title-actions">
        <button type="button" data-action="new">Nouvelle partie</button>
        <button type="button" data-action="continue-save" ${hasSave ? "" : "disabled"}>Continuer</button>
        <button type="button" class="ghost" data-action="open" data-modal="help">Comment jouer</button>
        <button type="button" class="ghost" data-action="open" data-modal="sources">Sources</button>
      </div>
      <aside class="disclaimer">${htmlText(DISCLAIMER_TITLE)}</aside>
      ${footer()}
    </main>
    ${modal ? renderModal(chapter, null, modal) : ""}
  `;
}

export function renderGame(
  chapter: Chapter,
  state: GameState,
  modal: Modal,
  interstitial: boolean,
  ads: AdsConfig,
): string {
  const scene = chapter.scenes.find((item) => item.id === state.sceneId);
  if (!scene) return `<p>Scène introuvable.</p>`;
  const ending = state.endingId ? chapter.endings[state.endingId] : undefined;
  const node = currentNode(chapter, state);
  const choices = node ? visibleChoices(node, state) : [];
  const focus = visibleHotspots(scene, state).find((hotspot) => hotspot.id === state.focusId);
  const selected = chapter.items.find((item) => item.id === state.selectedItemId);
  const fiches = countKind(state, "ecart");

  return `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="brand">Le Grand Écart</p>
          <h1>${htmlText(scene.title)}</h1>
        </div>
        <div class="top-meta">
          <span>${htmlText(formatClock(state.minutes))}</span>
          <span>${fiches} fiche${fiches > 1 ? "s" : ""}</span>
        </div>
        <div class="top-actions">
          <button type="button" data-action="open" data-modal="carnet" ${state.flags.has_carnet ? "" : "disabled"}>Carnet</button>
          <button type="button" class="ghost" data-action="open" data-modal="help">Aide</button>
          <button type="button" class="ghost" data-action="open" data-modal="menu">Menu</button>
        </div>
      </header>
      <div class="stage-wrap">
        <div class="stage ${state.dialogue ? "is-talking" : ""}">
          <img src="${import.meta.env.BASE_URL}${scene.art}" alt="" />
          ${visibleHotspots(scene, state)
            .map((hotspot) => hotspotButton(hotspot, state.focusId === hotspot.id))
            .join("")}
        </div>
      </div>
      <section class="paper" aria-live="polite">
        ${
          ending && scene.id === "epilogue"
            ? renderEnding(ending, state.flags.lisnard_misread === true)
            : ""
        }
        <div class="log">
          ${state.log
            .map(
              (line, index) => `
                <p class="${index === state.log.length - 1 ? "last" : ""}">
                  ${line.speaker ? `<span class="who">${htmlText(line.speaker)}</span>` : ""}
                  ${htmlText(line.text)}
                </p>`,
            )
            .join("")}
        </div>
        ${selected ? `<p class="item-look">${htmlText(selected.look)}</p>` : ""}
        ${
          node
            ? `<div class="choices">
                ${choices
                  .map(
                    (choice, index) =>
                      `<button type="button" data-action="choice" data-index="${index}">${htmlText(choice.label)}</button>`,
                  )
                  .join("")}
                ${
                  choices.length === 0
                    ? `<button type="button" data-action="${node.next ? "continue" : "close-dialogue"}">${node.next ? "Continuer" : "Fermer"}</button>`
                    : ""
                }
              </div>`
            : focus
              ? `<div class="choices chips">${chips(chapter, state, focus)}</div>`
              : ""
        }
      </section>
      <div class="verbs" role="toolbar" aria-label="Verbes">
        ${VERBS.map(
          (verb) => `
            <button type="button" data-action="verb" data-verb="${verb.id}" class="${state.verb === verb.id ? "is-on" : ""}" ${state.dialogue ? "disabled" : ""}>
              <kbd>${verb.key}</kbd>${verb.label}
            </button>`,
        ).join("")}
      </div>
      <ul class="inventory">
        ${
          state.inventory.length === 0
            ? `<li class="empty">Inventaire vide</li>`
            : state.inventory
                .map((id) => {
                  const item = chapter.items.find((entry) => entry.id === id);
                  if (!item) return "";
                  return `<li><button type="button" data-action="item" data-id="${htmlText(item.id)}" class="${state.selectedItemId === item.id ? "is-on" : ""}">${htmlText(item.name)}</button></li>`;
                })
                .join("")
        }
      </ul>
      ${footer()}
    </div>
    ${modal ? renderModal(chapter, state, modal) : ""}
    ${interstitial ? renderInterstitial(ads) : ""}
  `;
}

function hotspotButton(hotspot: Hotspot, focused: boolean): string {
  return `<button type="button" class="hotspot ${focused ? "is-on" : ""}" style="left:${hotspot.x}%;top:${hotspot.y}%;width:${hotspot.w}%;height:${hotspot.h}%" data-action="hotspot" data-id="${htmlText(hotspot.id)}"><span>${htmlText(hotspot.label)}</span></button>`;
}

function chips(chapter: Chapter, state: GameState, hotspot: Hotspot): string {
  const buttons: string[] = [];
  if (hotspot.take) buttons.push(chip("prendre", hotspot.id, "Prendre"));
  if (hotspot.talk) buttons.push(chip("parler", hotspot.id, "Parler"));
  if (hotspot.go) buttons.push(chip("aller", hotspot.id, "Entrer"));
  if (hotspot.act) {
    buttons.push(
      `<button type="button" data-action="act" data-id="${htmlText(hotspot.id)}">${htmlText(hotspot.act.label)}</button>`,
    );
  }
  if (state.selectedItemId && hotspot.useWith?.some((use) => use.itemId === state.selectedItemId)) {
    const item = chapter.items.find((entry) => entry.id === state.selectedItemId);
    buttons.push(chip("utiliser", hotspot.id, `Utiliser ${item?.name ?? "l'objet"}`));
  }
  return buttons.join("");
}

function chip(verb: Verb, id: string, label: string): string {
  return `<button type="button" data-action="chip" data-verb="${verb}" data-id="${htmlText(id)}">${htmlText(label)}</button>`;
}

function renderEnding(
  ending: { title: string; paragraphs: string[]; extraIfMisread?: string[] },
  misread: boolean,
): string {
  const extra = misread ? (ending.extraIfMisread ?? []) : [];
  return `
    <article class="ending">
      <p class="eyebrow">Fin de chapitre</p>
      <h2>${htmlText(ending.title)}</h2>
      ${[...ending.paragraphs, ...extra].map((paragraph) => `<p>${htmlText(paragraph)}</p>`).join("")}
      <button type="button" data-action="title">Retour à l'écran titre</button>
    </article>
  `;
}

function renderModal(chapter: Chapter, state: GameState | null, modal: Modal): string {
  const body =
    modal === "carnet" && state
      ? carnet(chapter, state)
      : modal === "sources"
        ? sources(chapter)
        : modal === "help"
          ? help()
          : modal === "menu"
            ? menu()
            : modal === "confirm-new"
              ? confirmNew()
              : "<p>Rien à montrer.</p>";
  return `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-card">
        <button type="button" class="close" data-action="close-modal">Fermer</button>
        ${body}
      </div>
    </div>
  `;
}

function carnet(chapter: Chapter, state: GameState): string {
  const entries =
    state.journal.length === 0
      ? `<p>Aucune fiche. Quatre traits rouges ouvrent la régie. La visio de Cannes n'est pas une case comme les autres.</p>`
      : state.journal
          .map(
            (entry) => `
              <article class="entry ${entry.kind}">
                <p class="eyebrow">${entry.kind === "ecart" ? "Écart" : "Note"} · ${htmlText(entry.candidate)}</p>
                <h3>${htmlText(entry.title)}</h3>
                <p><strong>Public.</strong> ${htmlText(entry.documented)}</p>
                <p><strong>Dans la scène.</strong> ${htmlText(entry.fiction)}</p>
                <p class="basis">${htmlText(entry.basis)}</p>
              </article>`,
          )
          .join("");
  return `
    <h2>Carnet de cohérence</h2>
    <p>Jeanne : relever ce qui a été dit, puis dédit. Grossir pour que ça se voie. Ne rien inventer. Le plateau voudra le mot évolution. Le journal voudra la date.</p>
    ${entries}
    <p class="basis">${chapter.subtitle}. ${countKind(state, "ecart")} écart${countKind(state, "ecart") > 1 ? "s" : ""}, ${countKind(state, "note")} note${countKind(state, "note") > 1 ? "s" : ""}.</p>
  `;
}

function sources(chapter: Chapter): string {
  return `
    <h2>Sources</h2>
    <p>Le jeu grossit des déplacements publics. Il ne les fabrique pas. Les collaborateurs de loge, la productrice et le journal sont fictifs.</p>
    <ul class="sources">
      ${chapter.sources
        .map(
          (source) => `
            <li>
              <strong>${htmlText(source.title)}</strong>
              <span>${htmlText(source.detail)}</span>
              ${source.url ? `<a href="${htmlText(source.url)}" target="_blank" rel="noreferrer">${htmlText(source.url)}</a>` : ""}
            </li>`,
        )
        .join("")}
    </ul>
  `;
}

function help(): string {
  return `
    <h2>Comment jouer</h2>
    <p>C'est une aventure à la première personne. Le décor se regarde. Les gens se parlent. Les objets se prennent, puis s'utilisent.</p>
    <ol>
      <li>Choisissez un verbe, puis un endroit. Regarder est le verbe de repos.</li>
      <li>Vous pouvez aussi toucher un endroit : la description s'affiche, avec des boutons Parler, Prendre, Entrer.</li>
      <li>Dans une loge, regardez les deux pièces à conviction avant de parler. Le crayon rouge sert sur la fiche, après l'entretien.</li>
      <li>Quatre fiches ouvrent la régie. La nuit se termine là, et seulement là.</li>
      <li>La partie s'écrit dans cet appareil, toute seule.</li>
    </ol>
    <p>Au clavier : 1 regarder, 2 prendre, 3 parler, 4 utiliser, 5 aller. Échap ferme une fenêtre.</p>
  `;
}

function menu(): string {
  return `
    <h2>Menu</h2>
    <div class="menu-actions">
      <button type="button" data-action="open" data-modal="sources">Sources</button>
      <button type="button" data-action="open" data-modal="help">Comment jouer</button>
      <button type="button" data-action="ask-new">Recommencer</button>
      <button type="button" data-action="title">Écran titre</button>
    </div>
  `;
}

function confirmNew(): string {
  return `
    <h2>Recommencer la nuit ?</h2>
    <p>La partie en cours sur cet appareil sera effacée.</p>
    <div class="menu-actions">
      <button type="button" data-action="confirm-new">Effacer et recommencer</button>
      <button type="button" class="ghost" data-action="close-modal">Annuler</button>
    </div>
  `;
}

function renderInterstitial(ads: AdsConfig): string {
  const real = ads.enabled && !ads.preview && ads.client;
  const slot = real
    ? `<ins class="adsbygoogle adsbygoogle-pending" style="display:block" data-ad-client="${htmlText(ads.client)}" data-ad-slot="${htmlText(ads.interstitialSlot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>`
    : `<div class="ad-placeholder"><span>Emplacement publicitaire</span><small>Interstitiel entre deux scènes. Aucune annonce n'est chargée dans cet aperçu.</small></div>`;
  return `
    <div class="modal interstitial" role="dialog" aria-modal="true" aria-label="Espace publicitaire">
      <div class="modal-card">
        <p class="eyebrow">Entre deux scènes</p>
        ${slot}
        <button type="button" data-action="close-ad">Continuer</button>
      </div>
    </div>
  `;
}

export function bannerMarkup(ads: AdsConfig): string {
  if (!adsActive(ads)) return "";
  if (ads.enabled && !ads.preview && ads.client) {
    return `<ins class="adsbygoogle" style="display:block" data-ad-client="${htmlText(ads.client)}" data-ad-slot="${htmlText(ads.bannerSlot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
  }
  return `<div class="ad-placeholder banner"><span>Emplacement publicitaire</span><small>Bannière. Inactive par défaut. Aperçu sans chargement AdSense.</small></div>`;
}

function footer(): string {
  return `<footer class="legal">${htmlText(DISCLAIMER_FOOTER)}</footer>`;
}
