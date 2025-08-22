// components/RouletteLayout.js
import SideModuleNav from "./SideModuleNav";
import Link from "next/link";

export default function RouletteLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-72 bg-white/90 backdrop-blur border-r border-gray-200 px-6 py-8 flex flex-col sticky top-0 h-screen">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Roulette</h2>
          <p className="text-xs text-gray-500">Analyse statistique</p>
        </div>

        {/* Nav inter-modules centrée dans l'espace restant */}
        <div className="mt-auto">
          <SideModuleNav current="roulette" />
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
