"use client";

import { Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { usePracticeStore } from "@/store/usePracticeStore";

export default function FavoritesPage() {
  const favorites = usePracticeStore((state) => state.favorites);
  const toggleFavorite = usePracticeStore((state) => state.toggleFavorite);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => favorites.filter((item) => `${item.text} ${item.breakdown} ${item.domain}`.toLowerCase().includes(query.toLowerCase())),
    [favorites, query],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <header className="soft-card rounded-[2.2rem] p-8">
          <p className="kicker">Favorites</p>
          <h1 className="brand mt-3 text-5xl">Saved practice</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
            Keep the items that need another pass, then come back for a quieter focused review.
          </p>
        </header>

        <label className="kicker mt-10 block" htmlFor="favorites-search">
          Search
        </label>
        <div className="mt-4 flex max-w-4xl items-center gap-4 rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] px-5 py-3">
          <Search className="size-6 text-[var(--muted)]" />
          <input
            id="favorites-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Locate a specimen..."
            className="h-10 flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-[var(--muted)]/60"
          />
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className={`soft-card relative rounded-[1.9rem] p-6 ${index === 0 ? "md:row-span-2 md:min-h-80" : "min-h-56"}`}
            >
              <p className="kicker">{item.mode.replace("_", " ")}</p>
              <button
                type="button"
                onClick={() => toggleFavorite(item)}
                title="Remove favorite"
                aria-label="Remove favorite"
                className="absolute right-6 top-6 grid size-11 place-items-center rounded-full bg-[var(--surface-strong)] text-[var(--accent)]"
              >
                <Star className="size-5" fill="currentColor" strokeWidth={2} />
              </button>
              <div className="mt-12">
                <h2 className={`${index === 0 ? "text-5xl" : "text-3xl"} break-words font-black leading-tight text-[var(--ink)] [overflow-wrap:anywhere]`}>
                  {item.text}
                </h2>
                <div className="mt-8 rounded-[1.3rem] bg-[var(--surface-strong)] p-5">
                  <p className="break-words font-mono text-[var(--muted)] [overflow-wrap:anywhere]">{item.ipa || item.breakdown}</p>
                  {index === 0 && item.sentence && <p className="mt-5 max-w-sm text-lg leading-8 text-[var(--muted)]">{item.sentence}</p>}
                </div>
              </div>
            </article>
          ))}
        </section>

        {!filtered.length && (
          <div className="soft-card mt-10 rounded-[2rem] px-8 py-16 text-center">
            <h2 className="text-3xl font-black text-[var(--ink)]">No saved items yet</h2>
            <p className="mt-4 text-[var(--muted)]">Favorite difficult items during practice and they will appear here.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
