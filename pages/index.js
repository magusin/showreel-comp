// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight text-xl">
            Showreel<span className="text-indigo-600">.app</span>
          </Link>
          <nav className="flex items-center gap-4 text-base">
            <Link className="hover:text-indigo-600" href="/ticketing">Tickets</Link>
            <Link className="hover:text-indigo-600" href="/industry">Industrie</Link>
            <Link className="hover:text-indigo-600" href="/roulette">Roulette</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Showreel interactif — démonstration de mes compétences
            </h1>
            <p className="mt-5 text-lg text-white/90">
              J’ai créé cette plateforme pour présenter des modules en lien avec mon
              parcours professionnel&nbsp;: support utilisateur, automatisation et
              gestion industrielle, ainsi que des outils d’analyse statistique.
              Le but&nbsp;: montrer concrètement mon parcours au-delà d’un CV.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#modules" className="px-5 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow hover:opacity-90">
                🚀 Explorer les modules
              </Link>
              <a href="/cv-hj.pdf" target="_blank" rel="noopener noreferrer"  className="px-5 py-3 border border-white/70 rounded-lg hover:bg-white/10">
                📄 Voir mon CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences reliées aux modules */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">💡 Compétences illustrées</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/ticketing" className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🎫</div>
            <h3 className="font-semibold">Support & Développement Web</h3>
            <p className="text-sm text-gray-600 mt-1">
              Module Tickets (Next.js + Prisma + PostgreSQL) : workflow, commentaires, stats.
            </p>
            <span className="mt-3 inline-flex items-center text-indigo-600 text-sm group-hover:underline">
              Voir le module →
            </span>
          </Link>
          <Link href="/industry" className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🏭</div>
            <h3 className="font-semibold">Automatisation & Gestion de données</h3>
            <p className="text-sm text-gray-600 mt-1">
              Module Industrie : machines, ressources, commandes auto, dashboard.
            </p>
            <span className="mt-3 inline-flex items-center text-indigo-600 text-sm group-hover:underline">
              Voir le module →
            </span>
          </Link>
          <Link href="/roulette" className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-semibold">Statistiques & DataViz</h3>
            <p className="text-sm text-gray-600 mt-1">
              Module Roulette : analyse de tirages, probas FR/US, export CSV, streaks.
            </p>
            <span className="mt-3 inline-flex items-center text-indigo-600 text-sm group-hover:underline">
              Voir le module →
            </span>
          </Link>
        </div>
      </section>

      {/* Modules — grandes cartes 100% cliquables */}
      <section id="modules" className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">🎬 Modules disponibles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ticketing */}
            <Link
              href="/ticketing"
              className="group relative rounded-2xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Ouvrir le module Ticketing"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500" />
              <div className="relative p-6 h-48 flex flex-col justify-between text-white">
                <div>
                  <div className="text-4xl">🎫</div>
                  <h3 className="mt-2 text-2xl font-extrabold">Ticketing</h3>
                  <p className="text-white/90 text-sm">Incidents, statuts, commentaires riches.</p>
                </div>
                <div className="text-sm font-medium opacity-90 group-hover:opacity-100">
                  Cliquer pour ouvrir →
                </div>
              </div>
            </Link>

            {/* Industrie */}
            <Link
              href="/industry"
              className="group relative rounded-2xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Ouvrir le module Industrie"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500" />
              <div className="relative p-6 h-48 flex flex-col justify-between text-white">
                <div>
                  <div className="text-4xl">🏭</div>
                  <h3 className="mt-2 text-2xl font-extrabold">Industrie</h3>
                  <p className="text-white/90 text-sm">Machines, ressources, automatisation des commandes.</p>
                </div>
                <div className="text-sm font-medium opacity-90 group-hover:opacity-100">
                  Cliquer pour ouvrir →
                </div>
              </div>
            </Link>

            {/* Roulette */}
            <Link
              href="/roulette"
              className="group relative rounded-2xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Ouvrir le module Roulette"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-fuchsia-500 to-purple-500" />
              <div className="relative p-6 h-48 flex flex-col justify-between text-white">
                <div>
                  <div className="text-4xl">🎲</div>
                  <h3 className="mt-2 text-2xl font-extrabold">Roulette</h3>
                  <p className="text-white/90 text-sm">Stats FR/US, export CSV, streaks.</p>
                </div>
                <div className="text-sm font-medium opacity-90 group-hover:opacity-100">
                  Cliquer pour ouvrir →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi ce showreel */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-3">Pourquoi ce showreel&nbsp;?</h2>
            <p className="text-gray-700">
              Plutôt qu’un CV statique, cette plateforme montre mes compétences en situation&nbsp;:
              gestion de tickets et d’utilisateurs, automatisation de flux métiers, intégration base
              de données et visualisation de données. Chaque module illustre une facette de mon profil; industrie, IT, croupier.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <h3 className="font-semibold">Stack</h3>
            <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc list-inside">
              <li>Next.js (Pages)</li>
              <li>Prisma + PostgreSQL (Neon)</li>
              <li>TailwindCSS</li>
              <li>Recharts (charts client)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-lg">
          © {new Date().getFullYear()} — Showreel démonstratif. Conçu pour montrer mes compétences multi-métiers.
        </div>
      </footer>
    </div>
  );
}
