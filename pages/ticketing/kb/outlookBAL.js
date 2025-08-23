// pages/add-bal.js
import Image from 'next/image';
import Link from 'next/link';
import { FaTools, FaCheckCircle, FaEnvelope, FaWrench, FaClipboardCheck } from 'react-icons/fa';
import TicketingLayout from "@/components/TicketingLayout";

export default function AddBAL() {
    return (
        <TicketingLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">Ajouter une BAL dans Outlook</h1>

                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaClipboardCheck className="text-yellow-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 1 : Paramètre outlook</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Ouvrez l'application Outlook sur le compte de l'utilisateur. Ensuite, allez dans <strong>Fichier</strong> et sélectionnez <strong>Paramètres du compte</strong> puis <strong>Paramètres du compte ...</strong>.
                        </p>
                        <Image
                            src="/images/outlookBAL.png"
                            alt="Outlook Paramètres du Compte"
                            width={700}
                            height={400}
                            className="mb-6"
                        />
                    </section>


                    {/* Step 2 */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaWrench className="text-yellow-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 2 : Fichier de données</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Allez dans l'onglet <strong>Fichiers de données</strong> et double cliquez sur l'adresse mail du compte.
                        </p>
                    </section>

                    {/* Step 3 */}
                    <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-4">
                            <FaCheckCircle className="text-yellow-500 text-3xl mr-4" />
                            <h2 className="text-2xl font-semibold">Étape 3 : Ajouter la BAL</h2>
                        </div>
                        <p className="text-lg mb-4">
                            Cliquez sur <strong>Paramètres supplémentaires</strong> puis sur l'onglet <strong>Avancé</strong> et enfin sur <strong>Ajouter ...</strong> et entrez l'adresse mail de la BAL à ajouter.
                        </p>
                        <Image
                            src="/images/outlookBAL3.png"
                            alt="Outlook Paramètres du Compte"
                            width={700}
                            height={400}
                            className="mb-6"
                        />
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
}
