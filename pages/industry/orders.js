import IndustryLayout from '@/components/IndustryLayout';
import prisma from '@/lib/prisma';

export async function getServerSideProps() {
  const orders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { resource: true } } }
  });
  return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
}

export default function OrdersPage({ orders }) {
  return (
    <IndustryLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <a href="/industry/orders/new" className="px-3 py-2 rounded bg-black text-white">➕ Nouvelle commande</a>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Statut</th>
                  <th className="py-2 pr-4">Articles</th>
                  <th className="py-2">Créée le</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4"><a className="hover:underline font-medium" href={`/industry/orders/${o.id}`}>{o.code}</a></td>
                    <td className="py-2 pr-4"><span className="text-xs px-2 py-1 rounded border" style={{ background:'#f9fafb', borderColor:'#e5e7eb' }}>{o.status}</span></td>
                    <td className="py-2 pr-4">{o.items.reduce((a,b)=>a+b.qty,0)}</td>
                    <td className="py-2">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td className="py-4 text-gray-500" colSpan={4}>Aucune commande.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </IndustryLayout>
  );
}
