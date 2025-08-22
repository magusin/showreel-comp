import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';
import { useState } from 'react';

export async function getServerSideProps() {
  const items = await prisma.resource.findMany({ orderBy: { name: 'asc' } });
  return { props: { items: JSON.parse(JSON.stringify(items)) } };
}

export default function ResourcesPage({ items }) {
  const [list, setList] = useState(items);
  const [form, setForm] = useState({ sku:'', name:'', unit:'pcs', stock:0, reorderPoint:0, targetStock:0 });

  async function createResource(e){
    e.preventDefault();
    const res = await fetch('/api/industry/resources', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const r = await res.json();
      setList(prev => [r, ...prev]);
      setForm({ sku:'', name:'', unit:'pcs', stock:0, reorderPoint:0, targetStock:0 });
    } else alert('Erreur création');
  }

  async function adjust(id, delta, reason){
    const res = await fetch(`/api/industry/resources/${id}/adjust`, {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ delta, reason })
    });
    if (res.ok) {
      const r = await res.json();
      setList(prev => prev.map(x => x.id === r.id ? r : x));
    } else alert('Erreur ajustement');
  }

  return (
    <IndustryLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Ressources & matières</h1>

        {/* Création */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Nouvelle ressource</h2>
          <form onSubmit={createResource} className="grid md:grid-cols-6 gap-3">
            <input className="border rounded p-2 md:col-span-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} required />
            <input className="border rounded p-2 md:col-span-3" placeholder="Nom" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="border rounded p-2" placeholder="Unité" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} />
            <input className="border rounded p-2" type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} />
            <input className="border rounded p-2" type="number" placeholder="Seuil" value={form.reorderPoint} onChange={e=>setForm({...form, reorderPoint:Number(e.target.value)})} />
            <input className="border rounded p-2" type="number" placeholder="Cible" value={form.targetStock} onChange={e=>setForm({...form, targetStock:Number(e.target.value)})} />
            <div className="md:col-span-6">
              <button className="px-4 py-2 rounded bg-black text-white">Créer</button>
            </div>
          </form>
        </section>

        {/* Liste */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Inventaire</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">SKU</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Seuil</th>
                  <th className="py-2 pr-4">Cible</th>
                  <th className="py-2">Ajuster</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{r.name}</td>
                    <td className="py-2 pr-4">{r.sku}</td>
                    <td className="py-2 pr-4">{r.stock} {r.unit}</td>
                    <td className="py-2 pr-4">{r.reorderPoint}</td>
                    <td className="py-2 pr-4">{r.targetStock}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded border" onClick={()=>adjust(r.id, +1, 'ajout manuel')}>+1</button>
                        <button className="px-2 py-1 rounded border" onClick={()=>adjust(r.id, -1, 'retrait manuel')}>-1</button>
                        <a className="px-2 py-1 rounded border" href="/industry/orders/new">Commander…</a>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && <tr><td className="py-4 text-gray-500" colSpan={6}>Aucune ressource.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </IndustryLayout>
  );
}
