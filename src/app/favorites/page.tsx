"use client";

import { Search, Star, Play, StarOff, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { usePracticeStore } from "@/store/usePracticeStore";

export default function FavoritesPage() {
  const router = useRouter();
  const favorites = usePracticeStore((state) => state.favorites);
  const toggleFavorite = usePracticeStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => favorites.filter((item) => 
      `${item.text} ${item.breakdown} ${item.domain}`.toLowerCase().includes(query.toLowerCase())
    ),
    [favorites, query]
  );

  // Instantly start a training session practicing ONLY favorited items
  const startFavoriteSession = () => {
    if (!favorites.length) return;

    // Direct Zustand State Override for custom favorites practice!
    usePracticeStore.setState({
      items: favorites,
      index: 0,
      stageIndex: 0,
      settings: {
        mode: favorites[0]?.mode || "word",
        domain: "Saved Favorites",
        difficulty: "hard",
        count: favorites.length
      }
    });

    router.push("/practice");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 relative z-10 animate-fade-in">
        
        {/* Page Header */}
        <header className="soft-card rounded-[2.2rem] p-6 sm:p-9 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] opacity-70" />
          <div>
            <p className="kicker">Archive Vault</p>
            <h1 className="brand mt-2 text-4xl sm:text-5xl tracking-tight">Saved Drills</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
              Retain challenging articulations, review their breakdowns, and launch focused revision sessions anytime.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={startFavoriteSession}
              type="button"
              className="soft-button flex h-12 items-center gap-2 rounded-2xl px-6 font-bold shadow-md text-xs sm:text-sm whitespace-nowrap active:scale-98"
            >
              <Play className="size-4 fill-current" />
              <span>Practice Stars</span>
            </button>
          )}
        </header>

        {/* Search Bar */}
        <div className="mt-8 flex items-center gap-4.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all duration-300 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15 max-w-2xl">
          <Search className="size-5 text-[var(--muted)]" />
          <input
            id="favorites-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Locate a challenging sound..."
            className="h-10 flex-1 bg-transparent text-base font-semibold outline-none text-[var(--ink)] placeholder:text-[var(--muted)]/60"
          />
        </div>

        {/* Favorites Grid */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="soft-card relative rounded-3xl p-6.5 flex flex-col justify-between min-h-60 group overflow-hidden transition-all duration-300"
            >
              {/* Subtle top indicator */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--line)]/50 group-hover:bg-[var(--accent)] transition-all duration-300" />
              
              <div>
                <div className="flex justify-between items-center gap-4">
                  <span className="rounded-full bg-[var(--surface-strong)] border border-[var(--line)]/50 px-3 py-1 text-3xs font-black uppercase tracking-wider text-[var(--muted)]">
                    {item.mode.replace("_", " ")}
                  </span>
                  
                  {/* Remove favorite button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    title="Remove item"
                    aria-label="Remove item"
                    className="grid size-9.5 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)] border border-[var(--line)] hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500 transition-all duration-200"
                  >
                    <StarOff className="size-4.5" />
                  </button>
                </div>

                <div className="mt-7">
                  <h2 className="text-2xl font-black leading-tight text-[var(--ink)] break-all title-display">
                    {item.text}
                  </h2>
                  
                  <div className="mt-5 rounded-2xl bg-[var(--surface-strong)]/60 border border-[var(--line)]/30 p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]">
                    <p className="break-all font-bold text-xs tracking-wide text-[var(--accent-dark)]">
                      {item.breakdown}
                    </p>
                    {item.ipa && (
                      <p className="mt-1.5 font-mono text-3xs text-[var(--muted)]">
                        [{item.ipa}]
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Meta Tags */}
              <div className="mt-6 flex items-center justify-between text-3xs font-bold text-[var(--muted)] border-t border-[var(--line)]/30 pt-3.5">
                <span>Domain: {item.domain}</span>
                <span className="uppercase tracking-wider font-extrabold text-[var(--sage)]">{item.difficulty}</span>
              </div>
            </article>
          ))}
        </section>

        {/* Empty state visual */}
        {!filtered.length && (
          <div className="soft-card mt-8 rounded-[2.2rem] px-8 py-16 text-center border-dashed relative overflow-hidden">
            <div className="size-16 rounded-2xl bg-[var(--surface-strong)] border border-[var(--line)] flex items-center justify-center text-[var(--muted)] mx-auto mb-6">
              <Star className="size-8" />
            </div>
            <h2 className="text-2xl font-black text-[var(--ink)] title-display">Vault is empty</h2>
            <p className="mt-3 max-w-sm mx-auto text-xs text-[var(--muted)] leading-relaxed">
              Favorite tricky words during your practice training sets to add items here for dedicated offline revisions.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
