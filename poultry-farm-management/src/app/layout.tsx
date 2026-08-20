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
      <body className="min-h-full bg-[#f5f7f2] font-sans text-gray-900">
        <div className="flex min-h-screen w-full">
          <AppNav />
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="border-b border-gray-200 bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-gray-950">Poultry Farm Management</h1>
                  <p className="hidden text-sm text-gray-500 sm:block">Simple daily records for eggs, money, flocks, and history.</p>
                </div>
                <div className="hidden rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 md:block">Search records</div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 pb-24 sm:px-6 lg:pb-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
