import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/nav";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poultry Farm Management",
  description: "Mobile-first poultry farm operations tracking",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 font-sans text-stone-900">
        <div className="flex min-h-screen w-full">
          <AppNav />
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="border-b border-stone-200 bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-stone-950">Poultry Farm Management</h1>
                  <p className="hidden text-sm text-stone-500 sm:block">Simple daily records for eggs, money, flocks, and history.</p>
                </div>
                <div className="hidden shrink-0 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 md:block">
                  {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
                </div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 pb-24 sm:px-6 lg:pb-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
