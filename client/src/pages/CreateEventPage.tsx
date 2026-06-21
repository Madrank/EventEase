import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { createEvent, updateEvent, fetchEvent, clearCurrentEvent } from 'store/eventSlice';
import SEO from 'components/SEO';
import Breadcrumbs from 'components/Breadcrumbs';
import ImageUpload from 'components/ImageUpload';
import toast from 'react-hot-toast';

const categories = ['Mariage', 'Conférence', 'Anniversaire', 'Soirée', 'Concert', 'Sport', 'Autre'];

export default function CreateEventPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentEvent, loading } = useSelector((state: RootState) => state.events);

  const [form, setForm] = useState({
    title: '', description: '', category: '', date: '', endDate: '',
    location: '', address: '', city: '', postalCode: '', country: 'France',
    capacity: '', budget: '', image: '', status: 'DRAFT',
  });

  useEffect(() => {
    if (isEdit && id) dispatch(fetchEvent(id));
    return () => { dispatch(clearCurrentEvent()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentEvent) {
      setForm({
        title: currentEvent.title,
        description: currentEvent.description,
        category: currentEvent.category || '',
        date: currentEvent.date.slice(0, 16),
        endDate: currentEvent.endDate ? currentEvent.endDate.slice(0, 16) : '',
        location: currentEvent.location || '',
        address: currentEvent.address || '',
        city: currentEvent.city || '',
        postalCode: currentEvent.postalCode || '',
        country: currentEvent.country || 'France',
        capacity: currentEvent.capacity?.toString() || '',
        budget: currentEvent.budget?.toString() || '',
        image: currentEvent.image || '',
        status: currentEvent.status,
      });
    }
  }, [isEdit, currentEvent]);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: form.title,
        description: form.description,
        category: form.category || undefined,
        date: new Date(form.date).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        location: form.location || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country || undefined,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        image: form.image || undefined,
        status: form.status,
      };

      if (isEdit && id) {
        await dispatch(updateEvent({ id, data })).unwrap();
        toast.success('Événement modifié !');
        navigate(`/events/${id}`);
      } else {
        const result = await dispatch(createEvent(data)).unwrap();
        toast.success('Événement créé !');
        navigate(`/events/${result.id}`);
      }
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <>
      <SEO
        title={isEdit ? 'Modifier l\'événement' : 'Créer un événement'}
        description={isEdit ? 'Modifier votre événement sur EventEase' : 'Créez un nouvel événement sur EventEase'}
        url={isEdit && id ? `/events/${id}/edit` : '/events/new'}
      />
      <div className="page-container max-w-3xl">
        <Breadcrumbs items={[
          { label: 'Événements', href: '/events' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]} />

        <h1 className="section-title mb-8">{isEdit ? 'Modifier l\'événement' : 'Créer un événement'}</h1>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de l'événement *</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" placeholder="Ex: Mariage de Sophie et Thomas" required />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field" rows={5} placeholder="Décrivez votre événement en détail..." required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="input-field">
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de début *</label>
              <input type="datetime-local" value={form.date} onChange={(e) => update('date', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de fin</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lieu</label>
              <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="input-field" placeholder="Nom du lieu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Code postal</label>
              <input type="text" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacité (personnes)</label>
              <input type="number" value={form.capacity} onChange={(e) => update('capacity', e.target.value)} className="input-field" min="1" placeholder="150" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget (€)</label>
              <input type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} className="input-field" min="0" step="0.01" placeholder="25000" />
            </div>

            <div className="lg:col-span-2">
              <ImageUpload
                currentImage={form.image}
                onUpload={(url) => update('image', url)}
                label="Image de l'événement"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEdit ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M12 4v16m8-8H4"} /></svg>
                  {isEdit ? "Modifier l'événement" : "Créer l'événement"}
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Annuler</button>
          </div>
        </form>
      </div>
    </>
  );
}
