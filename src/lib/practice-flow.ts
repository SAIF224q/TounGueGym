export const PRACTICE_STAGES = [
  "observe",
  "chunk",
  "pronounce",
  "context",
  "repeat",
] as const;

export type PracticeStage = (typeof PRACTICE_STAGES)[number];

export const stageLabels: Record<PracticeStage, string> = {
  observe: "Observe",
  chunk: "Chunk",
  pronounce: "Pronounce",
  context: "Context",
  repeat: "Repeat",
};

export const stageButtonLabels: Record<PracticeStage, string> = {
  observe: "Continue",
  chunk: "Continue",
  pronounce: "Continue",
  context: "Start Repeating",
  repeat: "Next Word",
};

export const totalStages = PRACTICE_STAGES.length;

export function isLastStage(stageIndex: number): boolean {
  return stageIndex === totalStages - 1;
}

export function isFirstStage(stageIndex: number): boolean {
  return stageIndex === 0;
}
