import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { status, capabilities } = req.body || {};
      const data = {};
      if (status) data.status = status;
      if (Array.isArray(capabilities)) data.capabilities = capabilities;
      if (Object.keys(data).length === 0) return res.status(400).json({ error: 'aucun champ' });
      const m = await prisma.machine.update({ where: { id }, data });
      return res.json(m);
    } catch (e) { console.error(e); return res.status(500).json({ error: 'Erreur serveur' }); }
  }

  return res.status(405).end();
}
