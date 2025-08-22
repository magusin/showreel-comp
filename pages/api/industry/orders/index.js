import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const orders = await prisma.purchaseOrder.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { resource: true } } }
      });
      res.json(orders);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else if (req.method === 'POST') {
    try {
      const { items } = req.body || {};
      if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items requis' });

      const code = 'PO-' + Date.now();
      const order = await prisma.purchaseOrder.create({
        data: {
          code,
          status: 'DRAFT',
          items: {
            create: items.map(it => ({
              resourceId: it.resourceId,
              qty: Number(it.qty) || 0,
              unitPrice: it.unitPrice ? it.unitPrice : null
            }))
          }
        },
        include: { items: { include: { resource: true } } }
      });

      res.status(201).json(order);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else {
    res.status(405).end();
  }
}
