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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans text-gray-900">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
          <header className="border-b bg-white px-4 py-3">
            <h1 className="text-lg font-semibold">Poultry Farm Management</h1>
          </header>
          <main className="flex-1 px-4 py-4">{children}</main>
          <AppNav />
        </div>
      </body>
    </html>
  );
}
