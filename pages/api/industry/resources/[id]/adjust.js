import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { delta, reason } = req.body || {};
    const nDelta = Number(delta);
    if (!Number.isInteger(nDelta) || nDelta === 0) return res.status(400).json({ error: 'delta entier non nul requis' });

    const updated = await prisma.$transaction(async (tx) => {
      const r = await tx.resource.update({
        where: { id },
        data: { stock: { increment: nDelta } }
      });
      await tx.resourceAdjustment.create({
        data: { resourceId: id, delta: nDelta, reason: reason || null }
      });
      return r;
    });

    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
}
