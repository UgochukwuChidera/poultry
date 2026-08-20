import Link from "next/link";

const items = [
  { href: "/", label: "Home", group: "Overview" },
  { href: "/farm", label: "Farm", group: "Setup" },
  { href: "/eggs", label: "Eggs", group: "Daily work" },
  { href: "/money", label: "Money", group: "Finance" },
  { href: "/history", label: "History", group: "Records" },
];

export function AppNav() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white/90 px-4 py-5 lg:block">
        <nav aria-label="Primary navigation" className="sticky top-5 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Poultry</p>
            <p className="mt-1 text-xl font-bold text-gray-950">Farm Management</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-950">
            <p className="font-semibold">Current farm</p>
            <p className="text-emerald-800">Daily operations workspace</p>
          </div>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href={item.href}>
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">{item.group}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <nav aria-label="Primary navigation" className="sticky bottom-0 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] lg:hidden">
        <ul className="mx-auto flex w-full max-w-4xl justify-between gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link className="block rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
