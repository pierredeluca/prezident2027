import type { Chapter, Effect, Scene } from "./types";

export function validateChapter(chapter: Chapter): string[] {
  const errors: string[] = [];
  const sceneIds = new Set(chapter.scenes.map((scene) => scene.id));
  const itemIds = new Set(chapter.items.map((item) => item.id));
  if (!sceneIds.has(chapter.startScene)) errors.push(`scène de départ inconnue : ${chapter.startScene}`);
  if (!chapter.endings.ennui || !chapter.endings.prime || !chapter.endings.mention) {
    errors.push("les trois fins ennui, prime et mention sont requises");
  }

  for (const scene of chapter.scenes) {
    const seen = new Set<string>();
    const flagsHere = flagsSetInScene(scene);
    for (const hotspot of scene.hotspots) {
      if (seen.has(hotspot.id)) errors.push(`hotspot dupliqué ${scene.id}/${hotspot.id}`);
      seen.add(hotspot.id);
      if (hotspot.go && !sceneIds.has(hotspot.go.sceneId)) {
        errors.push(`sortie inconnue ${scene.id}/${hotspot.id} → ${hotspot.go.sceneId}`);
      }
      if (hotspot.take && !itemIds.has(hotspot.take.itemId)) {
        errors.push(`objet inconnu ${hotspot.take.itemId}`);
      }
      for (const use of hotspot.useWith ?? []) {
        if (!itemIds.has(use.itemId)) errors.push(`utilisation d'objet inconnu ${use.itemId}`);
        for (const effect of use.effects ?? []) checkEffect(effect, sceneIds, itemIds, chapter, errors);
      }
      for (const effect of hotspot.lookEffects ?? []) {
        checkEffect(effect, sceneIds, itemIds, chapter, errors);
      }
      for (const effect of hotspot.take?.effects ?? []) {
        checkEffect(effect, sceneIds, itemIds, chapter, errors);
      }
      if (hotspot.talk) {
        const nodes = chapter.dialogues[hotspot.talk.dialogueId];
        if (!nodes) errors.push(`dialogue inconnu ${hotspot.talk.dialogueId}`);
        else {
          const ids = new Set(nodes.map((node) => node.id));
          if (!ids.has(hotspot.talk.nodeId)) {
            errors.push(`nœud inconnu ${hotspot.talk.dialogueId}/${hotspot.talk.nodeId}`);
          }
          for (const route of hotspot.talk.routes ?? []) {
            if (!ids.has(route.nodeId)) {
              errors.push(`route inconnue ${hotspot.talk.dialogueId}/${route.nodeId}`);
            }
          }
        }
        for (const flag of hotspot.talk.requiresAllFlags ?? []) {
          if (!flagsHere.has(flag)) {
            errors.push(`le drapeau ${flag} n'est posé nulle part dans ${scene.id}`);
          }
        }
      }
    }
  }

  for (const [dialogueId, nodes] of Object.entries(chapter.dialogues)) {
    const ids = new Set(nodes.map((node) => node.id));
    for (const node of nodes) {
      if (node.next && node.choices?.length) {
        errors.push(`${dialogueId}/${node.id} a à la fois une suite et des choix`);
      }
      if (node.next && !ids.has(node.next)) errors.push(`${dialogueId}/${node.id} suite inconnue`);
      for (const choice of node.choices ?? []) {
        if (choice.goto && !ids.has(choice.goto)) {
          errors.push(`${dialogueId}/${node.id} choix vers ${choice.goto}`);
        }
        for (const effect of choice.effects ?? []) {
          checkEffect(effect, sceneIds, itemIds, chapter, errors);
        }
      }
    }
  }
  return errors;
}

function flagsSetInScene(scene: Scene): Set<string> {
  const flags = new Set<string>();
  for (const hotspot of scene.hotspots) {
    for (const effect of hotspot.lookEffects ?? []) if (effect.op === "flag") flags.add(effect.id);
    for (const effect of hotspot.act?.effects ?? []) if (effect.op === "flag") flags.add(effect.id);
    for (const effect of hotspot.take?.effects ?? []) if (effect.op === "flag") flags.add(effect.id);
  }
  return flags;
}

function checkEffect(
  effect: Effect,
  sceneIds: Set<string>,
  itemIds: Set<string>,
  chapter: Chapter,
  errors: string[],
): void {
  if (effect.op === "goto" && !sceneIds.has(effect.sceneId)) errors.push(`goto ${effect.sceneId}`);
  if (effect.op === "give" && !itemIds.has(effect.itemId)) errors.push(`give ${effect.itemId}`);
  if (effect.op === "ending" && !chapter.endings[effect.id]) errors.push(`fin inconnue ${effect.id}`);
}
