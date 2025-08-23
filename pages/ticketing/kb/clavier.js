import React from 'react';
import { FaKeyboard } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import TicketingLayout from "@/components/TicketingLayout";

const ProblWifi = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Changer language du clavier (AZER, QWER)</h1>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <p className="text-lg mb-4">
                            La langue du clavier est définie par défaut en AZERTY, pour changer la langue du clavier en QWERTY définitivement, suivez les instructions suivantes.
                        </p>
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaKeyboard className="text-blue-500 text-3xl mr-4" />
                        </div>
                        <ul className='list-decimal m-2'>
                            <li className="text-lg mb-4">
                                Cliquez sur le menu <b>Démarrer</b>, puis sur <b>Paramètres</b>.
                            </li>
                            <li className="text-lg mb-4">
                                Allez dans <b>Heure</b> et <b>langue</b>.
                            </li>
                            <li className="text-lg mb-4">
                                Sélectionnez l'onglet <b>Langue et région</b>.
                            </li>
                            <Image
                                src="/images/clavier1.png"
                                alt="Paramètres Heure et langue windows"
                                width={700}
                                height={400}
                                className="mb-6"
                            />
                            <li className="text-lg mb-4">
                                Sous Langues préférées, cliquez sur les "..." de la langue que vous utilisez (par exemple, Français ou Anglais).
                            </li>
                            <li className="text-lg mb-4">
                                Cliquez sur <b>Options linguistiques</b>.
                            </li>
                            <Image
                                src="/images/clavier2.png"
                                alt="Paramètres options linguistiques windows"
                                width={700}
                                height={400}
                                className="mb-6"
                            />
                            <li className="text-lg mb-4">
                                Sous <b>Claviers</b>, cliquez sur <b>Ajouter un clavier</b>.
                            </li>
                            <li className="text-lg mb-4">
                                Choissisez la disposition voulue.
                            </li>
                            <Image
                                src="/images/clavier3.png"
                                alt="Paramètres Ajouter un clavier windows"
                                width={700}
                                height={400}
                                className="mb-6"
                            />
                            <li className="text-lg mb-4">
                                Supprimez l'ancien claviers en cliquant sur les "..." puis sur <b>Supprimer</b> et redémarrez l'ordinateur pour que les modifications soient prises en compte.
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

export default ProblWifi;
