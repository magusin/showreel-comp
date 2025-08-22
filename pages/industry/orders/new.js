import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';
import { useState } from 'react';

export async function getServerSideProps() {
  const items = await prisma.resource.findMany({ orderBy: { name: 'asc' } });
  return { props: { resources: JSON.parse(JSON.stringify(items)) } };
}

export default function NewOrderPage({ resources }) {
  const [rows, setRows] = useState([{ resourceId: resources[0]?.id || '', qty: 1, unitPrice: '' }]);
  const [saving, setSaving] = useState(false);

  function updateRow(i, patch){ setRows(prev => prev.map((r,idx)=> idx===i ? {...r, ...patch} : r)); }
  function addRow(){ setRows(prev => [...prev, { resourceId: resources[0]?.id || '', qty: 1, unitPrice: '' }]); }
  function removeRow(i){ setRows(prev => prev.filter((_,idx)=>idx!==i)); }

  async function submit(e){
    e.preventDefault();
    setSaving(true);
    const payload = { items: rows.map(r => ({ resourceId: r.resourceId, qty: Number(r.qty)||0, unitPrice: r.unitPrice ? Number(r.unitPrice) : undefined })) };
    const res = await fetch('/api/industry/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      const o = await res.json();
      window.location.href = `/industry/orders/${o.id}`;
    } else {
      alert('Erreur création commande');
    }
  }

  return (
    <IndustryLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle commande</h1>

        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Ressource</th>
                  <th className="py-2 pr-4">Quantité</th>
                  <th className="py-2 pr-4">Prix unitaire (optionnel)</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-4">
                      <select className="border rounded p-2 min-w-[220px]" value={r.resourceId} onChange={e=>updateRow(i,{resourceId:e.target.value})}>
                        {resources.map(res => <option key={res.id} value={res.id}>{res.name} — {res.sku}</option>)}
                      </select>
                    </td>
                    <td className="py-2 pr-4"><input type="number" className="border rounded p-2 w-24" value={r.qty} onChange={e=>updateRow(i,{qty:e.target.value})} /></td>
                    <td className="py-2 pr-4"><input type="number" className="border rounded p-2 w-32" step="0.01" value={r.unitPrice} onChange={e=>updateRow(i,{unitPrice:e.target.value})} /></td>
                    <td className="py-2">
                      <button type="button" className="px-2 py-1 rounded border mr-2" onClick={addRow}>➕</button>
                      {rows.length > 1 && <button type="button" className="px-2 py-1 rounded border" onClick={()=>removeRow(i)}>🗑️</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="px-4 py-2 rounded bg-black text-white" disabled={saving}>{saving ? 'Création…' : 'Créer la commande'}</button>
        </form>
      </div>
    </IndustryLayout>
  );
}
