import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from 'services/api';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import ImageUpload from 'components/ImageUpload';
import toast from 'react-hot-toast';

const categories = ['Traiteur', 'Photographe', 'Musicien', 'DJ', 'Décoration', 'Vidéaste', 'Fleuriste', 'Animation', 'Location de matériel', 'Transport', 'Sécurité', 'Autre'];

export default function RegisterProviderPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', description: '', email: '', phone: '', website: '', city: '', priceRange: '', image: '',
  });

  const update = (f: string, v: string) => setForm({ ...form, [f]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return toast.error('Nom et catégorie requis');
    setSending(true);
    try {
      await api.post('/providers/register', form);
      toast.success('Votre inscription a bien été envoyée !');
      navigate('/providers');
    } catch {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO title="Devenir prestataire" description="Inscrivez-vous comme prestataire sur EventEase" url="/register-provider" />
      <div className="page-container max-w-2xl">
        <Breadcrumbs items={[
          { label: 'Prestataires', href: '/providers' },
          { label: 'Devenir prestataire' },
        ]} />

        <h1 className="section-title mb-8">Devenir prestataire</h1>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'entreprise *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="Ex: Traiteur Gastronome" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field" required>
                <option value="">Sélectionner</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="Paris" />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field" rows={4} placeholder="Présentez votre activité..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="contact@exemple.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="+33123456789" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Site web</label>
              <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} className="input-field" placeholder="https://" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fourchette de prix</label>
              <select value={form.priceRange} onChange={(e) => update('priceRange', e.target.value)} className="input-field">
                <option value="">Non spécifié</option>
                <option value="€">€ (économique)</option>
                <option value="€€">€€ (modéré)</option>
                <option value="€€€">€€€ (haut de gamme)</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <ImageUpload currentImage={form.image} onUpload={(url) => update('image', url)} label="Photo (optionnel)" />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
            <button type="submit" disabled={sending} className="btn-primary px-8 py-3">
              {sending ? 'Envoi en cours...' : 'S\'inscrire comme prestataire'}
            </button>
            <Link to="/providers" className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </>
  );
}
