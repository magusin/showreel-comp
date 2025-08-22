import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const [totalMachines, running, stopped, maintenance, totalSkus, lowStock, openOrders] = await Promise.all([
      prisma.machine.count(),
      prisma.machine.count({ where: { status: 'RUNNING' } }),
      prisma.machine.count({ where: { status: 'STOPPED' } }),
      prisma.machine.count({ where: { status: 'MAINTENANCE' } }),
      prisma.resource.count(),
      prisma.resource.count({ where: { stock: { lte: prisma.resource.fields.reorderPoint } } }).catch(async () => {
        // fallback sans prisma.fields si version ne supporte pas
        const all = await prisma.resource.findMany({ select: { id: true, stock: true, reorderPoint: true } });
        return all.filter(r => r.stock <= r.reorderPoint).length;
      }),
      prisma.purchaseOrder.count({ where: { status: { in: ['DRAFT', 'PLACED'] } } }),
    ]);

    res.json({ totalMachines, running, stopped, maintenance, totalSkus, lowStock, openOrders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
