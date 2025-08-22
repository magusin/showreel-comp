export default function IndustryLayout({ children }) {
    return (
      <div className="min-h-screen flex bg-gray-50 text-gray-900">
        <aside className="w-72 bg-white/90 backdrop-blur border-r border-gray-200 px-6 py-8 space-y-6 sticky top-0 h-screen">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Industrie</h2>
            <p className="text-xs text-gray-500">Monitoring & ressources</p>
          </div>
          <nav className="flex flex-col gap-1">
            <a href="/industry" className="px-3 py-2 rounded-lg hover:bg-gray-100">📊 Tableau de bord</a>
            <a href="/industry/resources" className="px-3 py-2 rounded-lg hover:bg-gray-100">📦 Ressources</a>
            <a href="/industry/orders" className="px-3 py-2 rounded-lg hover:bg-gray-100">🧾 Commandes</a>
          </nav>
        </aside>
        <main className="flex-1 p-8"><div className="max-w-6xl mx-auto">{children}</div></main>
      </div>
    );
  }
  