import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';
import { useState } from 'react';

export async function getServerSideProps(){
  const [machines, resources, plans] = await Promise.all([
    prisma.machine.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.resource.findMany({ orderBy: { name: 'asc' } }),
    prisma.machineDailyPlan.findMany({ include: { machine: true, resource: true } })
  ]);
  return { props: {
    machines: JSON.parse(JSON.stringify(machines)),
    resources: JSON.parse(JSON.stringify(resources)),
    initialPlans: JSON.parse(JSON.stringify(plans))
  }};
}

const CAPS = ['USINAGE','SOUDAGE','PLIAGE','PEINTURE','ASSEMBLAGE'];

export default function PlanningPage({ machines, resources, initialPlans }){
  const [list, setList] = useState(initialPlans);
  const [selMachine, setSelMachine] = useState(machines[0]?.id || '');
  const [selResource, setSelResource] = useState(resources[0]?.id || '');
  const [qty, setQty] = useState(0);

  async function savePlan(e){
    e.preventDefault();
    const res = await fetch('/api/industry/plans', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ machineId: selMachine, resourceId: selResource, qtyPerDay: Number(qty)||0 })
    });
    if (res.ok) {
      const p = await res.json();
      // enrich display
      const m = machines.find(x=>x.id===p.machineId);
      const r = resources.find(x=>x.id===p.resourceId);
      const row = { ...p, machine: m, resource: r };
      setList(prev => {
        const idx = prev.findIndex(x => x.machineId===p.machineId && x.resourceId===p.resourceId);
        if (idx>=0) { const clone=[...prev]; clone[idx]=row; return clone; }
        return [row, ...prev];
      });
      setQty(0);
    } else {
      alert('Erreur enregistrement plan');
    }
  }

  async function toggleCap(machineId, cap){
    const m = machines.find(x=>x.id===machineId);
    const next = new Set(m.capabilities||[]);
    if (next.has(cap)) next.delete(cap); else next.add(cap);
    const res = await fetch(`/api/industry/machines/${machineId}`, {
      method: 'PATCH', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ capabilities: Array.from(next) })
    });
    if (res.ok) {
      m.capabilities = Array.from(next);
    } else alert('Erreur MAJ capacités');
  }

  return (
    <IndustryLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Planning production & fonctions machines</h1>

        {/* Capacités machines */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Fonctions par machine</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {machines.map(m => (
              <div key={m.id} className="border rounded-lg p-4">
                <div className="font-semibold mb-2">{m.name} <span className="text-xs text-gray-500">({m.code})</span></div>
                <div className="flex flex-wrap gap-2">
                  {CAPS.map(c => (
                    <button key={c}
                      onClick={()=>toggleCap(m.id, c)}
                      className={`px-2 py-1 rounded border text-xs ${m.capabilities?.includes(c)?'bg-black text-white':'bg-white'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Définition du plan conso */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Plan consommation journalière</h2>
          <form onSubmit={savePlan} className="flex items-end gap-3 mb-4">
            <div>
              <label className="text-sm">Machine</label>
              <select className="border rounded p-2 ml-2" value={selMachine} onChange={e=>setSelMachine(e.target.value)}>
                {machines.map(m => <option key={m.id} value={m.id}>{m.name} — {m.code}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Ressource</label>
              <select className="border rounded p-2 ml-2" value={selResource} onChange={e=>setSelResource(e.target.value)}>
                {resources.map(r => <option key={r.id} value={r.id}>{r.name} — {r.sku}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm">Qté / jour</label>
              <input type="number" className="border rounded p-2 ml-2 w-28" value={qty} onChange={e=>setQty(e.target.value)} />
            </div>
            <button className="px-4 py-2 rounded bg-black text-white">Enregistrer</button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Machine</th>
                  <th className="py-2 pr-4">Ressource</th>
                  <th className="py-2 pr-4">Qté/jour</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map(p => (
                  <tr key={p.id}>
                    <td className="py-2 pr-4">{p.machine?.name} <span className="text-xs text-gray-500">({p.machine?.code})</span></td>
                    <td className="py-2 pr-4">{p.resource?.name} <span className="text-xs text-gray-500">({p.resource?.sku})</span></td>
                    <td className="py-2 pr-4">{p.qtyPerDay} {p.resource?.unit}</td>
                  </tr>
                ))}
                {list.length === 0 && <tr><td className="py-4 text-gray-500" colSpan={3}>Aucun plan.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </IndustryLayout>
  );
}
