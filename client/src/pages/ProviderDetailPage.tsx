import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from 'services/api';
import { useAuth } from 'hooks/useAuth';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { DetailsSkeleton } from 'components/Skeletons';
import AvailabilityCalendar from 'components/AvailabilityCalendar';
import toast from 'react-hot-toast';
import { Provider } from 'types';

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/providers/${id}`).then((r) => setProvider(r.data)),
      api.get(`/providers/availability/${id}`).then((r) => setBookedDates(r.data)),
    ]).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!id || !user) return toast.error('Connectez-vous pour réserver');
    if (selectedDates.length === 0) return toast.error('Sélectionnez des dates dans le calendrier');
    setSending(true);
    try {
      await api.post(`/providers/${id}/contact`, { dates: selectedDates, message });
      toast.success(`Demande envoyée pour les ${selectedDates.length} jour(s) sélectionné(s) !`);
      setSelectedDates([]);
      setMessage('');
    } catch {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (!provider) return <div className="page-container text-center py-16 text-gray-500">Prestataire non trouvé</div>;

  return (
    <>
      <SEO title={provider.name} description={provider.description || ''} url={`/providers/${provider.id}`} />
      <div className="page-container max-w-4xl">
        <Breadcrumbs items={[
          { label: 'Prestataires', href: '/providers' },
          { label: provider.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {provider.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={provider.image} alt={provider.name} className="w-full h-72 object-cover" />
              </div>
            )}

            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-info mb-2 inline-block">{provider.category}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                  {provider.city && <p className="text-gray-500 mt-1 flex items-center">{provider.city}</p>}
                </div>
                <div className="flex items-center space-x-1 text-lg">
                  <span className="text-amber-400">★</span>
                  <span className="font-bold text-gray-900">{provider.rating.toFixed(1)}</span>
                </div>
              </div>

              {provider.description && <p className="text-gray-600 leading-relaxed">{provider.description}</p>}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Coordonnées</h2>
              <div className="space-y-3">
                {provider.email && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${provider.email}`} className="text-sm font-medium text-primary-600 hover:underline">{provider.email}</a>
                    </div>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium text-gray-900">{provider.phone}</p>
                    </div>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    <div>
                      <p className="text-xs text-gray-500">Site web</p>
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline">{provider.website}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <AvailabilityCalendar
              unavailableDates={bookedDates}
              title="Sélectionnez vos dates"
              selectedDates={selectedDates}
              onSelectionChange={setSelectedDates}
            />

            {selectedDates.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-primary-700 mb-1">
                  {selectedDates.length} jour{selectedDates.length > 1 ? 's' : ''} sélectionné{selectedDates.length > 1 ? 's' : ''}
                </p>
                <p className="text-primary-600">
                  {new Date(selectedDates[0]).toLocaleDateString('fr-FR')}
                  {selectedDates.length > 1 && ` — ${new Date(selectedDates[selectedDates.length - 1]).toLocaleDateString('fr-FR')}`}
                </p>
              </div>
            )}

            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Réservation</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tarif</span>
                  <span className="font-bold text-gray-900">{provider.priceRange || 'Sur devis'}</span>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input-field"
                        rows={2}
                        placeholder="Dites bonjour au prestataire..."
                      />
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={!provider.available || selectedDates.length === 0 || sending}
                      className="btn-primary w-full py-3"
                    >
                      {sending
                        ? 'Envoi en cours...'
                        : selectedDates.length === 0
                          ? 'Sélectionnez des dates'
                          : `Contacter pour ${selectedDates.length} jour${selectedDates.length > 1 ? 's' : ''}`}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-3">Connectez-vous pour réserver</p>
                    <Link to="/login" className="btn-primary w-full text-center">Se connecter</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
