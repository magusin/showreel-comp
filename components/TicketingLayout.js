export default function TicketingLayout({ children }) {
    return (
      <div className="min-h-screen flex bg-gray-50 text-gray-900">
        {/* Sidebar (spécifique au module ticketing) */}
        <aside className="w-64 bg-white shadow px-6 py-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Ticketing</h2>
            <p className="text-xs text-gray-500">Module de démonstration</p>
          </div>
          <nav className="flex flex-col space-y-2">
            <a href="/ticketing" className="hover:underline">📊 Tableau de bord</a>
            <a href="/ticketing/new" className="hover:underline">➕ Nouveau ticket</a>
          </nav>
        </aside>
  
        {/* Contenu */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }
  