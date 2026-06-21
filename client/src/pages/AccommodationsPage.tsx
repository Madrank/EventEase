import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from 'services/api';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { CardSkeleton } from 'components/Skeletons';
import EmptyState from 'components/EmptyState';
import { Accommodation } from 'types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (city) params.city = city;
        if (capacity) params.capacity = capacity;
        const res = await api.get('/accommodations', { params });
        setAccommodations(res.data.data);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [city, capacity]);

  return (
    <>
      <SEO title="Hébergements" description="Trouvez le lieu parfait pour votre événement" url="/accommodations" />
      <div className="page-container">
        <Breadcrumbs items={[{ label: 'Hébergements' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hébergements</h1>
          <p className="text-gray-500 mt-1">Trouvez le lieu idéal pour votre événement</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher par ville..." value={city} onChange={(e) => setCity(e.target.value)} className="input-field pl-10" />
          </div>
          <input type="number" placeholder="Capacité minimum" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="input-field sm:w-48" min="1" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : accommodations.length === 0 ? (
          <EmptyState icon={
  <svg className="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
} title="Aucun hébergement trouvé" description="Essayez de modifier vos critères de recherche." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((acc) => (
              <Link key={acc.id} to={`/accommodations/${acc.id}`} className="card-hover overflow-hidden animate-fade-in group">
                {acc.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={acc.image} alt={acc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">{acc.type}</span>
                    {acc.pricePerNight && (
                      <span className="text-lg font-bold text-primary-600">
                        {acc.pricePerNight.toLocaleString('fr-FR')} €<span className="text-xs text-gray-400 font-normal">/nuit</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{acc.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 flex items-center">{acc.city}{acc.postalCode ? ` (${acc.postalCode})` : ''}</p>
                  {acc.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{acc.description}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-surface-500 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Jusqu'à <strong className="mx-1">{acc.capacity}</strong> personnes
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${acc.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {acc.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
