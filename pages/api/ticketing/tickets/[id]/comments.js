import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { body, authorName, honeypot } = req.body || {};
    if (honeypot) return res.status(204).end();
    if (!body || !authorName) return res.status(400).json({ error: 'body et authorName sont requis' });
  
    const comment = await prisma.comment.create({
      data: { body, authorName, ticketId: id }
    });
  
    await prisma.ticketEvent.create({
      data: { type: 'COMMENT_ADDED', message: 'Nouveau commentaire', actor: authorName, ticketId: id }
    });
  
    res.status(201).json(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
