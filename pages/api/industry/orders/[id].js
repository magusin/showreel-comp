import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const o = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: { include: { resource: true } } }
      });
      if (!o) return res.status(404).json({ error: 'Commande introuvable' });
      res.json(o);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  }

  else if (req.method === 'PATCH') {
    try {
      const { status } = req.body || {};
      if (!status) return res.status(400).json({ error: 'status requis' });

      const result = await prisma.$transaction(async (tx) => {
        const current = await tx.purchaseOrder.findUnique({
          where: { id },
          include: { items: true }
        });
        if (!current) throw new Error('not_found');

        // Si on passe à RECEIVED, on incrémente les stocks
        if (status === 'RECEIVED' && current.status !== 'RECEIVED') {
          for (const it of current.items) {
            await tx.resource.update({
              where: { id: it.resourceId },
              data: { stock: { increment: it.qty } }
            });
            await tx.resourceAdjustment.create({
              data: { resourceId: it.resourceId, delta: it.qty, reason: `Réception commande ${current.code}` }
            });
          }
        }

        const updated = await tx.purchaseOrder.update({
          where: { id },
          data: { status }
        });

        return updated;
      });

      res.json(result);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  }

  else {
    res.status(405).end();
  }
}
