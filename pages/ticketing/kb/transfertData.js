import React from 'react';
import Link from 'next/link';
import { FaHdd, FaExchangeAlt, FaCheckCircle, FaLaptop, FaUsb, FaNetworkWired } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const TransfertDonnees = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Transfert de données</h1>

                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Objectif :</strong> Transférer les données d'un utilisateur de son ancien poste vers le nouveau.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-sm text-amber-900">
                                <strong>Astuce :</strong> Noter le NNI de l'utilisateur ainsi que le DPS de l'ancien poste pour débloquer le disque dur.
                            </p>
                        </div>
                    </div>

                    {/* 1. Vérifications préalables */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaLaptop className="text-blue-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications préalables</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Ancien et nouveau poste fonctionnels et accessibles (session ouverte).</li>
                            <li>Espace disque suffisant sur le nouveau poste.</li>
                            <li>Support de transfert prêt (câble réseau, clé USB, disque externe ou connexion réseau).</li>
                            <li>Utilisateur présent pour confirmation des étapes et ouverture des sessions.</li>
                        </ul>
                    </section>

                    {/* 2. Préparation */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaHdd className="text-gray-700 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Préparation</h2>
                        </div>
                        <ol className="list-decimal pl-6 text-lg space-y-3">
                            <li>Repérer les emplacements importants sur l’ancien poste : <em>Documents</em>, <em>Bureau</em>, <em>Images</em>, favoris navigateur, PST Outlook, etc.</li>
                            <li>Vider la corbeille et supprimer les fichiers inutiles avant transfert pour réduire le volume.</li>
                            <li>Retirer le disque dur de l'ancien poste de l'utilisateur</li>
                            <li>Brancher le disque dur sur le nouveau poste via un adaptateur USB ou un boîtier externe.</li>
                            <li>Brancher le nouveau poste au réseau</li>
                        </ol>
                    </section>

                    {/* 3. Méthodes de transfert */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaExchangeAlt className="text-emerald-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Transfert de données</h2>
                        </div>
                        <ul className="list-decimal pl-6 text-lg space-y-2">
                            <li>

                                <span className="">Sur le pannel admin débloquer le disque dur du nouveau poste.</span>
                            </li>
                            <li>
                                Lancer Easy Transfert après un Easy Check.
                            </li>
                            <li>
                                Attendre la fin du trasnfert et suivre les instructions à l'écran pour finaliser le processus.
                            </li>
                            <li>
                                Vérifier que toutes les données importantes ont été transférées (documents, images, favoris, etc.).
                            </li>
                            <li>
                                Redémarrer le poste, lancer Outlook, <Link className='text-blue-500' href='/initStorm'>Initialiser Stormshield</Link> et vérifier que les applications fonctionnent correctement.
                            </li>
                            <li>
                                Vérifier BAL Outlook et mail présents. Lancer EDF Store vérifier que tout est à jour.
                            </li>
                            <li>
                                Vérifier que les applications métiers sont accessibles et fonctionnelles avec l'utilisateur et les dossiers et fichiers de l'utilisateur sont présent.
                            </li>
                        </ul>
                    </section>

                    {/* 4. Vérifications finales */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-green-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications finales</h2>
                        </div>
                        <ul className="list-disc pl-6 text-lg space-y-2">
                            <li>Ouvrir plusieurs fichiers transférés pour vérifier leur intégrité.</li>
                            <li>Vérifier les droits d’accès (lecture/écriture) sur les dossiers copiés.</li>
                            <li>Supprimer les fichiers temporaires ou dossier de transfert si inutiles.</li>
                            <li>Confirmer avec l’utilisateur que tout est présent et fonctionnel.</li>
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

export default TransfertDonnees;