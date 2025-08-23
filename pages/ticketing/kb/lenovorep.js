import React from 'react';
import Link from 'next/link';
import { FaTools, FaCheckCircle, FaEnvelope, FaWrench, FaClipboardCheck } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

const LenovoRep = () => {
    return (
        <TicketingLayout>
        <div className="min-h-screen py-10 px-4">
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Réparation Lenovo - Marche à Suivre</h1>

                <div className="mb-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm text-blue-900">
                            <strong>Objectif :</strong> remettre le poste en état de marche ou qualifier précisément l'escalade (N2/SAV) avec les codes erreurs, étapes réalisées et n° de série.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-sm text-amber-900">
                            <strong>Astuce :</strong> si une série de BIP sonore se fait lors du démarrage enregistrez une vidéo à envoyer à Lenovo pour identifier clairement le problème.
                        </p>
                    </div>
                </div>
                <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center mb-4">
                        <FaTools className="text-blue-500 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold">Étape 1 : Identifier le Problème</h2>
                    </div>
                    <p className="text-lg mb-4">
                        Avant de commencer la réparation, assurez-vous d'avoir identifié clairement le problème de l'appareil Lenovo.
                        Prenez note des symptômes et des messages d'erreur éventuels.
                        La garantie ne fonctionnera pas pour tout appareil endommagé par l'utilisateur ou un tiers.
                    </p>
                </section>

                <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center mb-4">
                        <FaClipboardCheck className="text-green-500 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold">Étape 2 : Vérifier la garantie</h2>
                    </div>
                    <p className="text-lg mb-4">
                        Vérifiez que l'appareil Lenovo est toujours sous garantie pour qu'il puisse être pris en charge par Lenovo en saisissant le numéro de série.
                    </p>
                    <Link className='text-blue-500' href="https://pcsupport.lenovo.com/fr/fr/products/laptops-and-netbooks/thinkpad-l-series-laptops/thinkpad-l14-gen-4-type-21h5-21h6/21h6/">
                        Support Lenovo
                    </Link>
                </section>

                <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center mb-4">
                        <FaEnvelope className="text-red-500 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold">Étape 3 : Contacter Lenovo</h2>
                    </div>
                    <p className="text-lg mb-4">
                        Si l'appareil est sous garantie, contactez Lenovo pour leur demander une réparation via le mail suivant.
                    </p>
                    <p className='text-pink-500 mb-2'>fr_premier@lenovo.com</p>
                    <p className="text-lg mb-4">
                        Dans le mail, indiquez vos coordonnées, la liste des appareils à réparer, le numéro de série et le problème rencontré, ainsi que les éventuelles contraintes pour l'accès à l'appareil.
                    </p>
                </section>

                <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center mb-4">
                        <FaCheckCircle className="text-yellow-500 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold">Étape 4 : Test et Validation</h2>
                    </div>
                    <p className="text-lg mb-4">
                        Une fois la réparation terminée, effectuez un test complet de l'appareil pour vous assurer que tout fonctionne
                        correctement. Vérifiez que le problème initial a été résolu et que l'appareil est entièrement fonctionnel.
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

export default LenovoRep;
