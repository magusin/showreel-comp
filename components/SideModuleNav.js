import Link from "next/link";
import { useRouter } from "next/router";

export default function SideModuleNav({ current }) {
  const { pathname } = useRouter();
  const auto =
    pathname.startsWith("/ticketing") ? "ticketing" :
    pathname.startsWith("/industry")  ? "industry"  :
    pathname.startsWith("/roulette")  ? "roulette"  : "";
  const currentKey = current || auto;

  const items = [
    { key: "home",     href: "/",          label: "🏠 Accueil"   },
    { key: "ticketing",href: "/ticketing", label: "🎫 Tickets"   },
    { key: "industry", href: "/industry",  label: "🏭 Industrie" },
    { key: "roulette", href: "/roulette",  label: "🎲 Roulette"  },
  ];

  const visible = items.filter(it => it.key === "home" || it.key !== currentKey);

  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Naviguer vers</div>
      <div className="space-y-2">
        {visible.map(it => (
          <Link
            key={it.key}
            href={it.href}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md border text-sm bg-white hover:bg-gray-50"
          >
            <span>{it.label}</span>
            <span className="text-gray-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
