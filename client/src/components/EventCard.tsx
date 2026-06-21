import { Link } from 'react-router-dom';
import { Event } from 'types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

const statusConfig = {
  DRAFT: { label: 'Brouillon', class: 'badge-warning' },
  PUBLISHED: { label: 'Publié', class: 'badge-success' },
  CANCELLED: { label: 'Annulé', class: 'badge-danger' },
  COMPLETED: { label: 'Terminé', class: 'badge-info' },
};

export default function EventCard({ event }: EventCardProps) {
  const status = statusConfig[event.status];

  return (
    <Link to={`/events/${event.id}`} className="card-hover p-6 block group animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <span className={status.class}>{status.label}</span>
        {event.category && (
          <span className="text-xs font-medium text-surface-400 bg-surface-100 px-2.5 py-1 rounded-lg">{event.category}</span>
        )}
      </div>

      <h3 className="text-lg font-bold text-surface-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
        {event.title}
      </h3>

      <p className="text-surface-500 text-sm mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

      <div className="space-y-2 text-sm text-surface-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-surface-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{format(new Date(event.date), 'PPP', { locale: fr })}</span>
        </div>
        {event.city && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-surface-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{event.city}{event.country !== 'France' ? `, ${event.country}` : ''}</span>
          </div>
        )}
      </div>

      {event._count && (
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-surface-100">
          <span className="flex items-center text-xs text-surface-400">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {event._count.guests} invités
          </span>
          <span className="flex items-center text-xs text-surface-400">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {event._count.contributions} contributions
          </span>
        </div>
      )}
    </Link>
  );
}
