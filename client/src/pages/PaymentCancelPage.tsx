import { Link } from 'react-router-dom';
import SEO from 'components/SEO';

export default function PaymentCancelPage() {
  return (
    <>
      <SEO title="Paiement annulé" description="Le paiement a été annulé." url="/payment/cancel" />
      <div className="page-container max-w-lg">
        <div className="card p-10 text-center animate-fade-in mt-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement annulé</h1>
          <p className="text-gray-500 mb-8">Le paiement a été annulé. Aucun montant n'a été débité.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="btn-primary">Tableau de bord</Link>
            <Link to="/events" className="btn-secondary">Voir les événements</Link>
          </div>
        </div>
      </div>
    </>
  );
}
