import prisma from '@/lib/prisma';

/** Calcule la demande/jour par ressource (somme des plans) */
async function getDemandPerDay() {
  const plans = await prisma.machineDailyPlan.findMany({
    select: { resourceId: true, qtyPerDay: true }
  });
  const demand = new Map();
  for (const p of plans) {
    demand.set(p.resourceId, (demand.get(p.resourceId) || 0) + (p.qtyPerDay || 0));
  }
  return demand;
}

export default async function handler(req, res) {
  // --- Preview GET (facultatif, utile pour debug) ---
  if (req.method === 'GET') {
    try {
      const demand = await getDemandPerDay();
      const resources = await prisma.resource.findMany({
        select: { id: true, sku: true, name: true, stock: true, reorderPoint: true, targetStock: true, autoOrder: true }
      });
      const preview = resources.map(r => {
        const d = demand.get(r.id) || 0;
        const coverageDays = d > 0 ? r.stock / d : null;
        return { sku: r.sku, name: r.name, stock: r.stock, reorderPoint: r.reorderPoint, targetStock: r.targetStock, demandPerDay: d, coverageDays };
      });
      return res.status(200).json({ preview });
    } catch (e) {
      console.error('auto-reorder GET error:', e);
      return res.status(500).json({ error: e?.message || 'Erreur serveur' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const demand = await getDemandPerDay();
    const resources = await prisma.resource.findMany({
      select: { id: true, sku: true, name: true, stock: true, reorderPoint: true, targetStock: true, autoOrder: true }
    });

    const toOrder = [];
    for (const r of resources) {
      if (r.autoOrder === false) continue;
      const d = demand.get(r.id) || 0;
      const coverageDays = d > 0 ? r.stock / d : Infinity;
      const belowPoint = r.stock <= (r.reorderPoint || 0);
      const critical = d > 0 && coverageDays <= 1;

      if (belowPoint || critical) {
        const target = Math.max(r.targetStock || 0, r.reorderPoint || 0);
        const qty = Math.max(0, target - (r.stock || 0));
        if (qty > 0) {
          toOrder.push({ resourceId: r.id, qty });
        }
      }
    }

    if (toOrder.length === 0) {
      return res.status(200).json({ created: false, reason: 'Aucun article à commander' });
    }

    // --- Création décomposée pour éviter les soucis d'imbrication ---
    const order = await prisma.$transaction(async (tx) => {
      const code = 'PO-AUTO-' + Date.now();

      const created = await tx.purchaseOrder.create({
        data: { code, status: 'PLACED' }
      });

      // createMany ne retourne pas les lignes; on peut recharger ensuite si besoin
      await tx.purchaseOrderItem.createMany({
        data: toOrder.map(it => ({
          orderId: created.id,
          resourceId: it.resourceId,
          qty: it.qty
        }))
      });

      // recharger l'ordre avec ses items
      const withItems = await tx.purchaseOrder.findUnique({
        where: { id: created.id },
        include: { items: { include: { resource: true } } }
      });

      return withItems;
    });

    return res.status(200).json({ created: true, order });

  } catch (e) {
    // Très utile pour cerner l’invalidation exacte côté Prisma
    console.error('auto-reorder POST error:', e);
    return res.status(500).json({
      error: e?.message || 'Erreur serveur',
      code: e?.code || undefined,
      meta: e?.meta || undefined
    });
  }
}
