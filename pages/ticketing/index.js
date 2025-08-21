import TicketingLayout from '@/components/TicketingLayout';
import dynamic from 'next/dynamic';

const StatusPie = dynamic(() => import('@/components/StatusPie'), { ssr: false });

const STATUS_COLORS = {
  OPEN:        '#3B82F6', // bleu
  IN_PROGRESS: '#F59E0B', // orange
  WAITING:     '#8B5CF6', // violet
  RESOLVED:    '#10B981', // vert
  CLOSED:      '#6B7280', // gris
};

const ALL_STATUSES = ['OPEN','IN_PROGRESS','WAITING','RESOLVED','CLOSED'];

export async function getServerSideProps(ctx) {
  const prisma = (await import('@/lib/prisma')).default;

  // 'DEFAULT' = notre valeur interne pour "tous sauf RESOLVED"
  const statusParam = ctx.query.status || 'DEFAULT';

  const total = await prisma.ticket.count();
  const grouped = await prisma.ticket.groupBy({ by: ['status'], _count: { status: true } });
  const byStatus = Object.fromEntries(grouped.map(g => [g.status, g._count.status]));

  const latest = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, subject: true, status: true, createdAt: true, reporterName: true }
  });

  // Filtrage liste complète
  let where = {};
  if (statusParam === 'DEFAULT') {
    where = { NOT: { status: 'RESOLVED' } };
  } else if (statusParam === 'ALL') {
    where = {}; // pas de filtre
  } else {
    where = { status: statusParam }; // OPEN / IN_PROGRESS / ...
  }

  const allTickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, subject: true, status: true, createdAt: true, reporterName: true }
  });

  return {
    props: {
      total,
      byStatus,
      latest: JSON.parse(JSON.stringify(latest)),
      allTickets: JSON.parse(JSON.stringify(allTickets)),
      statusParam,
    },
  };
}

export default function TicketingDashboard({
  total = 0,
  byStatus = {},
  latest = [],
  allTickets = [],
  statusParam = 'DEFAULT',
}) {
  const pieData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  function setFilter(next) {
    const params = new URLSearchParams(window.location.search);
    if (next === 'DEFAULT') { // notre valeur interne pour "exclure RESOLVED"
      params.delete('status');
    } else {
      params.set('status', next);
    }
    const search = params.toString();
    window.location.href = `/ticketing${search ? `?${search}` : ''}`;
  }

  return (
    <TicketingLayout>
      <div className="space-y-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-sm text-gray-500 mt-1">
              Statistiques globales, derniers tickets, et liste complète filtrable.
            </p>
          </div>
          <a
            href="/ticketing/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            ➕ Nouveau ticket
          </a>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Tickets totaux</p>
            <p className="text-3xl font-bold mt-1">{total}</p>
          </div>
          {ALL_STATUSES.map((st) => (
            <div key={st} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: STATUS_COLORS[st] }} />
                {st}
              </p>
              <p className="text-2xl font-semibold mt-1">{byStatus[st] || 0}</p>
            </div>
          ))}
        </section>

        {/* Graph + Légende */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Répartition par statut</h2>
        <StatusPie data={pieData} colorsMap={STATUS_COLORS} />
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {Object.keys(STATUS_COLORS).map(st => (
            <div key={st} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: STATUS_COLORS[st] }} />
              <span>{st}</span>
            </div>
          ))}
        </div>
      </section>

        {/* Derniers tickets */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Derniers tickets</h2>
          <ul className="divide-y">
            {latest.map(t => (
              <li key={t.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <a href={`/ticketing/${t.id}`} className="font-medium hover:underline truncate block">
                    {t.subject}
                  </a>
                  <div className="text-xs text-gray-500">
                    {(t.reporterName || '—')} • {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded border"
                  style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}
                >
                  {t.status}
                </span>
              </li>
            ))}
            {latest.length === 0 && <p className="text-gray-500">Aucun ticket.</p>}
          </ul>
        </section>

        {/* Tous les tickets + filtre statut */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tous les tickets</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Filtrer:</label>
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={statusParam}
                onChange={e => setFilter(e.target.value)}
              >
                {/* DEFAULT = ALL sauf RESOLVED */}
                <option value="DEFAULT">Tous (sauf RESOLVED)</option>
                <option value="ALL">Tous (y compris RESOLVED)</option>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Sujet</th>
                  <th className="py-2 pr-4">Auteur</th>
                  <th className="py-2 pr-4">Statut</th>
                  <th className="py-2">Créé le</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allTickets.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <a href={`/ticketing/${t.id}`} className="hover:underline font-medium">{t.subject}</a>
                    </td>
                    <td className="py-2 pr-4">{t.reporterName}</td>
                    <td className="py-2 pr-4">
                      <span
                        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded"
                        style={{ background: '#f3f4f6' }}
                      >
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[t.status] }} />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {allTickets.length === 0 && (
                  <tr><td className="py-4 text-gray-500" colSpan={4}>Aucun ticket pour ce filtre.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </TicketingLayout>
  );
}
