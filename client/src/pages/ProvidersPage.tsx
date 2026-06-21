import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from 'services/api';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import { CardSkeleton } from 'components/Skeletons';
import EmptyState from 'components/EmptyState';
import { Provider } from 'types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const categories = ['Traiteur', 'Photographe', 'Musicien', 'DJ', 'Décoration', 'Vidéaste'];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;
        const res = await api.get('/providers', { params });
        setProviders(res.data.data);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [category, search]);

  return (
    <>
      <SEO title="Prestataires" description="Trouvez les meilleurs prestataires pour vos événements" url="/providers" />
      <div className="page-container">
        <Breadcrumbs items={[{ label: 'Prestataires' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prestataires</h1>
          <p className="text-gray-500 mt-1">Trouvez les professionnels pour votre événement</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un prestataire..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!category ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>Tous</button>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c === category ? '' : c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === c ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : providers.length === 0 ? (
          <EmptyState icon={
  <svg className="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
} title="Aucun prestataire trouvé" description="Essayez de modifier vos critères de recherche." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Link key={provider.id} to={`/providers/${provider.id}`} className="card-hover overflow-hidden animate-fade-in group">
                {provider.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">{provider.category}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-sm font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{provider.name}</h3>
                  {provider.city && <p className="text-sm text-gray-400 mb-3">{provider.city}</p>}
                  {provider.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{provider.description}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-primary-600">{provider.priceRange || 'Sur devis'}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${provider.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {provider.available ? 'Disponible' : 'Indisponible'}
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
