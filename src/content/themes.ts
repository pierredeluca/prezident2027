import { NUCLEAIRE } from "./nucleaire";
import type { ThemeContent } from "./types";

export interface ThemeInfo {
  id: string;
  title: string;
  open: boolean;
}

/** Locked rows stay on the list. Opening one is a content file, nothing else. */
export const THEME_LIST: ThemeInfo[] = [
  { id: "nucleaire", title: "Le nucléaire", open: true },
  { id: "immigration", title: "L'immigration", open: false },
  { id: "education", title: "L'école", open: false },
  { id: "retraites", title: "Les retraites", open: false },
  { id: "impots", title: "Les impôts", open: false },
  { id: "sante", title: "La santé", open: false },
  { id: "securite", title: "La sécurité", open: false },
];

const OPEN: Record<string, ThemeContent> = {
  nucleaire: NUCLEAIRE,
};

export function themeContent(id: string): ThemeContent | null {
  return OPEN[id] ?? null;
}

export function requireTheme(id: string): ThemeContent {
  const theme = OPEN[id];
  if (!theme) throw new Error(`dossier fermé : ${id}`);
  return theme;
}
