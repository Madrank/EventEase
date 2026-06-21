import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from 'components/SEO';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const mock = searchParams.get('mock');
    if (sessionId || mock) {
      setPaid(true);
    }
  }, [searchParams]);

  return (
    <>
      <SEO title="Paiement réussi" description="Votre paiement a été effectué avec succès." url="/payment/success" />
      <div className="page-container max-w-lg">
        <div className="card p-10 text-center animate-fade-in mt-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
          <p className="text-gray-500 mb-8">
            {paid
              ? 'Merci pour votre contribution. Vous recevrez un email de confirmation.'
              : 'Vérification du paiement en cours...'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="btn-primary">Tableau de bord</Link>
            <Link to="/events" className="btn-secondary">Voir les événements</Link>
          </div>
        </div>
      </div>
    </>
  );
}
