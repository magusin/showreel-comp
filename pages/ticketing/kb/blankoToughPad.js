import React from 'react';
import TicketingLayout from "@/components/TicketingLayout";
import Link from 'next/link';

const BlankoToughPad = () => {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto py-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Blanchir ToughPad FZ-G1</h1>
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <ul className='list-decimal m-2'>
                            <li className="text-lg mb-4">
                                Entrez dans le BIOS de l'ordinateur en appuyant sur la touche A2 de la tablette au démarrage.
                            </li>
                            <li className="text-lg mb-4">
                                Allez dans l'onglet "Sécurity" et en face de "Secure Boot Control" sélectionnez "Disabled".
                            </li>
                            <li className="text-lg mb-4">
                                Sauvegardez les changements puis quittez le BIOS.
                            </li>
                            <li className="text-lg mb-4">
                                Redémarrez et retournez dans le BIOS avec A2 au démarrage.
                            </li>
                            <li className="text-lg mb-4">
                                Sélectionnez l'onglet "Exit" puis "Boot Override" et bootez sur la clé "UEFI: General UDisk"
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

export default BlankoToughPad;
