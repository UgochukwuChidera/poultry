import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/farm", label: "Farm" },
  { href: "/eggs", label: "Eggs" },
  { href: "/money", label: "Money" },
  { href: "/history", label: "History" },
];

export function AppNav() {
  return (
    <nav className="sticky bottom-0 border-t bg-white p-3 sm:static sm:border-b sm:border-t-0">
      <ul className="mx-auto flex w-full max-w-4xl justify-between gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
