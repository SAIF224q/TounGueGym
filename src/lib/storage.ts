import type { PracticeHistoryRecord, PracticeItem, RecentSession, SessionSettings } from "./types";

const keys = {
  favorites: "favorites",
  recentSessions: "recent_sessions",
  settings: "settings",
  practiceHistory: "practice_history",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readFavorites() {
  return readJson<PracticeItem[]>(keys.favorites, []);
}

export function writeFavorites(items: PracticeItem[]) {
  writeJson(keys.favorites, items);
}

export function readSettings() {
  return readJson<SessionSettings | null>(keys.settings, null);
}

export function writeSettings(settings: SessionSettings) {
  writeJson(keys.settings, settings);
}

export function readRecentSessions() {
  return readJson<RecentSession[]>(keys.recentSessions, []);
}

export function writeRecentSession(session: RecentSession) {
  const sessions = readRecentSessions();
  writeJson(keys.recentSessions, [session, ...sessions].slice(0, 12));
}

export function readPracticeHistory() {
  return readJson<PracticeHistoryRecord[]>(keys.practiceHistory, []);
}

export function writePracticeHistory(history: PracticeHistoryRecord[]) {
  writeJson(keys.practiceHistory, history);
}
