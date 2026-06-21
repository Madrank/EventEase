import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchMyEvents } from 'store/eventSlice';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
import SEO from 'components/SEO';
import StatCard from 'components/StatCard';
import EventCard from 'components/EventCard';
import EmptyState from 'components/EmptyState';
import { CardSkeleton } from 'components/Skeletons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProviderBooking {
  id: string;
  provider: { id: string; name: string; category: string; image?: string };
  status: string;
  date: string | null;
  notes: string | null;
  createdAt: string;
}

interface AccoBooking {
  id: string;
  accommodation: { id: string; name: string; type: string; image?: string; city?: string };
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  createdAt: string;
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { myEvents, loading } = useSelector((state: RootState) => state.events);
  const [providerBookings, setProviderBookings] = useState<ProviderBooking[]>([]);
  const [accoBookings, setAccoBookings] = useState<AccoBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchMyEvents());
    api.get('/my-bookings').then((r) => {
      setProviderBookings(r.data.providerBookings);
      setAccoBookings(r.data.accommodationBookings);
    }).finally(() => setBookingsLoading(false));
  }, [dispatch]);

  const published = myEvents.filter((e) => e.status === 'PUBLISHED').length;
  const drafts = myEvents.filter((e) => e.status === 'DRAFT').length;
  const totalGuests = myEvents.reduce((acc, e) => acc + (e._count?.guests || 0), 0);
  const totalBookings = providerBookings.length + accoBookings.length;
  const pendingBookings = providerBookings.filter(b => b.status === 'PENDING').length + accoBookings.filter(b => b.status === 'PENDING').length;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { PENDING: 'En attente', CONFIRMED: 'Confirmé', CANCELLED: 'Annulé', COMPLETED: 'Terminé' };
    return map[s] || s;
  };
  const statusColor = (s: string) => {
    const map: Record<string, string> = { PENDING: 'badge-warning', CONFIRMED: 'badge-success', CANCELLED: 'badge-danger', COMPLETED: 'badge-info' };
    return map[s] || 'badge-neutral';
  };

  return (
    <>
      <SEO title="Tableau de bord" description="Gérez vos événements et réservations" url="/dashboard" />
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="section-title">Tableau de bord</h1>
            <p className="text-surface-500 mt-1">Bienvenue, <span className="font-semibold text-surface-800">{user?.firstName}</span></p>
          </div>
          <Link to="/events/new" className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Créer un événement
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          } label="Événements" value={myEvents.length} color="primary" />
          <StatCard icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          } label="Publiés" value={published} color="green" />
          <StatCard icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          } label="Brouillons" value={drafts} color="amber" />
          <StatCard icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } label="Invités" value={totalGuests} color="blue" />
          <StatCard icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          } label="Réservations" value={totalBookings} color="purple" />
        </div>

        {/* Demandes en attente */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-surface-900">Mes demandes</h2>
            {pendingBookings > 0 && (
              <span className="badge-warning">{pendingBookings} en attente</span>
            )}
          </div>

          {bookingsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : totalBookings === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              }
              title="Aucune demande pour le moment"
              description="Contactez un prestataire ou réservez un hébergement pour voir vos demandes apparaître ici."
            />
          ) : (
            <div className="space-y-4">
              {/* Réservations prestataires */}
              {providerBookings.map((b) => (
                <Link key={b.id} to={`/providers/${b.provider.id}`} className="card p-4 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {b.provider.image ? (
                        <img src={b.provider.image} alt={b.provider.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-surface-900">{b.provider.name}</p>
                      <p className="text-xs text-surface-500">{b.provider.category} — {format(new Date(b.createdAt), 'dd MMM yyyy', { locale: fr })}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{b.notes?.replace(/^Dates: /, '')}</p>
                    </div>
                  </div>
                  <span className={statusColor(b.status)}>{statusLabel(b.status)}</span>
                </Link>
              ))}

              {/* Réservations hébergements */}
              {accoBookings.map((b) => (
                <Link key={b.id} to={`/accommodations/${b.accommodation.id}`} className="card p-4 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {b.accommodation.image ? (
                        <img src={b.accommodation.image} alt={b.accommodation.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-surface-900">{b.accommodation.name}</p>
                      <p className="text-xs text-surface-500">
                        {b.accommodation.type}{b.accommodation.city ? ` — ${b.accommodation.city}` : ''}
                        {b.checkIn && ` — ${format(new Date(b.checkIn), 'dd MMM', { locale: fr })}${b.checkOut ? ` → ${format(new Date(b.checkOut), 'dd MMM yyyy', { locale: fr })}` : ''}`}
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">{b.guests} invité{b.guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className={statusColor(b.status)}>{statusLabel(b.status)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mes événements */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900">Mes événements</h2>
          {myEvents.length > 0 && (
            <span className="text-sm text-surface-400">{myEvents.length} événement{myEvents.length > 1 ? 's' : ''}</span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : myEvents.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            }
            title="Vous n'avez pas encore d'événement"
            description="Créez votre premier événement et commencez à organiser !"
            actionLabel="Créer un événement"
            actionLink="/events/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
