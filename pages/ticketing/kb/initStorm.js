import React from 'react';
import Link from 'next/link';
import { FaTools, FaCheckCircle, FaEnvelope, FaWrench, FaClipboardCheck } from 'react-icons/fa';
import TicketingLayout from '@/components/TicketingLayout';

const InitStorm = () => {
  return (
    <TicketingLayout>
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Initialiser StormShield</h1>

          <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaTools className="text-blue-500 text-3xl mr-4" />
              <h2 className="text-2xl font-semibold">Vérification </h2>
            </div>
            <p className="text-lg mb-4">
              Il vous faut vérifier que l'utilisateur a les identifiants pour initialiser StormShield. Ouvrez Outlook et recherchez "Storm", deux mails devraient être présent, un avec les identifiants et l'autre avec la procédure, si ce n'est pas le cas vous ne pourrez pas initialiser StormShield.
            </p>
          </section>

          <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">

            <ul className='list-decimal m-2'>
              <li className="text-lg mb-4">
                Téléchargez le fichier .usi sur le bureau présent dans un des deux mails.
              </li>
              <li className="text-lg mb-4">
                Désactivez Guardian SSOX.
              </li>
              <li className="text-lg mb-4">
                Exécutez le fichier téléchargé sur le bureau.
              </li>
              <li className="text-lg mb-4">
                Lancer Stormshield et suivez les instructions.
              </li>
              <li className="text-lg mb-4">
                Laissez l'utilisateur définir son mot de passe pour Stormshield.
              </li>
              <li className="text-lg mb-4">
                Réactivez Guardian SSOX.
              </li>
            </ul>
          </section>
        </div>
        <div className="text-center mt-6">
          <Link href="/ticketing/kb" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Retour
          </Link>
        </div>
      </div>
    </TicketingLayout>
  );
};

export default InitStorm;
