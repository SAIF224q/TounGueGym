import type { PracticeMode } from "./types";

/** Core loop: learn the parts → practice full articulation → quick rating */
export const PRACTICE_STAGES = ["learn", "practice", "rate"] as const;

export type PracticeStage = (typeof PRACTICE_STAGES)[number];

export const stageLabels: Record<PracticeStage, string> = {
  learn: "Learn",
  practice: "Practice",
  rate: "Rate",
};

export const stageButtonLabels: Record<PracticeStage, string> = {
  learn: "Ready to practice",
  practice: "How did it feel?",
  rate: "Next",
};

export const stageKickers: Record<PracticeStage, string> = {
  learn: "Break it down",
  practice: "Say it out loud",
  rate: "Quick reflection",
};

export const totalStages = PRACTICE_STAGES.length;

export function isLastStage(stageIndex: number): boolean {
  return stageIndex === totalStages - 1;
}

export function isFirstStage(stageIndex: number): boolean {
  return stageIndex === 0;
}

export function getPracticeStages(_mode?: PracticeMode): readonly PracticeStage[] {
  return PRACTICE_STAGES;
}
