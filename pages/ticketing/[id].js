import TicketingLayout from '@/components/TicketingLayout';
import { useEffect, useRef, useState } from 'react';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'];

export async function getServerSideProps(ctx) {
  const prisma = (await import('@/lib/prisma')).default;
  const { id } = ctx.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      comments: { orderBy: { createdAt: 'asc' } },
      events: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!ticket) return { notFound: true };
  return { props: { ticket: JSON.parse(JSON.stringify(ticket)) } };
}

function AutoResizeTextarea({ value, onChange, onKeyDown, placeholder }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = Math.min(el.scrollHeight, 260) + 'px'; // limite max
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
    />
  );
}

export default function TicketDetailPage({ ticket: initialTicket }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [newStatus, setNewStatus] = useState(initialTicket.status);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  async function refresh() {
    const res = await fetch(`/api/ticketing/tickets/${ticket.id}`);
    const fresh = await res.json();
    setTicket(fresh);
    setNewStatus(fresh.status);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }

  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, []);

  async function updateStatus() {
    const res = await fetch(`/api/ticketing/tickets/${ticket.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, actor: authorName || 'visiteur' })
    });
    if (res.ok) await refresh();
    else alert('Erreur maj statut');
  }

  async function sendComment() {
    if (!comment.trim() || !authorName.trim()) return;
    setSending(true);
    const res = await fetch(`/api/ticketing/tickets/${ticket.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: comment,
        authorName: authorName || undefined,
        honeypot: ''
      })
    });
    setSending(false);
    if (res.ok) {
      setComment('');
      await refresh();
    } else {
      alert('Erreur ajout commentaire');
    }
  }

  function onEditorKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendComment();
    }
  }

  return (
    <TicketingLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
              <p className="text-gray-600 mt-2 whitespace-pre-wrap">{ticket.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                {(ticket.reporterName || 'Visiteur')} — {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="w-72 space-y-2">
              <div className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200 text-right">
                {ticket.status}
              </div>
              <div className="flex gap-2">
                <select
                  className="border border-gray-300 rounded-lg p-2 flex-1"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={updateStatus}
                  className="px-3 rounded-lg bg-black text-white hover:opacity-90"
                >
                  Mettre à jour
                </button>
              </div>
              <input
                className="border border-gray-300 rounded-lg p-2 w-full"
                placeholder="Votre nom (obligatoire)"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Chat */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Commentaires</h2>

          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {ticket.comments?.map((c) => (
              <div key={c.id} className="flex">
                <div className="max-w-[80%] bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {(c.authorName || 'Visiteur')} • {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{c.body}</div>
                </div>
              </div>
            ))}
            {ticket.comments?.length === 0 && (
              <p className="text-gray-500 text-sm">Pas encore de commentaires.</p>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <AutoResizeTextarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={onEditorKeyDown}
                  placeholder="Écrire un message… (Shift+Entrée pour une nouvelle ligne)"
                />
              </div>
              <button
                onClick={sendComment}
                disabled={sending || !authorName.trim() || !comment.trim()}
                className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Historique</h2>
          <ul className="space-y-3">
            {ticket.events?.map(ev => (
              <li key={ev.id} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-400" />
                <div>
                  <div className="text-sm">{ev.message}</div>
                  <div className="text-xs text-gray-500">
                    {(ev.actor || 'Système')} — {new Date(ev.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
            {ticket.events?.length === 0 && (
              <p className="text-gray-500 text-sm">Aucune activité.</p>
            )}
          </ul>
        </section>

        <div>
          <a href="/ticketing" className="text-sm underline">← Retour au tableau de bord</a>
        </div>
      </div>
    </TicketingLayout>
  );
}
