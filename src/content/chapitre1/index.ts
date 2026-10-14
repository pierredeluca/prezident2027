import type { Chapter } from "../../engine/types";
import { dialogues } from "./dialogues";
import { endings, items, sources } from "./records";
import { scenes } from "./scenes";

export const chapitre1: Chapter = {
  id: "chapitre-1",
  title: "Chapitre I",
  subtitle: "La nuit des fiches",
  startScene: "redaction",
  startMinutes: 19 * 60 + 40,
  items,
  scenes,
  dialogues,
  endings,
  sources,
};
