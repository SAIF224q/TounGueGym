"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dumbbell, Moon, Star, Sun, UserRoundCheck, Leaf, Sparkles, BookOpen } from "lucide-react";
import { usePracticeStore } from "@/store/usePracticeStore";

const navItems = [
  { href: "/practice", label: "Practice", icon: UserRoundCheck },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/", label: "Setup", icon: Dumbbell },
];

const themes = [
  { name: "obsidian", label: "Obsidian Neon", color: "from-[#090d16] to-[#111827]", ring: "border-[#00f2fe] text-[#00f2fe]", icon: Moon },
  { name: "paper", label: "Paper Craft", color: "from-[#efe6d8] to-[#fffaf1]", ring: "border-[#c65f25] text-[#c65f25]", icon: BookOpen },
  { name: "emerald", label: "Emerald Sage", color: "from-[#f4f6f3] to-[#ffffff]", ring: "border-[#10b981] text-[#10b981]", icon: Leaf },
  { name: "royal", label: "Royal Velvet", color: "from-[#0b071a] to-[#16112b]", ring: "border-[#ec4899] text-[#ec4899]", icon: Sparkles },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const settings = usePracticeStore((state) => state.settings);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("obsidian");

  useEffect(() => {
    setMounted(true);
    const storedTheme = window.localStorage.getItem("tg-theme") || "obsidian";
    setTheme(storedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove("theme-paper", "theme-obsidian", "theme-emerald", "theme-royal");
    root.classList.add(`theme-${newTheme}`);
    window.localStorage.setItem("tg-theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,var(--surface-strong)_0,var(--paper)_60%,var(--paper)_100%)] text-[var(--ink)] transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-[var(--line)]/50 bg-[var(--paper)]/75 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="brand flex items-center gap-2 text-2xl spring-hover">
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] bg-clip-text text-transparent">TounGueGym</span>
          </Link>

          {/* Quick Domain Status */}
          {mounted && (
            <div className="hidden rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--muted)] md:block shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              Focus: <span className="text-[var(--accent)]">{settings.domain}</span> · {settings.difficulty} · {settings.mode.replace("_", " ")}
            </div>
          )}

          {/* Controls: Nav & Theme Picker */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Picker */}
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              {themes.map((t) => {
                const Icon = t.icon;
                const active = theme === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => handleThemeChange(t.name)}
                    title={t.label}
                    type="button"
                    className={`relative grid size-7.5 place-items-center rounded-full transition-all duration-300 ${
                      active
                        ? "bg-[var(--accent-dark)] text-[var(--paper)] scale-110 shadow-md ring-2 ring-[var(--accent)]/50"
                        : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon className="size-4" strokeWidth={active ? 2.5 : 2} />
                  </button>
                );
              })}
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-bold transition-all duration-300 ${
                      active
                        ? "nav-pill-active"
                        : "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon aria-hidden className="size-3.5" strokeWidth={2.5} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Decorative Blur Backgrounds */}
      <div className="relative min-h-[calc(100vh-5rem)]">
        <div className="glow-blob glow-1" />
        <div className="glow-blob glow-2" />
        <main className="relative z-10 w-full min-h-[calc(100vh-5rem)] transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
