import React from 'react';
import Link from 'next/link';
import { FaWindows, FaTools, FaCheckCircle, FaExclamationTriangle, FaSyncAlt, FaClock } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const MajWindowsBloquee = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Dépannage — Mise à jour Windows bloquée</h1>

                    {/* Bandeau Objectif / Astuce */}
                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Objectif :</strong> débloquer l'installation ou le téléchargement d'une mise à jour Windows afin de finaliser la configuration du poste.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-sm text-amber-900">
                                <strong>Astuce :</strong> dans plus de 60% des cas, un simple redémarrage suivi d’un nettoyage du cache Windows Update résout le problème.
                            </p>
                        </div>
                    </div>

                    {/* 1. Symptômes */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaClock className="text-blue-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Symptômes courants</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Windows Update reste bloqué à un certain pourcentage pendant des heures.</li>
                            <li>Message “Téléchargement en attente” ou “Préparation de l’installation” qui ne progresse pas.</li>
                            <li>Code d’erreur Windows Update affiché (0x80070002, 0x800f081f, etc.).</li>
                        </ul>
                    </section>

                    {/* 2. Étapes de dépannage */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaTools className="text-emerald-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étapes de dépannage</h2>
                        </div>
                        <ol className="list-decimal pl-6 text-lg space-y-3">
                            <li><span className="font-medium">Redémarrer le PC</span> et relancer Windows Update.</li>
                            <li><span className="font-medium">Nettoyer le cache Windows Update</span> :
                                <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
                                    {`net stop wuauserv
net stop bits
ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old
net start wuauserv
net start bits`}
                                </pre>
                            </li>
                            <li><span className="font-medium">Lancer l'outil de résolution des problèmes Windows Update</span> (Paramètres → Système → Dépannage).</li>
                            <li><span className="font-medium">Vérifier l'espace disque</span> — minimum 10 Go libres recommandés.</li>
                        </ol>
                    </section>

                    {/* 3. Escalade */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-amber-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Escalade</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Le problème persiste après nettoyage du cache et redémarrage.</li>
                            <li>Code d’erreur inconnu ou critique empêchant le boot.</li>
                            <li>Poste bloqué sur écran “Configuration des mises à jour” pendant plus de 2h.</li>
                        </ul>
                    </section>

                    {/* 4. Vérifications finales */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-green-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications finales</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Mise à jour installée avec succès (vérifier dans Historique des mises à jour).</li>
                            <li>Aucun nouveau message d’erreur Windows Update.</li>
                            <li>Poste redémarré et fonctionnel.</li>
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

export default MajWindowsBloquee;
