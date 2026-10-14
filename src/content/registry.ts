import type { Chapter } from "../engine/types";
import { chapitre1 } from "./chapitre1";

export const chapters: Chapter[] = [chapitre1];

export function getChapter(id: string | undefined): Chapter | undefined {
  if (!id) return chapters[0];
  return chapters.find((chapter) => chapter.id === id);
}
