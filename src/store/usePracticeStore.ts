"use client";

import { create } from "zustand";
import { getFallbackItems } from "@/lib/sample-data";
import { readFavorites, readSettings, writeFavorites, writeRecentSession, writeSettings } from "@/lib/storage";
import type { Difficulty, PracticeItem, PracticeMode, SessionSettings } from "@/lib/types";

type PracticeState = {
  hydrated: boolean;
  settings: SessionSettings;
  items: PracticeItem[];
  index: number;
  favorites: PracticeItem[];
  loading: boolean;
  error?: string;
  sessionNewFavorites: number;
  hydrate: () => void;
  startSession: (settings: SessionSettings) => Promise<void>;
  next: () => void;
  previous: () => void;
  repeat: () => void;
  shuffle: () => void;
  toggleFavorite: (item: PracticeItem) => void;
  isFavorite: (id: string) => boolean;
  finishSession: () => void;
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
  favorites: [],
  loading: false,
  sessionNewFavorites: 0,
  hydrate: () => {
    const settings = readSettings() ?? defaultSettings;
    set({
      hydrated: true,
      settings,
      favorites: readFavorites(),
      items: getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count),
    });
  },
  startSession: async (settings) => {
    set({ loading: true, error: undefined, settings, index: 0, sessionNewFavorites: 0 });
    writeSettings(settings);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Could not generate a fresh session.");
      const payload = (await response.json()) as { items?: PracticeItem[]; fallback?: boolean };
      const items = payload.items?.length
        ? payload.items
        : getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count);
      set({
        items,
        loading: false,
        error: payload.fallback ? "Using built-in practice set until an OpenAI API key is added." : undefined,
      });
    } catch {
      set({
        items: getFallbackItems(settings.mode, settings.domain, settings.difficulty, settings.count),
        loading: false,
        error: "Using built-in practice set until AI generation is available.",
      });
    }
  },
  next: () => set((state) => ({ index: Math.min(state.index + 1, state.items.length) })),
  previous: () => set((state) => ({ index: Math.max(state.index - 1, 0) })),
  repeat: () => set((state) => ({ index: state.index })),
  shuffle: () => {
    const { items, index } = get();
    const current = items[index];
    const rest = items.filter((item) => item.id !== current?.id);
    const shuffled = [...rest].sort(() => Math.random() - 0.5);
    set({ items: current ? [current, ...shuffled] : shuffled, index: 0 });
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
    const { settings, items, index, sessionNewFavorites } = get();
    writeRecentSession({
      ...settings,
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      itemsPracticed: Math.min(index, items.length),
      newFavorites: sessionNewFavorites,
    });
  },
}));

export function formatMode(mode: PracticeMode) {
  return mode === "tongue_twister" ? "Tongue Twister" : mode[0].toUpperCase() + mode.slice(1);
}

export function formatDifficulty(difficulty: Difficulty) {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}
