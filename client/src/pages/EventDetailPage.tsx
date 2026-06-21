import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchEvent } from 'store/eventSlice';
import { useAuth } from 'hooks/useAuth';
import { guestService } from 'services/guest.service';
import { paymentService } from 'services/payment.service';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { DetailsSkeleton } from 'components/Skeletons';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentEvent, loading } = useSelector((state: RootState) => state.events);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'guests' | 'contributions' | 'providers'>('guests');
  const [guestEmail, setGuestEmail] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');

  useEffect(() => {
    if (id) dispatch(fetchEvent(id));
  }, [dispatch, id]);

  const isOwner = user && currentEvent?.organizerId === user.id;
  const totalContributions = currentEvent?.contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const statusColors: Record<string, string> = {
    DRAFT: 'badge-warning', PUBLISHED: 'badge-success', CANCELLED: 'badge-danger', COMPLETED: 'badge-info',
  };
  const statusLabels: Record<string, string> = {
    DRAFT: 'Brouillon', PUBLISHED: 'Publié', CANCELLED: 'Annulé', COMPLETED: 'Terminé',
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user || !contributionAmount) return;
    try {
      const api = (await import('services/api')).default;
      const contribution = await api.post(`/events/${id}/contributions`, { amount: parseFloat(contributionAmount), status: 'PENDING' });
      const data = await paymentService.createCheckoutSession({
        contributionId: contribution.data.id,
        eventId: id,
        amount: parseFloat(contributionAmount),
        metadata: { name: `Contribution - ${currentEvent?.title}`, description: `Contribution de ${parseFloat(contributionAmount)}€ pour ${currentEvent?.title}` },
      });
      if (data.url) window.location.href = data.url;
    } catch { toast.error('Erreur lors de la contribution'); }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !guestEmail) return;
    try {
      await guestService.add(id, { email: guestEmail });
      toast.success('Invitation envoyée !');
      setGuestEmail('');
      dispatch(fetchEvent(id));
    } catch { toast.error('Erreur lors de l\'invitation'); }
  };

  if (loading || !currentEvent) return <DetailsSkeleton />;

  const tabs = [
    { key: 'guests', label: 'Invitée', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, count: currentEvent.guests?.length || 0 },
    { key: 'contributions', label: 'Cagnotte', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, count: currentEvent.contributions?.length || 0 },
    { key: 'providers', label: 'Prestataires', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, count: currentEvent.providers?.length || 0 },
  ];

  return (
    <>
      <SEO
        title={currentEvent.title}
        description={currentEvent.description.slice(0, 160)}
        url={`/events/${currentEvent.id}`}
        type="article"
      />
      <div className="page-container">
        <Breadcrumbs items={[
          { label: 'Événements', href: '/events' },
          { label: currentEvent.title },
        ]} />

        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={statusColors[currentEvent.status]}>{statusLabels[currentEvent.status]}</span>
                {currentEvent.category && (
                  <span className="text-xs font-medium bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{currentEvent.category}</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{currentEvent.title}</h1>
            </div>
            {isOwner && (
              <Link to={`/events/${currentEvent.id}/edit`} className="btn-secondary shrink-0">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Modifier
              </Link>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">{currentEvent.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Date</p>
              <p className="font-medium text-gray-900">{format(new Date(currentEvent.date), 'PPP', { locale: fr })}</p>
              {currentEvent.endDate && <p className="text-sm text-gray-500">au {format(new Date(currentEvent.endDate), 'PPP', { locale: fr })}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Lieu</p>
              <p className="font-medium text-gray-900">{currentEvent.location || 'Non spécifié'}</p>
              {currentEvent.city && <p className="text-sm text-gray-500">{currentEvent.city}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Capacité</p>
              <p className="font-medium text-gray-900">{currentEvent.capacity ? `${currentEvent.capacity} personnes` : 'Non limitée'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Budget</p>
              <p className="font-medium text-gray-900">{currentEvent.budget ? `${currentEvent.budget.toLocaleString('fr-FR')} €` : 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label} {tab.count > 0 && <span className="ml-1 text-xs">({tab.count})</span>}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'guests' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Invitée ({currentEvent.guests?.length || 0})</h2>
            </div>

            {currentEvent.guests && currentEvent.guests.length > 0 ? (
              <div className="space-y-1 mb-6">
                {currentEvent.guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                        {(guest.firstName || guest.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{guest.firstName || guest.email}</p>
                        {guest.email && <p className="text-xs text-gray-400">{guest.email}</p>}
                      </div>
                    </div>
                    <span className={`badge-${guest.status === 'ACCEPTED' ? 'success' : guest.status === 'DECLINED' ? 'danger' : 'warning'}`}>
                      {guest.status === 'ACCEPTED' ? '✅ Accepté' : guest.status === 'DECLINED' ? '❌ Refusé' : '⏳ En attente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-sm text-surface-400">Aucun invité pour le moment</p>
              </div>
            )}

            {user && (
              <form onSubmit={handleInvite} className="flex space-x-2 border-t border-gray-100 pt-4">
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email de l'invité"
                  className="input-field flex-1"
                  required
                />
                <button type="submit" className="btn-primary">Inviter</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="card p-6 animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-4xl font-bold gradient-text">{totalContributions.toLocaleString('fr-FR')} €</p>
              <p className="text-sm text-gray-500 mt-1">collectés sur {currentEvent.contributions?.length || 0} contributions</p>
              {currentEvent.budget && (
                <div className="mt-3 w-full bg-gray-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((totalContributions / currentEvent.budget) * 100, 100)}%` }} />
                </div>
              )}
            </div>

            {currentEvent.contributions && currentEvent.contributions.length > 0 && (
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {currentEvent.contributions.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">🎁</div>
                      <div>
                        <p className="text-sm font-medium">{c.anonymous ? 'Anonyme' : c.user?.firstName || 'Utilisateur'}</p>
                        {c.message && <p className="text-xs text-gray-400">{c.message}</p>}
                      </div>
                    </div>
                    <span className="font-bold text-primary-600">{c.amount.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}

            {user && (
              <form onSubmit={handleContribute} className="flex space-x-2 border-t border-gray-100 pt-4">
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Montant (€)"
                  min="1"
                  step="0.01"
                  className="input-field flex-1"
                  required
                />
                <button type="submit" className="btn-primary">Contribuer</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Prestataires réservés ({currentEvent.providers?.length || 0})</h2>
            {currentEvent.providers && currentEvent.providers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentEvent.providers.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{booking.provider.name}</p>
                      <p className="text-xs text-gray-400">{booking.provider.category}</p>
                      {booking.price && <p className="text-xs text-gray-500 mt-1">{booking.price.toLocaleString('fr-FR')} €</p>}
                    </div>
                    <span className="badge-info">{booking.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <p className="text-sm text-surface-400">Aucun prestataire réservé</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
