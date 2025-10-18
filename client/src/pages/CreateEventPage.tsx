/**
 * Page de création d'événement
 * Conforme référentiel DWWM 2023
 */

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Schéma de validation
const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  startDate: z.string().min(1, "La date de début est requise"),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(1, "Le lieu est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  capacity: z
    .number()
    .min(1, "La capacité doit être d'au moins 1 personne")
    .optional(),
  budget: z.number().min(0, "Le budget ne peut pas être négatif").optional(),
  isPublic: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventSchema>;

const CreateEventPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isPublic: false,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation de l'envoi des données
      console.log("Données de l'événement:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirection vers la page des événements
      navigate("/events");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Créer un événement
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations ci-dessous pour créer votre événement.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informations de base */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informations de base
                  </h2>
                </div>
                <div className="card-body space-y-6">
                  {/* Titre */}
                  <div>
                    <label htmlFor="title" className="form-label">
                      Titre de l'événement *
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.title ? "border-error-500" : "border-gray-300"
                      }`}
                      placeholder="Ex: Mariage de Sophie et Pierre"
                    />
                    {errors.title && (
                      <p className="form-error">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="form-label">
                      Description *
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.description
                          ? "border-error-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Décrivez votre événement..."
                    />
                    {errors.description && (
                      <p className="form-error">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Images */}
                  <div>
                    <label className="form-label">Images de l'événement</label>
                    <div className="mt-1">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Cliquez pour ajouter des images
                        </span>
                      </label>
                    </div>

                    {/* Aperçu des images */}
                    {uploadedImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date et heure */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Date et heure
                  </h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date de début */}
                    <div>
                      <label htmlFor="startDate" className="form-label">
                        Date de début *
                      </label>
                      <input
                        {...register("startDate")}
                        type="date"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.startDate
                            ? "border-error-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.startDate && (
                        <p className="form-error">{errors.startDate.message}</p>
                      )}
                    </div>

                    {/* Heure de début */}
                    <div>
                      <label htmlFor="startTime" className="form-label">
                        Heure de début *
                      </label>
                      <input
                        {...register("startTime")}
                        type="time"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.startTime
                            ? "border-error-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.startTime && (
                        <p className="form-error">{errors.startTime.message}</p>
                      )}
                    </div>

                    {/* Date de fin */}
                    <div>
                      <label htmlFor="endDate" className="form-label">
                        Date de fin
                      </label>
                      <input
                        {...register("endDate")}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* Heure de fin */}
                    <div>
                      <label htmlFor="endTime" className="form-label">
                        Heure de fin
                      </label>
                      <input
                        {...register("endTime")}
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">Lieu</h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom du lieu */}
                    <div>
                      <label htmlFor="location" className="form-label">
                        Nom du lieu *
                      </label>
                      <input
                        {...register("location")}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.location
                            ? "border-error-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Ex: Château de Versailles"
                      />
                      {errors.location && (
                        <p className="form-error">{errors.location.message}</p>
                      )}
                    </div>

                    {/* Ville */}
                    <div>
                      <label htmlFor="city" className="form-label">
                        Ville *
                      </label>
                      <input
                        {...register("city")}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.city ? "border-error-500" : "border-gray-300"
                        }`}
                        placeholder="Ex: Versailles"
                      />
                      {errors.city && (
                        <p className="form-error">{errors.city.message}</p>
                      )}
                    </div>

                    {/* Adresse */}
                    <div>
                      <label htmlFor="address" className="form-label">
                        Adresse *
                      </label>
                      <input
                        {...register("address")}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.address
                            ? "border-error-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Ex: Place d'Armes"
                      />
                      {errors.address && (
                        <p className="form-error">{errors.address.message}</p>
                      )}
                    </div>

                    {/* Code postal */}
                    <div>
                      <label htmlFor="postalCode" className="form-label">
                        Code postal *
                      </label>
                      <input
                        {...register("postalCode")}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.postalCode
                            ? "border-error-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Ex: 78000"
                      />
                      {errors.postalCode && (
                        <p className="form-error">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacité et budget */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Capacité et budget
                  </h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Capacité */}
                    <div>
                      <label htmlFor="capacity" className="form-label">
                        Nombre d'invités
                      </label>
                      <input
                        {...register("capacity", { valueAsNumber: true })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ex: 100"
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="form-label">
                        Budget estimé (€)
                      </label>
                      <input
                        {...register("budget", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ex: 5000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visibilité */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Visibilité
                  </h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        {...register("isPublic")}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        Rendre cet événement public
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Les événements publics sont visibles par tous les
                      utilisateurs d'EventEase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Actions
                  </h2>
                </div>
                <div className="card-body space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-4 w-4 mr-2"></div>
                        Création en cours...
                      </div>
                    ) : (
                      "Créer l'événement"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/events")}
                    className="btn btn-outline w-full"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;



