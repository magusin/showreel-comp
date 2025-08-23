import React from 'react';
import TicketingLayout from "@/components/TicketingLayout";
import Link from 'next/link';

const BlankoZBook = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Blanchir ZBook Fury</h1>
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <ul className='list-decimal m-2'>
                            <li className="text-lg mb-4">
                                Entrez dans le BIOS de l'ordinateur en appuyant sur la touche F10 au démarrage.
                            </li>
                            <li className="text-lg mb-4">
                                Allez dans l'onglet "Sécurity" et sélectionnez "Sure Start".
                            </li>
                            <li className="text-lg mb-4">
                                Décochez "Sure Start Secure Boot Keys Protection".
                            </li>
                            <li className="text-lg mb-4">
                                Appuyez sur Echap pour quitter le BIOS et enregistrer les modifications.
                            </li>
                            <li className="text-lg mb-4">
                                Lorsque vous êtes invité à saisir un code PIN à 4 chiffres pour confirmer les modifications des paramètres du BIOS,  saisissez le code PIN affiché à l'écran (le code doit apparaitre en dessous de celui affiché à l'écran).
                            </li>
                            <li className="text-lg mb-4">
                                Redémarrez l'ordinateur et entrez de nouveau dans le BIOS avec F10.
                            </li>
                            <li className="text-lg mb-4">
                                Naviguez de nouveau vers l'onglet "Sécurity".
                            </li>
                            <li className="text-lg mb-4">
                                Sélectionnez "Secure Boot Configuration".
                            </li>
                            <li className="text-lg mb-4">
                                Cochez "Enable MS UEFI CA Key".
                            </li>
                            <li className="text-lg mb-4">
                                Appuyez sur Echap pour retourner au menu précédent.
                            </li>
                            <li className="text-lg mb-4">
                                Sélectionnez de nouveau "Sure Start".
                            </li>
                            <li className="text-lg mb-4">
                                Cochez "Sure Start Secure Boot Keys Protection".
                            </li>
                            <li className="text-lg mb-4">
                                Appuyez sur Echap pour quitter le BIOS et enregistrer les modifications.
                            </li>
                            <li className="text-lg mb-4">
                                Appuyez sur F9 pour accéder au menu BOOT et sélectionnez la clé USB de blanchiment (General UDisk)
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

export default BlankoZBook;
