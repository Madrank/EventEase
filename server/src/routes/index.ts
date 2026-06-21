import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import guestRoutes from './guest.routes';
import providerRoutes from './provider.routes';
import accommodationRoutes from './accommodation.routes';
import contributionRoutes from './contribution.routes';
import notificationRoutes from './notification.routes';
import paymentRoutes from './payment.routes';
import uploadRoutes from './upload.routes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middlewares/auth';
import { prisma } from '../config/database';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events/:eventId/guests', guestRoutes);
router.use('/events/:eventId/contributions', contributionRoutes);
router.use('/providers', providerRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);

router.get('/my-bookings', authenticate, async (req: any, res, next) => {
  try {
    const [accommodationBookings, providerBookings] = await Promise.all([
      prisma.accommodationBooking.findMany({
        where: { userId: req.userId },
        include: { accommodation: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany({
        where: { userId: req.userId },
        include: { provider: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    res.json({ accommodationBookings, providerBookings });
  } catch (error) {
    next(error);
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/debug-auth', async (_req, res) => {
  try {
    const { authService } = require('../services/auth.service');
    const result = await authService.login('admin@eventease.com', 'password123');
    res.json({ success: true, result: { ...result, token: result.token?.slice(0, 20) + '...' } });
  } catch (e: any) {
    res.status(500).json({ error: e.message, stack: e.stack, name: e.name, constructor: e.constructor?.name });
  }
});

router.post('/debug-login', async (req, res) => {
  try {
    const { authService } = require('../services/auth.service');
    const { email, password } = req.body;
    res.json({ body: req.body, email, password, bodyType: typeof req.body });
  } catch (e: any) {
    res.status(500).json({ error: e.message, stack: e.stack, name: e.name, msg: 'Error in debug-login' });
  }
});

router.post('/seed', async (_req, res, next) => {
  try {
    await prisma.notification.deleteMany();
    await prisma.accommodationBooking.deleteMany();
    await prisma.contribution.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.accommodation.deleteMany();
    await prisma.provider.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('password123', 12);

    const admin = await prisma.user.create({
      data: { email: 'admin@eventease.com', password, firstName: 'Admin', lastName: 'EventEase', role: 'ADMIN', phone: '+33123456789' },
    });
    const organizer = await prisma.user.create({
      data: { email: 'organizer@eventease.com', password, firstName: 'Jean', lastName: 'Dupont', role: 'ORGANIZER', phone: '+33123456780' },
    });
    const user = await prisma.user.create({
      data: { email: 'user@eventease.com', password, firstName: 'Marie', lastName: 'Martin', role: 'USER', phone: '+33123456781' },
    });

    const event1 = await prisma.event.create({
      data: { title: 'Mariage de Sophie et Thomas', description: 'Un magnifique mariage champêtre dans le sud de la France.', category: 'Mariage', date: new Date('2025-06-15'), endDate: new Date('2025-06-16'), location: 'Château de la Loire', address: '15 Rue du Château', city: 'Tours', postalCode: '37000', country: 'France', capacity: 150, budget: 25000, status: 'PUBLISHED', organizerId: organizer.id },
    });
    const event2 = await prisma.event.create({
      data: { title: 'Conférence Tech 2025', description: 'Conférence annuelle sur les technologies web et mobiles.', category: 'Conférence', date: new Date('2025-09-20'), endDate: new Date('2025-09-21'), location: 'Palais des Congrès', address: '2 Place de la Porte Maillot', city: 'Paris', postalCode: '75017', country: 'France', capacity: 500, budget: 50000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', status: 'PUBLISHED', organizerId: admin.id },
    });
    await prisma.event.create({
      data: { title: 'Anniversaire des 30 ans de Julie', description: 'Soirée privée pour fêter les 30 ans de Julie.', category: 'Anniversaire', date: new Date('2025-03-10'), location: 'Le Baratin', address: '8 Rue de Lappe', city: 'Paris', postalCode: '75011', country: 'France', capacity: 40, budget: 3000, status: 'PUBLISHED', organizerId: organizer.id },
    });

    for (const g of [
      { eventId: event1.id, email: 'alice@email.com', firstName: 'Alice', lastName: 'Durand', status: 'ACCEPTED' as const },
      { eventId: event1.id, email: 'bob@email.com', firstName: 'Bob', lastName: 'Leroy', status: 'PENDING' as const },
      { eventId: event1.id, email: 'charlie@email.com', firstName: 'Charlie', lastName: 'Petit', status: 'DECLINED' as const },
      { eventId: event2.id, email: 'david@email.com', firstName: 'David', lastName: 'Moreau', status: 'ACCEPTED' as const },
      { eventId: event2.id, email: 'elise@email.com', firstName: 'Élise', lastName: 'Roux', status: 'MAYBE' as const },
    ]) await prisma.guest.create({ data: g });

    const providers = await Promise.all([
      prisma.provider.create({ data: { name: 'Traiteur Gastronome', category: 'Traiteur', description: 'Traiteur haut de gamme.', email: 'contact@traiteurgastronome.com', phone: '+33111111111', city: 'Paris', priceRange: '€€€', rating: 4.8, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80' } }),
      prisma.provider.create({ data: { name: 'Photographe Créatif', category: 'Photographe', description: 'Photographe professionnel.', email: 'bonjour@photographecreatif.com', phone: '+33122222222', city: 'Lyon', priceRange: '€€', rating: 4.6, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' } }),
      prisma.provider.create({ data: { name: 'Orchestre Symphonia', category: 'Musicien', description: 'Orchestre de musique classique.', email: 'contact@symphonia.com', phone: '+33133333333', city: 'Marseille', priceRange: '€€€', rating: 4.9, image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80' } }),
      prisma.provider.create({ data: { name: 'DJ ElectroMix', category: 'DJ', description: 'DJ professionnel pour animer vos soirées.', email: 'dj@electromix.com', phone: '+33144444444', city: 'Bordeaux', priceRange: '€€', rating: 4.5, image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80' } }),
      prisma.provider.create({ data: { name: 'Fleuriste Art floral', category: 'Décoration', description: 'Création florale pour tous vos événements.', email: 'contact@artfloral.com', phone: '+33155555555', city: 'Toulouse', priceRange: '€€', rating: 4.7, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80' } }),
    ]);

    await Promise.all([
      prisma.accommodation.create({ data: { name: 'Château de la Loire', type: 'Château', description: 'Magnifique château du XVIIIe siècle.', address: '15 Rue du Château', city: 'Tours', postalCode: '37000', capacity: 200, pricePerNight: 5000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', amenities: 'Parking, Piscine, Jardin, Salle de réception' } }),
      prisma.accommodation.create({ data: { name: 'Salle des Étoiles', type: 'Salle de réception', description: 'Grande salle modulable avec vue panoramique.', address: '10 Avenue de la Grande Armée', city: 'Paris', postalCode: '75017', capacity: 400, pricePerNight: 3000, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', amenities: 'Sonorisation, Scène, Cuisine, Climatisation' } }),
      prisma.accommodation.create({ data: { name: 'Villa Méditerranée', type: 'Villa', description: 'Villa contemporaine avec piscine à débordement.', address: '25 Chemin des Criques', city: 'Nice', postalCode: '06000', capacity: 80, pricePerNight: 2000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', amenities: 'Piscine, Terrasse, BBQ, Parking' } }),
    ]);

    const p = (cat: string) => providers.find(x => x.category === cat)!;
    await Promise.all([
      prisma.booking.create({ data: { providerId: p('Traiteur').id, eventId: event1.id, date: new Date('2025-06-15'), status: 'CONFIRMED', price: 8500, notes: 'Menu dégustation 5 services' } }),
      prisma.booking.create({ data: { providerId: p('Photographe').id, eventId: event1.id, date: new Date('2025-06-15'), status: 'CONFIRMED', price: 2500 } }),
      prisma.booking.create({ data: { providerId: p('DJ').id, eventId: event2.id, date: new Date('2025-09-20'), status: 'CONFIRMED', price: 1800 } }),
      prisma.booking.create({ data: { providerId: p('Musicien').id, eventId: event1.id, date: new Date('2025-06-15'), status: 'PENDING', price: 4500 } }),
      prisma.booking.create({ data: { providerId: p('Décoration').id, eventId: event2.id, date: new Date('2025-09-21'), status: 'CONFIRMED', price: 1200 } }),
    ]);

    const accoms = await prisma.accommodation.findMany();
    if (accoms.length > 0) {
      await prisma.accommodationBooking.create({ data: { accommodationId: accoms[0].id, userId: organizer.id, eventId: event1.id, checkIn: new Date('2025-06-14'), checkOut: new Date('2025-06-16'), guests: 50, status: 'CONFIRMED' } });
    }

    await prisma.contribution.create({ data: { eventId: event1.id, userId: user.id, amount: 150, message: 'Félicitations aux mariés !', status: 'COMPLETED' } });
    await prisma.contribution.create({ data: { eventId: event1.id, userId: admin.id, amount: 200, message: 'Pour le plus beau des mariages !', status: 'COMPLETED' } });

    await prisma.notification.create({ data: { userId: organizer.id, eventId: event1.id, title: 'Nouvel invité confirmé', message: 'Alice Durand a confirmé sa présence.', type: 'GUEST_RSVP' } });
    await prisma.notification.create({ data: { userId: organizer.id, eventId: event1.id, title: 'Paiement reçu', message: 'Une contribution de 150 € a été reçue.', type: 'CONTRIBUTION' } });

    res.json({ message: 'Seed completed', users: { admin: 'admin@eventease.com / password123', organizer: 'organizer@eventease.com / password123', user: 'user@eventease.com / password123' } });
  } catch (error) {
    next(error);
  }
});

export default router;
