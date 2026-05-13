import type { Metadata } from "next";
import { HydrateStore } from "@/components/HydrateStore";
import "./globals.css";

export const metadata: Metadata = {
  title: "TounGueGym",
  description: "AI-powered pronunciation practice for smoother speech.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <HydrateStore />
        {children}
      </body>
    </html>
  );
}
