import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, actionLink, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mb-6 inline-flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50 p-5 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-500 max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn-primary">{actionLabel}</Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  );
}
