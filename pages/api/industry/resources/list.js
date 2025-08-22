import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const items = await prisma.resource.findMany({ orderBy: { name: 'asc' } });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
