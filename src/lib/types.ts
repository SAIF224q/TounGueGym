export type PracticeMode = "word" | "phrase" | "tongue_twister";

export type Difficulty = "easy" | "medium" | "hard";

export type PracticeItem = {
  id: string;
  text: string;
  breakdown: string;
  ipa?: string;
  sentence?: string;
  mode: PracticeMode;
  domain: string;
  difficulty: Difficulty;
};

export type SessionSettings = {
  mode: PracticeMode;
  domain: string;
  difficulty: Difficulty;
  count: number;
};

export type RecentSession = SessionSettings & {
  id: string;
  completedAt: string;
  itemsPracticed: number;
  newFavorites: number;
};
