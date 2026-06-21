import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from 'services/api';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import ImageUpload from 'components/ImageUpload';
import toast from 'react-hot-toast';

const types = ['Château', 'Salle de réception', 'Villa', 'Appartement', 'Maison d\'hôte', 'Hôtel', 'Gîte', 'Camping', 'Autre'];

export default function RegisterAccommodationPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '', type: '', description: '', address: '', city: '', postalCode: '',
    country: 'France', capacity: '', pricePerNight: '', image: '', amenities: '',
  });

  const update = (f: string, v: string) => setForm({ ...form, [f]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.capacity) return toast.error('Nom, type et capacité requis');
    setSending(true);
    try {
      await api.post('/accommodations/register', {
        ...form,
        capacity: parseInt(form.capacity),
        pricePerNight: form.pricePerNight ? parseFloat(form.pricePerNight) : undefined,
      });
      toast.success('Votre hébergement a bien été ajouté !');
      navigate('/accommodations');
    } catch {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO title="Proposer un hébergement" description="Ajoutez votre hébergement sur EventEase" url="/register-accommodation" />
      <div className="page-container max-w-2xl">
        <Breadcrumbs items={[
          { label: 'Hébergements', href: '/accommodations' },
          { label: 'Proposer un hébergement' },
        ]} />

        <h1 className="section-title mb-8">Proposer un hébergement</h1>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'établissement *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Ex: Château de la Loire" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
              <select value={form.type} onChange={(e) => update('type', e.target.value)} className="input-field" required>
                <option value="">Sélectionner</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacité (personnes) *</label>
              <input type="number" value={form.capacity} onChange={(e) => update('capacity', e.target.value)} className="input-field" min="1" placeholder="150" required />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field" rows={4} placeholder="Décrivez votre établissement..." />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" placeholder="15 Rue du Château" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="Tours" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Code postal</label>
              <input type="text" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} className="input-field" placeholder="37000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays</label>
              <input type="text" value={form.country} onChange={(e) => update('country', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix par nuit (€)</label>
              <input type="number" value={form.pricePerNight} onChange={(e) => update('pricePerNight', e.target.value)} className="input-field" min="0" step="0.01" placeholder="2000" />
            </div>

            <div className="lg:col-span-2">
              <ImageUpload currentImage={form.image} onUpload={(url) => update('image', url)} label="Photo (optionnel)" />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Équipements (séparés par des virgules)</label>
              <input type="text" value={form.amenities} onChange={(e) => update('amenities', e.target.value)} className="input-field" placeholder="Parking, Piscine, Jardin, Wi-Fi" />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
            <button type="submit" disabled={sending} className="btn-primary px-8 py-3">
              {sending ? 'Envoi en cours...' : 'Ajouter l\'hébergement'}
            </button>
            <Link to="/accommodations" className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </>
  );
}
