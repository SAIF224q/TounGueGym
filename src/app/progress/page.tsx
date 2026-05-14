"use client";

import { AppShell } from "@/components/AppShell";

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 text-center">
        <section className="soft-card rounded-[2.4rem] p-10">
          <p className="kicker">Progress</p>
          <h1 className="brand mt-6 text-6xl">Session History</h1>
          <p className="mx-auto mt-8 max-w-xl text-xl leading-8 text-[var(--muted)]">
            The MVP stores completed session summaries locally. Detailed analytics are ready to grow here after more practice data exists.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
