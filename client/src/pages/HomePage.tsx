import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchEvents } from 'store/eventSlice';
import EventCard from 'components/EventCard';
import SEO from 'components/SEO';

const stats = [
  { icon: 'calendar', value: '1000+', label: 'Événements créés' },
  { icon: 'users', value: '5000+', label: 'Invités gérés' },
  { icon: 'building', value: '200+', label: 'Prestataires référencés' },
  { icon: 'euro', value: '50K+', label: 'Collectés via cagnotte' },
];

const features = [
  {
    icon: 'clipboard',
    title: 'Gestion des événements',
    desc: 'Créez, modifiez et gérez vos événements avec une interface intuitive. Catégories, dates, lieux et budgets.',
    color: 'from-primary-500 to-purple-600',
  },
  {
    icon: 'users',
    title: 'Gestion des invités',
    desc: 'Invitations par email, suivi des RSVP en temps réel. Vos invités confirment en un clic.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: 'briefcase',
    title: 'Prestataires & Lieux',
    desc: 'Trouvez traiteurs, photographes, musiciens et salles. Réservez directement depuis la plateforme.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: 'wallet',
    title: 'Cagnotte collaborative',
    desc: 'Collectez des fonds facilement avec une cagnotte intégrée. Suivez les contributions en direct.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: 'device',
    title: '100% Responsive',
    desc: 'Interface optimisée pour tous les écrans. Gérez vos événements depuis votre téléphone.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: 'shield',
    title: 'RGPD Conforme',
    desc: 'Vos données sont protégées. Conformité totale avec les réglementations européennes.',
    color: 'from-indigo-500 to-violet-600',
  },
];

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading } = useSelector((state: RootState) => state.events);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchEvents({ limit: 6 }));
  }, [dispatch]);

  return (
    <>
      <SEO
        title="Organisateur d'événements"
        description="EventEase - L'application complète pour organiser, gérer et partager vos événements. Invitations, prestataires, cagnotte collaborative."
        url="/"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/10">
              🚀 Nouvelle version 2.0 disponible
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Organisez vos événements
              <span className="block bg-gradient-to-r from-primary-300 to-purple-300 bg-clip-text text-transparent">
                en toute simplicité
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Créez, gérez et partagez vos événements. Invitations intelligentes, 
              réservation de prestataires et cagnotte collaborative, le tout dans une 
              interface moderne et intuitive.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/events" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-primary-500/25">
                Explorer les événements
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all duration-200 text-base">
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 text-center animate-fade-in">
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center text-primary-600 mb-3">
                {stat.icon === 'calendar' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
                {stat.icon === 'users' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                {stat.icon === 'building' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>}
                {stat.icon === 'euro' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              </div>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="section-title mt-2">Tout ce dont vous avez besoin</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Une plateforme complète pour organiser des événements mémorables, du début à la fin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className="card-hover p-6 animate-fade-in group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {feat.icon === 'clipboard' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                {feat.icon === 'users' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
                {feat.icon === 'briefcase' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.893 23.893 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                {feat.icon === 'wallet' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>}
                {feat.icon === 'device' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
                {feat.icon === 'shield' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {events.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Découvrir</span>
                <h2 className="section-title mt-1">Événements récents</h2>
              </div>
              <Link to="/events" className="btn-ghost mt-2 sm:mt-0">
                Voir tout
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="skeleton h-5 w-20 mb-4" />
                    <div className="skeleton h-6 w-3/4 mb-3" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-2/3 mb-4" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-purple-700 p-8 sm:p-12 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à organiser votre prochain événement ?
            </h2>
            <p className="text-primary-100/80 mb-8 text-lg">
              Rejoignez des milliers d'organisateurs qui nous font confiance.
            </p>
            <Link to="/register" className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-base hover:bg-primary-50 transition-all shadow-xl shadow-black/10">
              Créer un compte gratuit
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
