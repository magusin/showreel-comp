import React from 'react';
import Link from 'next/link';
import { FaPrint, FaTools, FaCheckCircle, FaNetworkWired, FaPlug, FaExclamationTriangle } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const ImprimanteNeRepondPas = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Dépannage — Imprimante ne répond pas</h1>

                    {/* Bandeau Objectif / Astuce */}
                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Objectif :</strong> rétablir la capacité d'impression ou qualifier l'escalade (N2/SAV) avec détails : modèle, type de connexion, message d'erreur, tests effectués.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-sm text-amber-900">
                                <strong>Astuce :</strong> un redémarrage complet (PC + imprimante) résout plus de 50% des problèmes d'impression.
                            </p>
                        </div>
                    </div>

                    {/* 1. Vérifications préalables */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaPrint className="text-blue-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications préalables</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>L’imprimante est allumée et sans message d’erreur sur l’écran.</li>
                            <li>Le câble USB ou réseau est bien branché (ou le Wi-Fi actif si sans fil).</li>
                            <li>Vérifier que l’imprimante est bien sélectionnée par défaut dans Windows.</li>
                        </ul>
                    </section>

                    {/* 2. Étapes de dépannage */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaTools className="text-emerald-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étapes de dépannage</h2>
                        </div>
                        <ol className="list-decimal pl-6 text-lg space-y-3">
                            <li><span className="font-medium">Redémarrage</span> — Éteindre puis rallumer l’imprimante.</li>
                            <li><span className="font-medium">Test connexion</span> —
                                <ul className="list-disc pl-6 mt-2">
                                    <li>USB : tester sur un autre port ou câble.</li>
                                    <li>Réseau : imprimer la page de configuration et vérifier l’adresse IP.</li>
                                </ul>
                            </li>
                            <li><span className="font-medium">Vider la file d’impression</span> — Dans Windows, clic droit sur l’imprimante → “Voir les travaux d’impression” → Annuler tous les travaux.</li>
                            <li><span className="font-medium">Réinstaller le pilote</span> — via Windows Update, site constructeur ou outil interne.</li>
                            <li><span className="font-medium">Test direct</span> — imprimer une page de test depuis le panneau de configuration.</li>
                        </ol>
                    </section>

                    {/* 3. Vérifications réseau */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaNetworkWired className="text-gray-700 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications réseau (si imprimante partagée)</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Ping l’adresse IP de l’imprimante.</li>
                            <li>Accéder à l’interface web (si dispo) via navigateur.</li>
                            <li>Vérifier que l’imprimante est toujours partagée sur le serveur d’impression.</li>
                        </ul>
                    </section>

                    {/* 4. Escalade */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-amber-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Escalade</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Escalader au N2 ou SAV si :
                        </p>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>L’imprimante ne s’allume plus du tout (problème matériel).</li>
                            <li>Message d’erreur matériel ou code panne sur l’écran.</li>
                            <li>Problème réseau persistant malgré les tests (VLAN, pare-feu, serveur d’impression).</li>
                        </ul>
                    </section>

                    {/* 5. Vérifications finales */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-green-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications finales</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Impression d’une page de test OK.</li>
                            <li>Travaux envoyés depuis plusieurs applications fonctionnent.</li>
                            <li>L’utilisateur confirme que l’imprimante est opérationnelle.</li>
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

export default ImprimanteNeRepondPas;