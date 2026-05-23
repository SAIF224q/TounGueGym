"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { readRecentSessions, readPracticeHistory, writeRecentSession, writePracticeHistory } from "@/lib/storage";
import type { RecentSession, PracticeHistoryRecord, PracticeRating, PracticeMode, Difficulty } from "@/lib/types";
import { Flame, Trophy, CheckCircle, Star, Calendar, RefreshCw, Trash2, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  const [sessions, setSessions] = useState<RecentSession[]>([]);
  const [history, setHistory] = useState<PracticeHistoryRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    const loadedSessions = readRecentSessions();
    const loadedHistory = readPracticeHistory();
    setSessions(loadedSessions);
    setHistory(loadedHistory);
    setStreak(calculateStreak(loadedSessions));
  };

  function calculateStreak(sessionList: RecentSession[]): number {
    if (!sessionList.length) return 0;
    
    // Extract unique dates of completions
    const uniqueDays = new Set(
      sessionList.map((s) => new Date(s.completedAt).toDateString())
    );
    
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Check if practiced today
    if (uniqueDays.has(checkDate.toDateString())) {
      while (uniqueDays.has(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      // Check if practiced yesterday, starting streak from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      if (uniqueDays.has(checkDate.toDateString())) {
        while (uniqueDays.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }
    return currentStreak;
  }

  // Calculate difficulty counts
  const difficultItems = history.filter((h) => h.rating === "difficult");
  const trickyItems = history.filter((h) => h.rating === "tricky");
  const easyItems = history.filter((h) => h.rating === "easy");
  const totalRated = history.length || 1;

  const diffPercentages = {
    difficult: Math.round((difficultItems.length / totalRated) * 100),
    tricky: Math.round((trickyItems.length / totalRated) * 100),
    easy: Math.round((easyItems.length / totalRated) * 100),
  };

  // Reconstruct target text from itemId slug (split parts slice after index 4)
  const formatTextSlug = (id: string) => {
    const parts = id.split("-");
    if (parts.length <= 4) return id;
    const slug = parts.slice(4).join(" ");
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  // Extract meta info from ID
  const getMetaFromId = (id: string): { mode: string; difficulty: string } => {
    const parts = id.split("-");
    return {
      mode: parts[0] || "word",
      difficulty: parts[2] || "medium",
    };
  };

  // Generate gorgeous mock data for demo preview if the user has no history!
  const generateMockData = () => {
    const today = new Date();
    
    // 1. Create a series of recent sessions
    const mockSessions: RecentSession[] = [
      {
        id: "mock-1",
        mode: "word",
        domain: "Business",
        difficulty: "medium",
        count: 10,
        completedAt: today.toISOString(),
        itemsPracticed: 10,
        newFavorites: 2,
      },
      {
        id: "mock-2",
        mode: "phrase",
        domain: "Technology",
        difficulty: "hard",
        count: 12,
        completedAt: new Date(today.getTime() - 24 * 3600000).toISOString(), // Yesterday
        itemsPracticed: 12,
        newFavorites: 1,
      },
      {
        id: "mock-3",
        mode: "tongue_twister",
        domain: "Public Speaking",
        difficulty: "easy",
        count: 6,
        completedAt: new Date(today.getTime() - 2 * 24 * 3600000).toISOString(), // 2 days ago
        itemsPracticed: 6,
        newFavorites: 3,
      },
      {
        id: "mock-4",
        mode: "word",
        domain: "Medical",
        difficulty: "hard",
        count: 10,
        completedAt: new Date(today.getTime() - 3 * 24 * 3600000).toISOString(), // 3 days ago
        itemsPracticed: 10,
        newFavorites: 0,
      },
      {
        id: "mock-5",
        mode: "phrase",
        domain: "Academic",
        difficulty: "medium",
        count: 8,
        completedAt: new Date(today.getTime() - 5 * 24 * 3600000).toISOString(), // 5 days ago (Stops the streak!)
        itemsPracticed: 8,
        newFavorites: 2,
      }
    ];

    // 2. Create some sample ratings in practice history
    const mockHistory: PracticeHistoryRecord[] = [
      {
        itemId: "word-Business-hard-0-entrepreneurial",
        rating: "difficult",
        repetitionCount: 4,
        lastPracticedAt: today.getTime(),
      },
      {
        itemId: "phrase-Technology-hard-1-specific-statistical-system",
        rating: "tricky",
        repetitionCount: 3,
        lastPracticedAt: today.getTime() - 24 * 3600000,
      },
      {
        itemId: "word-Business-medium-2-regularly",
        rating: "easy",
        repetitionCount: 5,
        lastPracticedAt: today.getTime() - 24 * 3600000,
      },
      {
        itemId: "tongue_twister-Public Speaking-easy-3-she-sells-sea-shells",
        rating: "easy",
        repetitionCount: 2,
        lastPracticedAt: today.getTime() - 2 * 24 * 3600000,
      },
      {
        itemId: "word-Medical-hard-4-anesthesiologist",
        rating: "difficult",
        repetitionCount: 3,
        lastPracticedAt: today.getTime() - 3 * 24 * 3600000,
      },
      {
        itemId: "phrase-Academic-medium-5-cognitive-dissonance",
        rating: "tricky",
        repetitionCount: 2,
        lastPracticedAt: today.getTime() - 5 * 24 * 3600000,
      },
      {
        itemId: "word-Everyday-easy-6-comfortable",
        rating: "easy",
        repetitionCount: 6,
        lastPracticedAt: today.getTime() - 5 * 24 * 3600000,
      }
    ];

    // Save to localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("recent_sessions", JSON.stringify(mockSessions));
      window.localStorage.setItem("practice_history", JSON.stringify(mockHistory));
    }
    loadData();
  };

  // Clear statistics history
  const clearStats = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("recent_sessions");
      window.localStorage.removeItem("practice_history");
    }
    loadData();
  };

  // Get active practice days for visual 7-day card
  const getWeeklyPracticeMap = () => {
    const daysMap = [false, false, false, false, false, false, false]; // Mon to Sun
    const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // JS Day map: Mon=1, Tue=2... Sun=0
    
    const today = new Date();
    const currentWeekSessions = sessions.filter((s) => {
      const sDate = new Date(s.completedAt);
      const diffTime = Math.abs(today.getTime() - sDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    currentWeekSessions.forEach((s) => {
      const dayOfWeek = new Date(s.completedAt).getDay();
      const index = dayIndices.indexOf(dayOfWeek);
      if (index !== -1) daysMap[index] = true;
    });

    return daysMap;
  };

  const weeklyPractice = getWeeklyPracticeMap();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!mounted) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 relative z-10 animate-fade-in">
        
        {/* Dashboard Header */}
        <header className="soft-card rounded-[2.2rem] p-6 sm:p-9 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] opacity-70" />
          <div>
            <p className="kicker">Training Room</p>
            <h1 className="brand mt-2 text-4xl sm:text-5xl tracking-tight">Practice Dashboard</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              Track your day-to-day muscle memory streak, review difficult words, and keep your vocal chords active.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={generateMockData}
              title="Fill mock dashboard statistics for preview"
              type="button"
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-xs font-bold text-[var(--accent-dark)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              <RefreshCw className="size-3.5" />
              <span>Demo Data</span>
            </button>
            {sessions.length > 0 && (
              <button
                onClick={clearStats}
                title="Reset local storage analytics history"
                type="button"
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Analytics Grid */}
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Streak */}
          <div className="soft-card rounded-3xl p-5.5 flex items-center gap-4.5">
            <div className="size-13 rounded-2xl bg-[color-mix(in srgb,var(--accent),transparent_90%)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Flame className="size-6.5 fill-current" />
            </div>
            <div>
              <p className="kicker">Day Streak</p>
              <div className="text-3xl font-black text-[var(--accent-dark)] title-display mt-0.5">
                {streak} {streak === 1 ? "day" : "days"}
              </div>
            </div>
          </div>

          {/* Card 2: Sessions */}
          <div className="soft-card rounded-3xl p-5.5 flex items-center gap-4.5">
            <div className="size-13 rounded-2xl bg-[color-mix(in srgb,var(--sage),transparent_90%)] border border-[var(--line)] flex items-center justify-center text-[var(--sage)] shadow-sm">
              <Trophy className="size-6.5" />
            </div>
            <div>
              <p className="kicker">Completed Sets</p>
              <div className="text-3xl font-black text-[var(--ink)] title-display mt-0.5">
                {sessions.length}
              </div>
            </div>
          </div>

          {/* Card 3: Items Practiced */}
          <div className="soft-card rounded-3xl p-5.5 flex items-center gap-4.5">
            <div className="size-13 rounded-2xl bg-[color-mix(in srgb,var(--accent-dark),transparent_90%)] border border-[var(--line)] flex items-center justify-center text-[var(--accent-dark)] shadow-sm">
              <CheckCircle className="size-6.5" />
            </div>
            <div>
              <p className="kicker">Total Drills</p>
              <div className="text-3xl font-black text-[var(--ink)] title-display mt-0.5">
                {sessions.reduce((acc, s) => acc + s.itemsPracticed, 0)}
              </div>
            </div>
          </div>

          {/* Card 4: Revisit Radar */}
          <div className="soft-card rounded-3xl p-5.5 flex items-center gap-4.5">
            <div className="size-13 rounded-2xl bg-[color-mix(in srgb,var(--accent),transparent_90%)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Star className="size-6.5 fill-current" />
            </div>
            <div>
              <p className="kicker">Vocal Weakpoints</p>
              <div className="text-3xl font-black text-[var(--ink)] title-display mt-0.5">
                {history.filter((h) => h.rating === "difficult" || h.rating === "tricky").length}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Section */}
        <div className="mt-6 grid gap-6 md:grid-cols-[1.3fr_1fr]">
          
          {/* Chart Left: Weekly Contribution Grid & Spacing */}
          <div className="soft-card rounded-[2rem] p-6.5">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="size-5 text-[var(--accent)]" />
              <h2 className="text-lg font-black text-[var(--ink)] title-display">Vocal Training Activity</h2>
            </div>
            
            <div className="bg-[var(--surface-strong)]/40 border border-[var(--line)]/50 rounded-2xl p-5 text-center">
              <p className="text-xs font-bold text-[var(--muted)] mb-4">Practice map (Last 7 days)</p>
              
              <div className="grid grid-cols-7 gap-3 sm:gap-4 max-w-lg mx-auto">
                {weeklyPractice.map((active, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-full aspect-square rounded-xl border streak-cell transition-all duration-300 ${
                        active 
                          ? "bg-[var(--accent)] border-[var(--accent-dark)] shadow-[0_0_12px_var(--glow)]" 
                          : "bg-[var(--surface)] border-[var(--line)]"
                      }`}
                    />
                    <span className="text-2xs font-extrabold text-[var(--muted)]">{dayNames[idx]}</span>
                  </div>
                ))}
              </div>
              
              {sessions.length > 0 ? (
                <p className="mt-5 text-xs text-[var(--sage)] font-bold flex items-center justify-center gap-1.5">
                  <Award className="size-4" />
                  Your articulation muscles are forming correctly! Keep it up.
                </p>
              ) : (
                <p className="mt-5 text-xs text-[var(--muted)]">
                  Launch a training session to start lighting up your week.
                </p>
              )}
            </div>
          </div>

          {/* Chart Right: Difficulty ratios segments */}
          <div className="soft-card rounded-[2rem] p-6.5 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black text-[var(--ink)] title-display mb-1">Articulation Feedback</h2>
              <p className="text-2xs font-bold text-[var(--muted)] mb-5 uppercase tracking-wider">Difficulty Ratios</p>
            </div>
            
            {history.length > 0 ? (
              <div className="space-y-4">
                {/* Visual compound horizontal bar progress */}
                <div className="h-6.5 rounded-full overflow-hidden flex border border-[var(--line)]/40 shadow-inner">
                  {diffPercentages.easy > 0 && (
                    <div 
                      title={`Comfortable: ${diffPercentages.easy}%`}
                      className="h-full bg-[var(--sage)] border-r border-[var(--paper)] transition-all duration-300" 
                      style={{ width: `${diffPercentages.easy}%` }} 
                    />
                  )}
                  {diffPercentages.tricky > 0 && (
                    <div 
                      title={`Tricky: ${diffPercentages.tricky}%`}
                      className="h-full bg-amber-500 border-r border-[var(--paper)] transition-all duration-300" 
                      style={{ width: `${diffPercentages.tricky}%` }} 
                    />
                  )}
                  {diffPercentages.difficult > 0 && (
                    <div 
                      title={`Difficult: ${diffPercentages.difficult}%`}
                      className="h-full bg-rose-500 transition-all duration-300" 
                      style={{ width: `${diffPercentages.difficult}%` }} 
                    />
                  )}
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="text-center p-2 rounded-xl bg-[color-mix(in srgb,var(--sage),transparent_95%)] border border-[var(--line)]/30">
                    <span className="block text-xl font-black text-[var(--sage)]">{diffPercentages.easy}%</span>
                    <span className="text-2xs font-extrabold text-[var(--muted)]">Easy</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-amber-500/5 border border-[var(--line)]/30">
                    <span className="block text-xl font-black text-amber-500">{diffPercentages.tricky}%</span>
                    <span className="text-2xs font-extrabold text-[var(--muted)]">Tricky</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-rose-500/5 border border-[var(--line)]/30">
                    <span className="block text-xl font-black text-rose-500">{diffPercentages.difficult}%</span>
                    <span className="text-2xs font-extrabold text-[var(--muted)]">Difficult</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--surface-strong)]/40 border border-[var(--line)]/50 rounded-2xl p-5 text-center flex-1 grid place-items-center">
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Practice history is currently empty.<br />Reflect on items during your practice loop to display difficulties.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Dashboard Bottom Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1.8fr]">
          
          {/* Left Bottom Column: Revisit Radar List */}
          <section className="soft-card rounded-[2rem] p-6 sm:p-7 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <ShieldAlert className="size-5 text-[var(--accent)]" />
              <h2 className="text-lg font-black text-[var(--ink)] title-display">Revisit Queue</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-72 pr-1 space-y-2.5">
              {history.filter((h) => h.rating === "difficult" || h.rating === "tricky").length > 0 ? (
                history
                  .filter((h) => h.rating === "difficult" || h.rating === "tricky")
                  .sort((a, b) => b.lastPracticedAt - a.lastPracticedAt)
                  .map((record) => {
                    const text = formatTextSlug(record.itemId);
                    const { mode, difficulty } = getMetaFromId(record.itemId);
                    return (
                      <div 
                        key={record.itemId}
                        className="flex flex-col p-3 rounded-xl border border-[var(--line)]/50 bg-[var(--surface-strong)]/40 hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-sm text-[var(--ink)] truncate max-w-[160px]">{text}</span>
                          <span className={`text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            record.rating === "difficult" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {record.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-3xs font-bold text-[var(--muted)] mt-1.5">
                          <span>{mode} · {difficulty}</span>
                          <span>Repetitions: {record.repetitionCount}</span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="h-full border border-dashed border-[var(--line)] rounded-2xl p-6 text-center grid place-items-center">
                  <div>
                    <span className="text-2xl mb-1 block">💪</span>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">No weakpoints detected yet! Good job.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Bottom Column: Session Log */}
          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <h2 className="text-lg font-black text-[var(--ink)] title-display mb-5">Completed Drill Sessions</h2>
            
            <div className="overflow-x-auto">
              {sessions.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-3xs font-black uppercase tracking-wider text-[var(--muted)]">
                      <th className="pb-3 pl-1">Date</th>
                      <th className="pb-3">Domain</th>
                      <th className="pb-3">Mode</th>
                      <th className="pb-3">Difficulty</th>
                      <th className="pb-3 text-right pr-1">Practiced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]/50">
                    {sessions.map((session) => (
                      <tr key={session.id} className="text-xs font-semibold text-[var(--ink)] group hover:bg-[var(--surface-strong)]/20 transition-all">
                        <td className="py-3.5 pl-1 font-mono text-[var(--muted)] text-3xs">
                          {new Date(session.completedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="py-3.5 font-bold">{session.domain}</td>
                        <td className="py-3.5">
                          <span className="capitalize">{session.mode.replace("_", " ")}</span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-3xs font-black uppercase tracking-wide border ${
                            session.difficulty === "hard" 
                              ? "bg-rose-500/5 text-rose-500 border-rose-500/10" 
                              : session.difficulty === "medium" 
                                ? "bg-amber-500/5 text-amber-500 border-amber-500/10" 
                                : "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                          }`}>
                            {session.difficulty}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-1 font-black font-mono text-sm text-[var(--accent-dark)]">
                          {session.itemsPracticed} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="border border-dashed border-[var(--line)] rounded-2xl p-10 text-center">
                  <span className="text-3xl mb-3 block">📋</span>
                  <h3 className="text-sm font-bold text-[var(--ink)]">No completed sessions</h3>
                  <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                    Set up parameters and start practicing on the setup page to populate the history logs.
                  </p>
                  <Link href="/" className="soft-button mt-5 h-10 inline-flex items-center justify-center rounded-xl text-xs font-bold px-6 shadow-sm">
                    Start Session
                  </Link>
                </div>
              )}
            </div>
          </section>

        </div>

      </div>
    </AppShell>
  );
}
