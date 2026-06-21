import { Routes, Route } from 'react-router-dom';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import ProtectedRoute from 'components/ProtectedRoute';
import SEO from 'components/SEO';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import EventsPage from 'pages/EventsPage';
import EventDetailPage from 'pages/EventDetailPage';
import CreateEventPage from 'pages/CreateEventPage';
import DashboardPage from 'pages/DashboardPage';
import ProvidersPage from 'pages/ProvidersPage';
import ProviderDetailPage from 'pages/ProviderDetailPage';
import RegisterProviderPage from 'pages/RegisterProviderPage';
import AccommodationsPage from 'pages/AccommodationsPage';
import AccommodationDetailPage from 'pages/AccommodationDetailPage';
import RegisterAccommodationPage from 'pages/RegisterAccommodationPage';
import PaymentSuccessPage from 'pages/PaymentSuccessPage';
import PaymentCancelPage from 'pages/PaymentCancelPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="EventEase"
        description="Solution professionnelle pour l'organisation d'événements."
        url="/"
      />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/new" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
          <Route path="/events/:id/edit" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/providers/register" element={<RegisterProviderPage />} />
          <Route path="/providers/:id" element={<ProviderDetailPage />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
          <Route path="/accommodations/register" element={<RegisterAccommodationPage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
