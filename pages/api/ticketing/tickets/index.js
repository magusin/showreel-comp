import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { q = '', status } = req.query;

      const where = {
        AND: [
          q
            ? {
                OR: [
                  { subject: { contains: q, mode: 'insensitive' } },
                  { description: { contains: q, mode: 'insensitive' } }
                ]
              }
            : {},
          status ? { status } : {}
        ]
      };

      const tickets = await prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      res.json(tickets);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else if (req.method === 'POST') {
    try {
      const { subject, description, reporterName, honeypot } = req.body || {};
      if (honeypot) return res.status(204).end(); // anti-spam
      if (!subject || !description) return res.status(400).json({ error: 'subject et description requis' });

      const ticket = await prisma.ticket.create({
        data: {
          subject,
          description,
          reporterName,
          events: {
            create: { type: 'CREATED', message: 'Ticket créé', actor: reporterName || 'visiteur' }
          }
        }
      });

      res.status(201).json(ticket);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else {
    res.status(405).end();
  }
}
