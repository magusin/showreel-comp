import SideModuleNav from "./SideModuleNav";
import Link from "next/link";

export default function IndustryLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-72 bg-white/90 backdrop-blur border-r border-gray-200 px-6 py-8 flex flex-col sticky top-0 h-screen">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Industrie</h2>
          <p className="text-xs text-gray-500">Monitoring & ressources</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/industry" className="px-3 py-2 rounded-lg hover:bg-gray-100">📊 Tableau de bord</Link>
          <Link href="/industry/resources" className="px-3 py-2 rounded-lg hover:bg-gray-100">📦 Ressources</Link>
          <Link href="/industry/orders" className="px-3 py-2 rounded-lg hover:bg-gray-100">🧾 Commandes</Link>
        </nav>
        <div className="mt-auto">
          <SideModuleNav current="industry" />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
