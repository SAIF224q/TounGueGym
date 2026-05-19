export type PracticeRating = "easy" | "tricky" | "difficult";

export type PracticeHistoryRecord = {
  itemId: string;
  rating: PracticeRating;
  repetitionCount: number;
  lastPracticedAt: number;
  nextReviewAt?: number;
};

const priorityMap: Record<PracticeRating, number> = {
  difficult: 3,
  tricky: 2,
  easy: 1,
};

export function calculatePriority(record: PracticeHistoryRecord): number {
  const base = priorityMap[record.rating];
  const recencyBoost = record.nextReviewAt && Date.now() >= record.nextReviewAt ? 1 : 0;
  return base + recencyBoost;
}

export function ratePracticeItem(
  history: PracticeHistoryRecord[],
  itemId: string,
  rating: PracticeRating,
): PracticeHistoryRecord[] {
  const existing = history.find((r) => r.itemId === itemId);
  const now = Date.now();

  if (existing) {
    return history.map((r) => {
      if (r.itemId !== itemId) return r;
      const newCount = r.repetitionCount + 1;
      return {
        ...r,
        rating,
        repetitionCount: newCount,
        lastPracticedAt: now,
        nextReviewAt: calculateNextReview(rating, newCount),
      };
    });
  }

  const newRecord: PracticeHistoryRecord = {
    itemId,
    rating,
    repetitionCount: 1,
    lastPracticedAt: now,
    nextReviewAt: calculateNextReview(rating, 1),
  };

  return [...history, newRecord];
}

function calculateNextReview(rating: PracticeRating, repetitionCount: number): number {
  const now = Date.now();
  const hour = 3600000;
  const day = hour * 24;

  switch (rating) {
    case "difficult":
      return now + Math.max(1, 3 - repetitionCount) * hour;
    case "tricky":
      return now + Math.max(1, 5 - repetitionCount) * hour;
    case "easy":
      return now + Math.max(1, 8 - repetitionCount) * day;
  }
}

export function getRevisitCandidates(
  history: PracticeHistoryRecord[],
  maxCount: number,
): string[] {
  const now = Date.now();
  const due = history.filter((r) => !r.nextReviewAt || now >= r.nextReviewAt);

  const sorted = due.sort((a, b) => calculatePriority(b) - calculatePriority(a));
  return sorted.slice(0, maxCount).map((r) => r.itemId);
}

export function mergeSessionItems(
  newItems: { id: string }[],
  revisitIds: string[],
): string[] {
  const existingIds = new Set(newItems.map((i) => i.id));
  const uniqueRevisits = revisitIds.filter((id) => !existingIds.has(id));
  return uniqueRevisits;
}
