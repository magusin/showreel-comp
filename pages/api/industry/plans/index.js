import prisma from '@/lib/prisma';

export default async function handler(req, res){
  if (req.method === 'GET') {
    const plans = await prisma.machineDailyPlan.findMany({
      include: { machine: true, resource: true },
      orderBy: [{ machineId: 'asc' }, { resourceId: 'asc' }]
    });
    return res.json(plans);
  }
  if (req.method === 'POST') {
    const { machineId, resourceId, qtyPerDay } = req.body || {};
    if (!machineId || !resourceId || !Number.isInteger(qtyPerDay) || qtyPerDay < 0)
      return res.status(400).json({ error: 'machineId, resourceId, qtyPerDay>=0 requis' });
    const plan = await prisma.machineDailyPlan.upsert({
      where: { machineId_resourceId: { machineId, resourceId } },
      update: { qtyPerDay },
      create: { machineId, resourceId, qtyPerDay }
    });
    return res.status(201).json(plan);
  }
  return res.status(405).end();
}
