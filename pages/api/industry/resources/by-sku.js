import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { sku } = req.query;
  if (!sku) return res.status(400).json({ error: 'sku requis' });
  try {
    const r = await prisma.resource.findUnique({ where: { sku: String(sku) } });
    if (!r) return res.status(404).json({ error: 'introuvable' });
    res.json(r);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
