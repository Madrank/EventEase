import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchEvents } from 'store/eventSlice';
import EventCard from 'components/EventCard';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { CardSkeleton } from 'components/Skeletons';
import EmptyState from 'components/EmptyState';

const categories = ['', 'Mariage', 'Conférence', 'Anniversaire', 'Soirée', 'Concert', 'Sport', 'Autre'];

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, pagination, loading } = useSelector((state: RootState) => state.events);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEvents({ page, limit: 12, search, category: category || undefined }));
  }, [dispatch, page, search, category]);

  return (
    <>
      <SEO title="Événements" description="Découvrez tous les événements publics sur EventEase" url="/events" />
      <div className="page-container">
        <Breadcrumbs items={[{ label: 'Événements' }]} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="section-title">Événements</h1>
            <p className="text-gray-500 mt-1">Découvrez les événements à venir</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="input-field sm:w-48"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c || 'Toutes les catégories'}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg className="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            title="Aucun événement trouvé"
            description="Essayez de modifier vos critères de recherche ou explorez d'autres catégories."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  ← Précédent
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      p === page
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
