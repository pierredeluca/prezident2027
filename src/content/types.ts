export interface Source {
  outlet: string;
  date: string;
  url: string;
  note: string;
}

export interface Clue {
  id: string;
  decoy: boolean;
  kind: "paper" | "video" | "chart" | "book" | "flyer";
  still?: string;
  date: string;
  quote: string;
  proves: string;
  sources: Source[];
}

export interface Claim {
  id: string;
  text: string;
  right: string[];
  corner: string;
  twist: string;
  source: Source;
}

export interface Politician {
  id: string;
  name: string;
  honest: boolean;
  /** What Lisnard repeats. Liars leave this empty and use claims. */
  line: string;
  honestReply: string;
  concede: string;
  claims: Claim[];
  source?: Source;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  clueId?: string;
  to?: string;
  npcId?: string;
}

export interface Room {
  id: string;
  name: string;
  hotspots: Hotspot[];
}

export interface Npc {
  id: string;
  name: string;
  line: string;
}

export interface ThemeContent {
  id: string;
  startRoom: string;
  minClues: number;
  rooms: Room[];
  clues: Clue[];
  politicians: Politician[];
  npcs: Npc[];
}
