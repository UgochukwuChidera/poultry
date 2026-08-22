"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", group: "Overview", icon: HomeIcon },
  { href: "/eggs", label: "Eggs", group: "Daily work", icon: EggIcon },
  { href: "/money", label: "Money", group: "Finance", icon: MoneyIcon },
  { href: "/history", label: "History", group: "Records", icon: HistoryIcon },
  { href: "/farm", label: "Farm", group: "Setup", icon: FarmIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 bg-barn-900 px-4 py-5 lg:block">
        <nav aria-label="Primary navigation" className="sticky top-5 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Poultry</p>
            <p className="mt-1 text-xl font-bold text-white">Farm Management</p>
          </div>
          <div className="egg-shape bg-barn-800/70 p-3 text-sm text-barn-100">
            <p className="font-semibold text-white">Current farm</p>
            <p className="text-barn-200">Daily operations workspace</p>
          </div>
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active ? "bg-amber-400 text-barn-950 shadow-sm" : "text-barn-100 hover:bg-barn-800"
                    }`}
                    href={item.href}
                  >
                    <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-barn-950" : "text-barn-300"}`} />
                    <span className="flex-1">{item.label}</span>
                    <span className={`text-xs ${active ? "text-barn-900" : "text-barn-400"}`}>{item.group}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <nav
        aria-label="Primary navigation"
        className="sticky bottom-0 bg-barn-900 p-2 shadow-[0_-8px_24px_rgba(11,28,19,0.25)] lg:hidden"
      >
        <ul className="mx-auto flex w-full max-w-4xl justify-between gap-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition ${
                    active ? "text-amber-400" : "text-barn-300 hover:text-barn-100"
                  }`}
                  href={item.href}
                >
                  <span className={`egg-shape flex h-8 w-8 items-center justify-center transition ${active ? "bg-amber-400" : "bg-white/5"}`}>
                    <item.icon className={`h-[18px] w-[18px] ${active ? "text-barn-950" : "text-barn-200"}`} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function EggIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 3.5c3.5 4 5.5 8.2 5.5 11.2a5.5 5.5 0 1 1-11 0c0-3 2-7.2 5.5-11.2Z" />
    </svg>
  );
}

function MoneyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 8v.01M18 16v.01" />
    </svg>
  );
}

function HistoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function FarmIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 21V10.5L12 5l8 5.5V21" />
      <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
      <path d="M14 5.5V3h3v4" />
    </svg>
  );
}
