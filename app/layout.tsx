import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import Search from "@/components/search";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DBD Stats",
  description: "Stats for Dead by Daylight on Steam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="absolute top-0 h-screen z-0 bg-background/100 overflow-hidden">
            <Image src="/bg.webp" alt="Background" width={1920} height={1200} />
          </div>
          <div className="absolute top-0 w-full h-screen z-0 bg-gradient-to-b from-background/75 to-background/100 backdrop-blur"></div>

          <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center p-4 justify-between space-x-4">
              <Link className="font-bold shrink-0" href="/">
                DBD Stats
              </Link>
              <Search />
              <ModeToggle />
            </div>
          </header>

          <main className="relative">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
