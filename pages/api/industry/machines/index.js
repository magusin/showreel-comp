import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const machines = await prisma.machine.findMany({ orderBy: { createdAt: 'asc' } });
      res.json(machines);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else if (req.method === 'POST') {
    try {
      const { name, code, status } = req.body || {};
      if (!name || !code) return res.status(400).json({ error: 'name et code requis' });
      const m = await prisma.machine.create({ data: { name, code, status: status || 'RUNNING' }});
      res.status(201).json(m);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else {
    res.status(405).end();
  }
}
