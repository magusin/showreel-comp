import React from 'react';
import Link from 'next/link';
import { FaTools, FaExclamationTriangle, FaCheckCircle, FaEnvelope, FaWrench, FaClipboardCheck } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const InitStorm = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Poste de travail qui ne démarre plus</h1>

                    {/* Bandeau contexte */}
                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Objectif :</strong> remettre le poste en état de marche ou qualifier précisément l'escalade (N2/SAV) avec les codes erreurs, étapes réalisées et n° de série.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-sm text-amber-900">
                                <strong>Astuce :</strong> de nombreux laptops nécessitent un <em>appui long</em> (10 s) pour forcer l'arrêt, puis un appui court (1–2 s) pour le démarrage.
                            </p>
                        </div>
                    </div>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaTools className="text-blue-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Vérifications préalables</h2>
                        </div>

                        <ul className='list-decimal m-2'>
                            <li className="text-lg mb-4">
                                Vérifier que l'alimentation est bien branchée et de la bonne intensité pour le modèle du poste de travail.
                            </li>
                            <li className="text-lg mb-4">
                                Essayer une autre prise et un autre câble d'alimentation si possible.
                            </li>
                            <li className="text-lg mb-4">
                                Débrancher tous les périphériques externes (clavier, souris, imprimante, etc.) et tenter de redémarrer le poste.
                            </li>
                            <li className="text-lg mb-4">
                                Débrancher le chargeur et retirer la batterie si possible et faire un PIN Reset pour libérer la charge électrique de l'appareil.
                            </li>
                            <li className="text-lg mb-4">
                                Rebrancher le chargeur et remettre la batterie si elle a été retirée, puis tenter de redémarrer le poste avec "Astuce" en haut de page.
                            </li>
                        </ul>
                    </section>

                    <p className='text-lg mb-6'>Si malgrès les vérifications préalables l'ordinateur ne démarre toujours pas passer à la suite.</p>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-green-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étapes de diagnostic</h2>
                        </div>

                        <ul className='list-decimal m-2'>
                            <li className="text-lg mb-4">
                                Vérifier si le poste affiche un code erreur ou un message spécifique au démarrage.
                            </li>
                            <li className="text-lg mb-4">
                                Si un code erreur est affiché, le noter pour l'escalade.
                            </li>
                            <li className="text-lg mb-4">
                                Essayer de démarrer en mode sans échec (F8 ou Shift + F8 au démarrage).
                            </li>
                            <li className="text-lg mb-4">
                                Si un accès au BIOS est possible, vérifier les paramètres de démarrage et de sécurité.
                            </li>
                            <li className="text-lg mb-4">
                                Si un BIP sonore se fait entendre au démarre du poste, faire une vidéo cela peut indiquer un problème matériel spécifique.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-amber-600 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Escalade & documentation</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Escaladez au N2/SAV si :
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Aucune réaction électrique après toutes les vérifications d'alimentation.</li>
                            <li>Codes LED/bips indiquant panne carte mère/CPU/GPU.</li>
                        </ul>
                        <p className="text-lg mt-4">
                            <span className="font-medium">À renseigner dans le ticket :</span> symptômes précis, étapes effectuées, code/bip relevé avec vidéo, n° de série, photos si possible.
                        </p>
                        <Link className='text-blue-500' href="/lenovorep">Lenovo Réparation</Link>
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
