import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'PATCH') {
    try {
      const { status } = req.body || {};
      if (!status) return res.status(400).json({ error: 'status requis' });
      const m = await prisma.machine.update({ where: { id }, data: { status } });
      res.json(m);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
  } else {
    res.status(405).end();
  }
}
