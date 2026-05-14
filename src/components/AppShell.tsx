"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Star, UserRoundCheck } from "lucide-react";
import { usePracticeStore } from "@/store/usePracticeStore";

const navItems = [
  { href: "/practice", label: "Practice", icon: UserRoundCheck },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/", label: "Setup", icon: Dumbbell },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const settings = usePracticeStore((state) => state.settings);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7e9_0,#efe6d8_38%,#e8ddcd_100%)] text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)]/70 bg-[var(--paper)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="brand text-2xl">
            TounGueGym
          </Link>
          <div className="hidden rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)] md:block">
            {settings.domain} · {settings.difficulty} · {settings.mode.replace("_", " ")}
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  active ? "bg-[var(--accent-dark)] text-[var(--surface)]" : "text-[var(--muted)] hover:bg-[var(--surface-strong)]"
                }`}
              >
                <Icon aria-hidden className="size-4" strokeWidth={2} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-5rem)]">{children}</main>
    </div>
  );
}
