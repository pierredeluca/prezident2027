export type Verb = "regarder" | "prendre" | "parler" | "utiliser" | "aller";

export type Cond = {
  flag?: string;
  missingFlag?: string;
  missingFlags?: string[];
  flagsAll?: string[];
  item?: string;
  missingItem?: string;
  minFiches?: number;
  maxFiches?: number;
};

export type JournalKind = "ecart" | "note";

export type JournalEntry = {
  id: string;
  kind: JournalKind;
  candidate: string;
  title: string;
  documented: string;
  fiction: string;
  basis: string;
};

export type Effect =
  | { op: "flag"; id: string }
  | { op: "unflag"; id: string }
  | { op: "give"; itemId: string }
  | { op: "journal"; entry: JournalEntry }
  | { op: "forgetJournal"; id: string }
  | { op: "goto"; sceneId: string }
  | { op: "ending"; id: string };

export type Choice = {
  label: string;
  goto?: string;
  effects?: Effect[];
  when?: Cond;
};

export type DialogueNode = {
  id: string;
  speaker?: string;
  text: string;
  choices?: Choice[];
  next?: string;
};

export type UseWith = {
  itemId: string;
  text: string;
  alreadyText?: string;
  onceFlag?: string;
  when?: Cond;
  effects?: Effect[];
};

export type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  look: string;
  lookWhen?: { when: Cond; text: string }[];
  lookEffects?: Effect[];
  take?: {
    itemId: string;
    text: string;
    alreadyText: string;
    when?: Cond;
    blockedText?: string;
    effects?: Effect[];
  };
  talk?: {
    dialogueId: string;
    nodeId: string;
    routes?: { when: Cond; nodeId: string }[];
    requiresAllFlags?: string[];
    requires?: Cond;
    blockedText?: string;
  };
  go?: {
    sceneId: string;
    when?: Cond;
    blockedText?: string;
  };
  useWith?: UseWith[];
  act?: {
    label: string;
    text: string;
    alreadyText?: string;
    onceFlag?: string;
    effects?: Effect[];
  };
  when?: Cond;
};

export type Scene = {
  id: string;
  title: string;
  art: string;
  intro: string;
  timeCost: number;
  hotspots: Hotspot[];
};

export type Item = {
  id: string;
  name: string;
  look: string;
};

export type Ending = {
  title: string;
  paragraphs: string[];
  extraIfMisread?: string[];
};

export type Source = {
  title: string;
  detail: string;
  url?: string;
};

export type Chapter = {
  id: string;
  title: string;
  subtitle: string;
  startScene: string;
  startMinutes: number;
  items: Item[];
  scenes: Scene[];
  dialogues: Record<string, DialogueNode[]>;
  endings: Record<string, Ending>;
  sources: Source[];
};

export type LogLine = {
  speaker?: string;
  text: string;
};

export type GameState = {
  version: 1;
  chapterId: string;
  sceneId: string;
  minutes: number;
  flags: Record<string, true>;
  inventory: string[];
  selectedItemId: string | null;
  verb: Verb;
  focusId: string | null;
  journal: JournalEntry[];
  dialogue: { dialogueId: string; nodeId: string } | null;
  log: LogLine[];
  endingId: string | null;
  entered: Record<string, true>;
};
