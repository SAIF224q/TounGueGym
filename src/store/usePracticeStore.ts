"use client";

import { create } from "zustand";
import { getFallbackItems } from "@/lib/sample-data";
import { readFavorites, readPracticeHistory, readSettings, writeFavorites, writePracticeHistory, writeRecentSession, writeSettings } from "@/lib/storage";
import type { Difficulty, PracticeHistoryRecord, PracticeItem, PracticeMode, SessionSettings } from "@/lib/types";
import type { PracticeRating } from "@/lib/repetition-engine";
import { calculatePriority, getRevisitCandidates, mergeSessionItems, ratePracticeItem } from "@/lib/repetition-engine";

const TOTAL_STAGES = 6;

type PracticeState = {
  hydrated: boolean;
  settings: SessionSettings;
  items: PracticeItem[];
  index: number;
  stageIndex: number;
  favorites: PracticeItem[];
  loading: boolean;
  error?: string;
  sessionNewFavorites: number;
  practiceHistory: PracticeHistoryRecord[];
  hydrate: () => void;
  startSession: (settings: SessionSettings) => Promise<void>;
  next: () => void;
  previous: () => void;
  repeat: () => void;
  shuffle: () => void;
  toggleFavorite: (item: PracticeItem) => void;
  isFavorite: (id: string) => boolean;
  finishSession: () => void;
  advanceStage: () => void;
  previousStage: () => void;
  resetStage: () => void;
  rateItem: (itemId: string, rating: PracticeRating) => void;
  getRevisitItems: (count: number) => PracticeItem[];
};

const defaultSettings: SessionSettings = {
  mode: "word",
  domain: "Business",
  difficulty: "medium",
  count: 12,
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  hydrated: false,
  settings: defaultSettings,
  items: getFallbackItems(defaultSettings.mode, defaultSettings.domain, defaultSettings.difficulty, defaultSettings.count),
  index: 0,
  stageIndex: 0,
  favorites: [],
  loading: false,
  sessionNewFavorites: 0,
  practiceHistory: [],
  hydrate: () => {
    const settings = readSettings() ?? defaultSettings;
    set({
      hydrated: true,
      settings,
      favorites: readFavorites(),
      practiceHistory: readPracticeHistory(),
      items: getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count),
      stageIndex: 0,
    });
  },
  startSession: async (settings) => {
    set({ loading: true, error: undefined, settings, index: 0, stageIndex: 0, sessionNewFavorites: 0 });
    writeSettings(settings);

    try {
      const revisitIds = getRevisitCandidates(get().practiceHistory, Math.floor(settings.count * 0.3));

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Could not generate a fresh session.");
      const payload = (await response.json()) as { items?: PracticeItem[]; fallback?: boolean; message?: string };
      const newItems = payload.items?.length
        ? payload.items
        : getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count);

      const revisitItemIds = mergeSessionItems(newItems, revisitIds);

      set({
        items: newItems,
        loading: false,
        error: payload.fallback ? (payload.message ?? "Using built-in practice set until AI generation is available.") : undefined,
      });
    } catch {
      set({
        items: getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count),
        loading: false,
        error: "Using built-in practice set until AI generation is available.",
      });
    }
  },
  next: () => set((state) => ({ index: Math.min(state.index + 1, state.items.length), stageIndex: 0 })),
  previous: () => set((state) => ({ index: Math.max(state.index - 1, 0), stageIndex: 0 })),
  repeat: () => set((state) => ({ index: state.index, stageIndex: 0 })),
  shuffle: () => {
    const { items, index } = get();
    const current = items[index];
    const rest = items.filter((item) => item.id !== current?.id);
    const shuffled = [...rest].sort(() => Math.random() - 0.5);
    set({ items: current ? [current, ...shuffled] : shuffled, index: 0, stageIndex: 0 });
  },
  toggleFavorite: (item) => {
    const exists = get().favorites.some((favorite) => favorite.id === item.id);
    const favorites = exists
      ? get().favorites.filter((favorite) => favorite.id !== item.id)
      : [item, ...get().favorites];
    writeFavorites(favorites);
    set((state) => ({
      favorites,
      sessionNewFavorites: exists ? state.sessionNewFavorites : state.sessionNewFavorites + 1,
    }));
  },
  isFavorite: (id) => get().favorites.some((item) => item.id === id),
  finishSession: () => {
    const { settings, items, index, stageIndex, sessionNewFavorites } = get();
    const effectiveIndex = index >= items.length ? items.length : index;
    writeRecentSession({
      ...settings,
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      itemsPracticed: effectiveIndex + (stageIndex > 0 ? 1 : 0),
      newFavorites: sessionNewFavorites,
    });
  },
  advanceStage: () => {
    const { stageIndex, index, items } = get();
    if (stageIndex < TOTAL_STAGES - 1) {
      set({ stageIndex: stageIndex + 1 });
    } else {
      const nextIndex = index + 1;
      if (nextIndex >= items.length) {
        set({ index: items.length, stageIndex: 0 });
      } else {
        set({ index: nextIndex, stageIndex: 0 });
      }
    }
  },
  previousStage: () => {
    const { stageIndex, index } = get();
    if (stageIndex > 0) {
      set({ stageIndex: stageIndex - 1 });
    } else if (index > 0) {
      set({ index: index - 1, stageIndex: TOTAL_STAGES - 1 });
    }
  },
  resetStage: () => set({ stageIndex: 0 }),
  rateItem: (itemId, rating) => {
    const updated = ratePracticeItem(get().practiceHistory, itemId, rating);
    writePracticeHistory(updated);
    set({ practiceHistory: updated });
  },
  getRevisitItems: (count) => {
    const { practiceHistory } = get();
    const ids = getRevisitCandidates(practiceHistory, count);
    return ids.map((id) => ({ id } as PracticeItem));
  },
}));

export function formatMode(mode: PracticeMode) {
  return mode === "tongue_twister" ? "Tongue Twister" : mode[0].toUpperCase() + mode.slice(1);
}

export function formatDifficulty(difficulty: Difficulty) {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}
