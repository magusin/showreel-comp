import prisma from '@/lib/prisma';

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const plans = await prisma.machineDailyPlan.findMany({ include: { resource: true, machine: true } });
    if (plans.length === 0) return res.json({ consumed: [], warnings: ['Aucun plan'] });

    const result = await prisma.$transaction(async (tx) => {
      const consumed = [];
      const warnings = [];
      for (const p of plans) {
        if (p.qtyPerDay <= 0) continue;
        // si stock insuffisant, on consomme ce qu'on peut et on alerte
        const reso = await tx.resource.findUnique({ where: { id: p.resourceId } });
        const consume = Math.min(reso.stock, p.qtyPerDay);
        if (consume > 0) {
          await tx.resource.update({ where: { id: p.resourceId }, data: { stock: { decrement: consume } } });
          await tx.resourceAdjustment.create({
            data: {
              resourceId: p.resourceId,
              delta: -consume,
              reason: `Conso journalière ${p.machine.name} (${p.machine.code})`
            }
          });
          consumed.push({ resourceId: p.resourceId, qty: consume, machine: p.machine.code });
        }
        if (consume < p.qtyPerDay) {
          warnings.push(`Stock insuffisant pour ${p.resource.name}: demandé ${p.qtyPerDay}, consommé ${consume}`);
        }
      }
      return { consumed, warnings };
    });

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
