import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.resource.findMany({ orderBy: { name: 'asc' } });
      res.json(items);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else if (req.method === 'POST') {
    try {
      const { sku, name, unit, stock=0, reorderPoint=0, targetStock=0 } = req.body || {};
      if (!sku || !name) return res.status(400).json({ error: 'sku et name requis' });
      const r = await prisma.resource.create({ data: { sku, name, unit: unit || 'pcs', stock, reorderPoint, targetStock } });
      res.status(201).json(r);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else {
    res.status(405).end();
  }
}
