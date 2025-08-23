import React from 'react';
import Link from 'next/link';
import { FaTools, FaCheckCircle, FaEnvelope, FaWifi, FaClipboardCheck } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const ProblWifi = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Problème de wifi sur poste de travail</h1>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <p className="text-lg mb-4">
                            Si l'ordinateur n'a plus l'icon du wifi en bas ou des problèmes pour se connecter ou plus couramment qu'il ne trouve pas le réseau en se reliant à la station d'accueil essayez les solutions suivantes pour résoudre le problème.
                        </p>
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaTools className="text-blue-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 1 : Vérification de l'espace disque</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Certaine mise à jour son bloqués par l'espace disque insufisant, vérifiez l'espace disque dans "Ce PC" pour le C:. Si le disque est dans le rouge ou l'espace semble insufisant faites-en.
                            Redémarrez et testez le wifi et/ou réseau.
                            Si le problème n'est pas résolu passez à l'étape 2.
                        </p>.
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaClipboardCheck className="text-green-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 2 : Check et MAJ</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Après avoir vérifié l'espace disque lancez un SimpleCheck en vous rendant dans "C:/Temp" et exécutez SimpleCheck, dans le même temps ouvrez l'invite de commande avec "cmd" dans la Recherche Windows, dans l'invite de commande tappez la commande "gpupdate /force" et exécutez la avec la touche Entrer.
                            SimpleCheck peut installer des pilotes manquant ou en erreur (vérifiez dans "Gestionnaire de périphériques") et laissez l'invite de commande faire les mises à jour utilisateur si besoin.
                            Testez le réseau et/ou wifi, si le problème n'est pas résolu passez à l'étape suivante.
                        </p>
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaWifi className="text-green-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 3 : Certificat wifi</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Si le problème ne concerne que le wifi et non la station d'accueil révoquer le certificat wifi de l'utilisateur et réinstallez le lui puis testez 30-60 min plus tard.
                        </p>
                    </section>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaEnvelope className="text-red-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Réseau non fonctionnel sur Station d'accueil Lenovo</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Rendez-vous dans le "EDF Store" et désinstallez le driver "Driver pour station d'accueil" en étant branché sur la station, redémarrez l'ordinateur et réinstallez le plugin.
                            Si le problème n'est pas résolu essayez de désinstaller le driver et de redémarrer et de tester sans réinstaller le driver.
                        </p>
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
