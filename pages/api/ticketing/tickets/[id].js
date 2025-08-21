import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          comments: { orderBy: { createdAt: 'asc' } },
          events: { orderBy: { createdAt: 'asc' } }
        }
      });

      if (!ticket) return res.status(404).json({ error: 'Ticket introuvable' });
      res.json(ticket);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else if (req.method === 'PATCH') {
    try {
      const { subject, description, status, actor } = req.body || {};
      const data = {};
      const ev = [];

      if (subject) { data.subject = subject; ev.push({ type: 'SUBJECT_UPDATED', message: 'Sujet mis à jour', actor: actor || 'visiteur' }); }
      if (description) { data.description = description; ev.push({ type: 'DESCRIPTION_UPDATED', message: 'Description mise à jour', actor: actor || 'visiteur' }); }
      if (status) { data.status = status; ev.push({ type: 'STATUS_CHANGED', message: `Statut → ${status}`, actor: actor || 'visiteur' }); }

      const ticket = await prisma.ticket.update({
        where: { id },
        data: { ...data, events: ev.length ? { create: ev } : undefined }
      });

      res.json(ticket);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await prisma.comment.deleteMany({ where: { ticketId: id } });
      await prisma.ticketEvent.deleteMany({ where: { ticketId: id } });
      await prisma.ticket.delete({ where: { id } });
      res.json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else {
    res.status(405).end();
  }
}
