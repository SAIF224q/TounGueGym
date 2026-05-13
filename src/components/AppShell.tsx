"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Settings, Star, UserRoundCheck } from "lucide-react";
import { usePracticeStore } from "@/store/usePracticeStore";

const navItems = [
  { href: "/practice", label: "Practice", icon: UserRoundCheck },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const settings = usePracticeStore((state) => state.settings);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-stone-950">
      <aside className="fixed inset-y-0 left-0 hidden w-[22rem] border-r border-stone-200 bg-[var(--paper)] px-9 py-12 lg:flex lg:flex-col">
        <Link href="/" className="brand max-w-full whitespace-nowrap text-[clamp(2rem,2.2vw,2.5rem)]">
          TounGueGym
        </Link>
        <p className="mt-6 max-w-52 text-sm tracking-[0.16em] text-stone-600">
          Daily Focus: {settings.domain} {settings.mode === "word" ? "English" : ""}
        </p>
        <nav className="mt-20 space-y-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-14 items-center gap-6 pl-1 text-sm font-semibold tracking-[0.18em] ${
                  active ? "text-stone-950" : "text-stone-600"
                }`}
              >
                {active && <span className="absolute -left-10 h-full w-1 bg-[var(--green)]" />}
                <Icon aria-hidden className="size-6" strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-4 text-sm font-semibold tracking-[0.18em]">
          <span className="grid size-12 place-items-center rounded-full border border-stone-300">TG</span>
          Profile
        </div>
      </aside>
      <main className="min-h-screen lg:pl-[22rem]">{children}</main>
    </div>
  );
}
