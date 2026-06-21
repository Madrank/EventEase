import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from 'services/api';
import { useAuth } from 'hooks/useAuth';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { DetailsSkeleton } from 'components/Skeletons';
import AvailabilityCalendar from 'components/AvailabilityCalendar';
import toast from 'react-hot-toast';
import { Accommodation } from 'types';

export default function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [acc, setAcc] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ guests: 1, notes: '' });
  const [bookedRanges, setBookedRanges] = useState<{ checkIn: string; checkOut: string }[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const checkIn = useMemo(() => selectedDates.length > 0 ? selectedDates[0] : null, [selectedDates]);
  const checkOut = useMemo(() => selectedDates.length > 1 ? selectedDates[selectedDates.length - 1] : null, [selectedDates]);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/accommodations/${id}`).then((r) => setAcc(r.data)),
      api.get(`/accommodations/availability/${id}`).then((r) => setBookedRanges(r.data)),
    ]).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return toast.error('Connectez-vous pour réserver');
    if (!checkIn) return toast.error('Sélectionnez au moins une date d\'arrivée');
    try {
      await api.post(`/accommodations/${id}/book`, {
        ...bookingForm,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: checkOut ? new Date(checkOut).toISOString() : new Date(checkIn).toISOString(),
      });
      toast.success(`Réservation confirmée du ${new Date(checkIn).toLocaleDateString('fr-FR')}${checkOut ? ` au ${new Date(checkOut).toLocaleDateString('fr-FR')}` : ''} !`);
      setBookingForm({ guests: 1, notes: '' });
      setSelectedDates([]);
    } catch { toast.error('Erreur lors de la réservation'); }
  };

  if (loading) return <DetailsSkeleton />;
  if (!acc) return <div className="page-container text-center py-16 text-gray-500">Hébergement non trouvé</div>;

  return (
    <>
      <SEO title={acc.name} description={acc.description || ''} url={`/accommodations/${acc.id}`} />
      <div className="page-container max-w-4xl">
        <Breadcrumbs items={[
          { label: 'Hébergements', href: '/accommodations' },
          { label: acc.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {acc.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={acc.image} alt={acc.name} className="w-full h-72 object-cover" />
              </div>
            )}

            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-info mb-2 inline-block">{acc.type}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{acc.name}</h1>
                  {acc.city && <p className="text-gray-500 mt-1">{acc.city}{acc.postalCode ? ` (${acc.postalCode})` : ''}</p>}
                </div>
                <div className="text-right">
                  {acc.pricePerNight && (
                    <p className="text-2xl font-bold text-primary-600">{acc.pricePerNight.toLocaleString('fr-FR')} €<span className="text-sm text-gray-400 font-normal">/nuit</span></p>
                  )}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${acc.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {acc.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>

              {acc.description && <p className="text-gray-600 leading-relaxed">{acc.description}</p>}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Informations</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500">Capacité maximale</p>
                  <p className="font-bold text-gray-900 text-lg">{acc.capacity} personnes</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500">Type</p>
                  <p className="font-bold text-gray-900 text-lg">{acc.type}</p>
                </div>
                {acc.address && (
                  <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Adresse</p>
                    <p className="font-medium text-gray-900">{acc.address}, {acc.city} {acc.postalCode}</p>
                  </div>
                )}
              </div>
            </div>

            {acc.amenities && (
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-4">Équipements</h2>
                <div className="flex flex-wrap gap-2">
                  {acc.amenities.split(',').map((a, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">{a.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <AvailabilityCalendar
              unavailableDates={[]}
              unavailableRanges={bookedRanges}
              title="Choisissez vos dates"
              selectedDates={selectedDates}
              onSelectionChange={setSelectedDates}
            />

            {selectedDates.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-primary-700 mb-1">Séjour de {nights} nuit{nights > 1 ? 's' : ''}</p>
                <p className="text-primary-600">
                  <span className="font-semibold">Arrivée :</span> {new Date(checkIn!).toLocaleDateString('fr-FR')}
                </p>
                {checkOut && (
                  <p className="text-primary-600">
                    <span className="font-semibold">Départ :</span> {new Date(checkOut).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {acc.pricePerNight && (
                  <p className="text-primary-700 font-bold mt-2">
                    Total : {(acc.pricePerNight * nights).toLocaleString('fr-FR')} €
                  </p>
                )}
              </div>
            )}

            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Réserver</h2>
              {user ? (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre d'invités</label>
                    <input type="number" value={bookingForm.guests} onChange={(e) => setBookingForm({ ...bookingForm, guests: parseInt(e.target.value) || 1 })} min="1" max={acc.capacity} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optionnel)</label>
                    <textarea value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} className="input-field" rows={3} placeholder="Vos demandes spéciales..." />
                  </div>
                  <button type="submit" disabled={!acc.available || selectedDates.length === 0} className="btn-primary w-full py-3">
                    {selectedDates.length === 0
                      ? 'Sélectionnez vos dates'
                      : `Réserver du ${new Date(checkIn!).toLocaleDateString('fr-FR')}${checkOut ? ` au ${new Date(checkOut).toLocaleDateString('fr-FR')}` : ''}`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-4">Connectez-vous pour réserver</p>
                  <Link to="/login" className="btn-primary w-full text-center">Se connecter</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
