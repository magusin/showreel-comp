import React, { useState } from 'react';
import TicketingLayout from "@/components/TicketingLayout";
import Link from 'next/link';

const solutions = [
  { name: 'LENOVO réparation - Marche à suivre', url: '/ticketing/kb/lenovorep' },
  { name: 'Blanchiment HP ZBook Fury', url: '/ticketing/kb/blankoZBook' },
  { name: 'Blanchiment Panasonic ToughPad FZ-G1', url: '/ticketing/kb/blankoToughPad' },
  { name: 'Initialisation Stormshield', url: '/ticketing/kb/initStorm' },
  { name: 'Ajouter BAL Outlook', url: '/ticketing/kb/outlookBAL' },
  { name: 'Problème réseau, wifi, sur poste de travail', url: '/ticketing/kb/problWifi' },
  { name: 'Changer langue clavier (AZERTY, QWERTY)', url: '/ticketing/kb/clavier' },
  { name: 'Poste de travail qui ne démarre plus', url: '/ticketing/kb/pcStart' },
  { name: 'Transfert de données', url: '/ticketing/kb/transfertData' },
  { name: 'Imprimante ne répond pas', url: '/ticketing/kb/impriWork' },
  { name: 'Mise à jour Windows bloquée', url: '/ticketing/kb/majWindowsLocked' }

];

export default function Solutions() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSolutions = solutions.filter((solution) =>
    solution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TicketingLayout>
    <div className="min-h-screen text-gray-800 px-4"> {/* Added px-4 for side padding */}
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">📚 Base de connaissances</h1>
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Rechercher une solution..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution) => (
              <Link
                key={solution.name}
                href={solution.url}
                className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg text-lg text-center transition-transform transform hover:-translate-y-1"
              >
                {solution.name}
              </Link>
            ))
          ) : (
            <p className="text-center col-span-2">Aucune solution trouvée</p>
          )}
        </div>
      </div>
    </div>
    </TicketingLayout>
  );
}
