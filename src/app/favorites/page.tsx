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
      <div className="mx-auto max-w-5xl px-6 py-20">
        <header>
          <h1 className="text-4xl font-semibold">Curated Collection</h1>
          <p className="mt-5 max-w-xl text-xl leading-8 text-stone-600">
            Your saved terminology and pronunciation specimens, reserved for focused study.
          </p>
        </header>

        <label className="kicker mt-20 block" htmlFor="favorites-search">
          Index Search
        </label>
        <div className="mt-5 flex max-w-4xl items-center gap-5 border-b border-stone-400 pb-4">
          <Search className="size-7 text-stone-600" />
          <input
            id="favorites-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Locate a specimen..."
            className="h-10 flex-1 bg-transparent text-xl outline-none placeholder:text-stone-400"
          />
        </div>

        <section className="mt-16 grid gap-3 md:grid-cols-2">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className={`relative border border-stone-200 bg-[var(--paper)] p-8 ${index === 0 ? "md:row-span-2 md:min-h-80" : "min-h-56"}`}
            >
              <p className="kicker">{item.mode.replace("_", " ")}</p>
              <button
                type="button"
                onClick={() => toggleFavorite(item)}
                title="Remove favorite"
                aria-label="Remove favorite"
                className="absolute right-8 top-8 text-[var(--green)]"
              >
                <Star className="size-7" fill="currentColor" strokeWidth={1.7} />
              </button>
              <div className="mt-16">
                <h2 className={`${index === 0 ? "text-5xl" : "text-3xl"} font-black`}>{item.text}</h2>
                <div className="mt-8 border-t border-stone-200 pt-6">
                  <p className="font-mono text-stone-600">{item.ipa ?? item.breakdown}</p>
                  {index === 0 && item.sentence && <p className="mt-5 max-w-sm text-lg leading-8 text-stone-600">{item.sentence}</p>}
                </div>
              </div>
            </article>
          ))}
        </section>

        {!filtered.length && (
          <div className="mt-16 border border-stone-200 px-8 py-16 text-center">
            <h2 className="text-3xl font-black text-[var(--green)]">No saved items yet</h2>
            <p className="mt-4 text-stone-600">Favorite difficult items during practice and they will appear here.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
