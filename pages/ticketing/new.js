import { useState } from 'react';
import TicketingLayout from '@/components/TicketingLayout';

export default function NewTicketPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/ticketing/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description, reporterName, honeypot: '' })
    });
    setSaving(false);
    if (res.ok) {
      const t = await res.json();
      window.location.href = `/ticketing/${t.id}`;
    } else {
      alert('Erreur création ticket');
    }
  }

  return (
    <TicketingLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Nouveau ticket</h1>

        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Sujet</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Ex: Connexion réseau intermittente"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Décrivez le problème, les étapes déjà essayées, etc."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Votre nom</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Ex: Hugo"
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Création…' : 'Créer le ticket'}
            </button>
          </div>
        </form>
      </div>
    </TicketingLayout>
  );
}
