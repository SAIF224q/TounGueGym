import type { Difficulty, PracticeMode } from "./types";

export const modes: Array<{ value: PracticeMode; label: string }> = [
  { value: "word", label: "Word" },
  { value: "phrase", label: "Phrase" },
  { value: "tongue_twister", label: "Tongue Twister" },
];

export const domains = [
  "Everyday",
  "Medical",
  "Technology",
  "Business",
  "Academic",
  "Public Speaking",
];

export const difficulties: Array<{ value: Difficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];
