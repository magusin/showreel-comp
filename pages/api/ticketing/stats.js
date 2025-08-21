import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const total = await prisma.ticket.count();

    // groupBy par statut
    const grouped = await prisma.ticket.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const byStatus = Object.fromEntries(grouped.map(g => [g.status, g._count.status]));

    // derniers tickets
    const latest = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, subject: true, status: true, createdAt: true }
    });

    res.json({ total, byStatus, latest });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur: ' + e });
  }
}
