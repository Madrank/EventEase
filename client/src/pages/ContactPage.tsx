/**
 * Page de contact
 * Conforme référentiel DWWM 2023
 */

import React, { useState } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = [
    "Question générale",
    "Support technique",
    "Partenariat",
    "Presse",
    "Autre",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulation de l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Ici, vous pourriez faire un appel API pour envoyer le message
      console.log("Message envoyé:", formData);

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setErrors({
        general: "Une erreur est survenue lors de l'envoi du message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre message. Nous vous répondrons dans les plus brefs
            délais.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question ? Un projet ? Notre équipe est là pour vous accompagner
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Nos coordonnées
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl">📧</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@eventease.fr</p>
                    <p className="text-gray-600">support@eventease.fr</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl">📞</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Téléphone
                    </h3>
                    <p className="text-gray-600">01 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl">📍</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Adresse
                    </h3>
                    <p className="text-gray-600">
                      123 Avenue des Événements
                      <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl">⏰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Horaires
                    </h3>
                    <p className="text-gray-600">
                      Lundi - Vendredi : 9h - 18h
                      <br />
                      Samedi : 10h - 16h
                      <br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <span className="text-gray-600">📘</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <span className="text-gray-600">📷</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <span className="text-gray-600">🐦</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    <span className="text-gray-600">💼</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {errors.general}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="Votre nom complet"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.subject ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.message ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Décrivez votre demande en détail..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.message.length}/500 caractères
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="privacy"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    J'accepte la{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      politique de confidentialité
                    </a>{" "}
                    et les{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      conditions d'utilisation
                    </a>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Envoi en cours...</span>
                      </div>
                    ) : (
                      "Envoyer le message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ rapide */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment créer un événement ?
              </h3>
              <p className="text-gray-600 text-sm">
                Cliquez sur "Créer un événement" dans votre dashboard,
                remplissez les informations et invitez vos invités.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Puis-je annuler un événement ?
              </h3>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez annuler un événement à tout moment depuis votre
                dashboard. Les invités seront notifiés.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment contacter un prestataire ?
              </h3>
              <p className="text-gray-600 text-sm">
                Consultez notre page prestataires, trouvez celui qui vous
                intéresse et utilisez le bouton "Contacter".
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Y a-t-il des frais cachés ?
              </h3>
              <p className="text-gray-600 text-sm">
                Non, tous nos tarifs sont transparents. Vous ne payez que ce qui
                est affiché, sans frais cachés.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment fonctionne la cagnotte ?
              </h3>
              <p className="text-gray-600 text-sm">
                Les invités peuvent contribuer financièrement à votre événement
                via notre système de cagnotte sécurisé.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Puis-je personnaliser les invitations ?
              </h3>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez personnaliser le design et le contenu de vos
                invitations selon vos préférences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

