import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';
import { useEffect, useState } from 'react';

export async function getServerSideProps() {
    const [machines, resources, orders] = await Promise.all([
        prisma.machine.findMany({ orderBy: { createdAt: 'asc' } }),
        prisma.resource.findMany({ orderBy: { name: 'asc' } }),
        prisma.purchaseOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const running = machines.filter(m => m.status === 'RUNNING').length;
    const stopped = machines.filter(m => m.status === 'STOPPED').length;
    const maintenance = machines.filter(m => m.status === 'MAINTENANCE').length;
    const lowStock = resources.filter(r => r.stock <= r.reorderPoint).length;

    return {
        props: {
            machines: JSON.parse(JSON.stringify(machines)),
            kpis: { totalMachines: machines.length, running, stopped, maintenance, totalSkus: resources.length, lowStock, openOrders: orders.filter(o => o.status !== 'RECEIVED' && o.status !== 'CANCELED').length },
            recentOrders: JSON.parse(JSON.stringify(orders)),
            lowItems: JSON.parse(JSON.stringify(resources.filter(r => r.stock <= r.reorderPoint).slice(0, 5)))
        }
    };
}

export default function IndustryDashboard({ machines, kpis, recentOrders, lowItems }) {
    const [list, setList] = useState(machines);

    async function changeStatus(id, status) {
        const res = await fetch(`/api/industry/machines/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            const m = await res.json();
            setList(prev => prev.map(x => x.id === m.id ? m : x));
        } else { alert('Erreur mise à jour'); }
    }

    return (
        <IndustryLayout>
            <div className="space-y-8">
                <header className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
                        <p className="text-sm text-gray-500">État des machines, ressources et commandes récentes.</p>
                    </div>
                </header>

                <div className="flex gap-2">
                    <a className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90" href="/industry/orders/new">➕ Nouvelle commande</a>
                    <a className="px-3 py-2 rounded-lg border" href="/industry/planning">🗂️ Planning</a>
                    <button
                        className="px-3 py-2 rounded-lg border"
                        onClick={async () => {
                            const r = await fetch('/api/industry/run/daily-consumption', { method: 'POST' });
                            if (r.ok) alert('Consommation journalière exécutée ✅'); else alert('Erreur conso');
                        }}>
                        ▶️ Conso jour
                    </button>
                    <button
                        className="px-3 py-2 rounded-lg border"
                        onClick={async () => {
                            try {
                                const r = await fetch('/api/industry/auto-reorder', { method: 'POST' });
                                const raw = await r.text(); // lire UNE fois
                                let payload;
                                try { payload = raw ? JSON.parse(raw) : null; } catch { payload = null; }

                                if (!r.ok) {
                                    const msg = payload?.error || raw || `HTTP ${r.status}`;
                                    alert('Erreur: ' + msg);
                                    return;
                                }
                                if (!payload || typeof payload !== 'object') {
                                    alert('Réponse non JSON:\n' + raw.slice(0, 300));
                                    return;
                                }
                                if (payload.created) {
                                    alert('Commande auto créée: ' + payload.order.code);
                                } else {
                                    alert(payload.reason || 'Aucune commande');
                                }
                            } catch (err) {
                                alert('Erreur réseau: ' + (err?.message || String(err)));
                            }
                        }}
                    >
                        🤖 Auto-réappro
                    </button>

                </div>

                {/* KPIs */}
                <section className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <KPI label="Machines" value={kpis.totalMachines} />
                    <KPI label="En marche" value={kpis.running} />
                    <KPI label="Arrêtées" value={kpis.stopped} />
                    <KPI label="Maintenance" value={kpis.maintenance} />
                    <KPI label="Ressources" value={kpis.totalSkus} />
                    <KPI label="⚠️ Bas stock" value={kpis.lowStock} />
                </section>

                {/* Machines */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Machines</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {list.map(m => (
                            <div key={m.id} className="border rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{m.name}</div>
                                    <div className="text-xs text-gray-500">Code: {m.code}</div>
                                    <div className="mt-1 text-xs inline-flex items-center gap-2 px-2 py-1 rounded border"
                                        style={{ background: '#f3f4f6', borderColor: '#e5e7eb' }}>
                                        Statut: <strong>{m.status}</strong>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => changeStatus(m.id, 'RUNNING')} className="px-2 py-1 rounded bg-green-600 text-white">RUN</button>
                                    <button onClick={() => changeStatus(m.id, 'STOPPED')} className="px-2 py-1 rounded bg-red-600 text-white">STOP</button>
                                    <button onClick={() => changeStatus(m.id, 'MAINTENANCE')} className="px-2 py-1 rounded bg-yellow-500 text-white">MAINT</button>
                                </div>
                            </div>
                        ))}
                        {list.length === 0 && <p className="text-sm text-gray-500">Aucune machine.</p>}
                    </div>
                </section>

                {/* Ressources faibles */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Ressources sous le seuil</h2>
                    <ul className="divide-y">
                        {lowItems.map(r => (
                            <li key={r.id} className="py-2 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{r.name}</div>
                                    <div className="text-xs text-gray-500">SKU {r.sku} • Stock {r.stock} • Seuil {r.reorderPoint}</div>
                                </div>
                                <a className="text-sm underline" href="/industry/orders/new">Commander</a>
                            </li>
                        ))}
                        {lowItems.length === 0 && <p className="text-sm text-gray-500">Aucun article sous le seuil.</p>}
                    </ul>
                </section>

                {/* Dernières commandes */}
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Dernières commandes</h2>
                    <ul className="divide-y">
                        {recentOrders.map(o => (
                            <li key={o.id} className="py-2 flex items-center justify-between">
                                <a className="font-medium hover:underline" href={`/industry/orders/${o.id}`}>{o.code}</a>
                                <span className="text-xs px-2 py-1 rounded border" style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}>{o.status}</span>
                            </li>
                        ))}
                        {recentOrders.length === 0 && <p className="text-sm text-gray-500">Aucune commande.</p>}
                    </ul>
                </section>
            </div>
        </IndustryLayout>
    );
}

function KPI({ label, value }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}
