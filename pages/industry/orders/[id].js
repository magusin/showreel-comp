import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';
import { useState } from 'react';

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  const order = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: { items: { include: { resource: true } } }
  });
  if (!order) return { notFound: true };
  return { props: { order: JSON.parse(JSON.stringify(order)) } };
}

export default function OrderDetail({ order: initial }) {
  const [order, setOrder] = useState(initial);

  async function updateStatus(status){
    const res = await fetch(`/api/industry/orders/${order.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const upd = await res.json();
      setOrder(prev => ({ ...prev, status: upd.status }));
      if (status === 'RECEIVED') alert('Stocks mis à jour ✅');
    } else alert('Erreur mise à jour');
  }

  return (
    <IndustryLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{order.code}</h1>
            <div className="text-sm text-gray-500">Créée le {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded border" style={{ background:'#f9fafb', borderColor:'#e5e7eb' }}>{order.status}</span>
            {order.status === 'DRAFT' && (
              <>
                <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>updateStatus('PLACED')}>Passer commande</button>
                <button className="px-3 py-2 rounded border" onClick={()=>updateStatus('CANCELED')}>Annuler</button>
              </>
            )}
            {order.status === 'PLACED' && (
              <>
                <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={()=>updateStatus('RECEIVED')}>Réception</button>
                <button className="px-3 py-2 rounded border" onClick={()=>updateStatus('CANCELED')}>Annuler</button>
              </>
            )}
          </div>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Ressource</th>
                  <th className="py-2 pr-4">SKU</th>
                  <th className="py-2 pr-4">Quantité</th>
                  <th className="py-2">Prix unitaire</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map(it => (
                  <tr key={it.id}>
                    <td className="py-2 pr-4 font-medium">{it.resource.name}</td>
                    <td className="py-2 pr-4">{it.resource.sku}</td>
                    <td className="py-2 pr-4">{it.qty} {it.resource.unit}</td>
                    <td className="py-2">{it.unitPrice ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div><a href="/industry/orders" className="text-sm underline">← Retour aux commandes</a></div>
      </div>
    </IndustryLayout>
  );
}
