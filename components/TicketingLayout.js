import SideModuleNav from "./SideModuleNav";
import Link from "next/link";

export default function TicketingLayout({ children }) {
    return (
      
      <div className="min-h-screen flex bg-gray-50 text-gray-900">
        <aside className="w-72 bg-white/90 backdrop-blur border-r border-gray-200 px-6 py-8 flex flex-col sticky top-0 h-screen">
          <div>
            <h2 className="text-xl font-bold">Ticketing</h2>
            <p className="text-xs text-gray-500">Module de démonstration</p>
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/ticketing" className="px-3 py-2 rounded-lg hover:underline">📊 Tableau de bord</Link>
            <Link href="/ticketing/new" className="px-3 py-2 rounded-lg hover:underline">➕ Nouveau ticket</Link>
            <Link href="/ticketing/kb" className="px-3 py-2 rounded-lg hover:underline">📚 Base de connaissances</Link>
          </nav>
          <div className="mt-auto">
    <SideModuleNav current="ticketing" />
  </div>
        </aside>
        
        {/* Contenu */}
        <main className="flex-1 p-6">{children}</main>
        
      </div>
    );
  }
  