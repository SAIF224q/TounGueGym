import type { Metadata } from "next";
import { HydrateStore } from "@/components/HydrateStore";
import "./globals.css";

export const metadata: Metadata = {
  title: "TounGueGym",
  description: "AI-powered pronunciation practice for smoother speech.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="theme-obsidian">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tg-theme') || 'obsidian';
                  document.documentElement.className = 'theme-' + theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <HydrateStore />
        {children}
      </body>
    </html>
  );
}
