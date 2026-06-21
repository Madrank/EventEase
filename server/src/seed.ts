import { PrismaClient, GuestStatus, BookingStatus, EventStatus, ContributionStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  await prisma.notification.deleteMany();
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

  console.log('✅ Utilisateurs créés');

  const event1 = await prisma.event.create({
    data: { title: 'Mariage de Sophie et Thomas', description: 'Un magnifique mariage champêtre dans le sud de la France.', category: 'Mariage', date: new Date('2025-06-15'), endDate: new Date('2025-06-16'), location: 'Château de la Loire', address: '15 Rue du Château', city: 'Tours', postalCode: '37000', country: 'France', capacity: 150, budget: 25000, status: EventStatus.PUBLISHED, organizerId: organizer.id },
  });
  const event2 = await prisma.event.create({
    data: { title: 'Conférence Tech 2025', description: 'Conférence annuelle sur les technologies web et mobiles.', category: 'Conférence', date: new Date('2025-09-20'), endDate: new Date('2025-09-21'), location: 'Palais des Congrès', address: '2 Place de la Porte Maillot', city: 'Paris', postalCode: '75017', country: 'France', capacity: 500, budget: 50000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', status: EventStatus.PUBLISHED, organizerId: admin.id },
  });
  await prisma.event.create({
    data: { title: 'Anniversaire des 30 ans de Julie', description: 'Soirée privée pour fêter les 30 ans de Julie.', category: 'Anniversaire', date: new Date('2025-03-10'), location: 'Le Baratin', address: '8 Rue de Lappe', city: 'Paris', postalCode: '75011', country: 'France', capacity: 40, budget: 3000, status: EventStatus.PUBLISHED, organizerId: organizer.id },
  });

  console.log('✅ Événements créés');

  for (const g of [
    { eventId: event1.id, email: 'alice@email.com', firstName: 'Alice', lastName: 'Durand', status: GuestStatus.ACCEPTED },
    { eventId: event1.id, email: 'bob@email.com', firstName: 'Bob', lastName: 'Leroy', status: GuestStatus.PENDING },
    { eventId: event1.id, email: 'charlie@email.com', firstName: 'Charlie', lastName: 'Petit', status: GuestStatus.DECLINED },
    { eventId: event2.id, email: 'david@email.com', firstName: 'David', lastName: 'Moreau', status: GuestStatus.ACCEPTED },
    { eventId: event2.id, email: 'elise@email.com', firstName: 'Élise', lastName: 'Roux', status: GuestStatus.MAYBE },
  ]) await prisma.guest.create({ data: g });
  console.log('✅ Invités créés');

  const providers = await Promise.all([
    prisma.provider.create({ data: { name: 'Traiteur Gastronome', category: 'Traiteur', description: 'Traiteur haut de gamme.', email: 'contact@traiteurgastronome.com', phone: '+33111111111', city: 'Paris', priceRange: '€€€', rating: 4.8, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80' } }),
    prisma.provider.create({ data: { name: 'Photographe Créatif', category: 'Photographe', description: 'Photographe professionnel.', email: 'bonjour@photographecreatif.com', phone: '+33122222222', city: 'Lyon', priceRange: '€€', rating: 4.6, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' } }),
    prisma.provider.create({ data: { name: 'Orchestre Symphonia', category: 'Musicien', description: 'Orchestre de musique classique.', email: 'contact@symphonia.com', phone: '+33133333333', city: 'Marseille', priceRange: '€€€', rating: 4.9, image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80' } }),
    prisma.provider.create({ data: { name: 'DJ ElectroMix', category: 'DJ', description: 'DJ professionnel pour animer vos soirées.', email: 'dj@electromix.com', phone: '+33144444444', city: 'Bordeaux', priceRange: '€€', rating: 4.5, image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80' } }),
    prisma.provider.create({ data: { name: 'Fleuriste Art floral', category: 'Décoration', description: 'Création florale pour tous vos événements.', email: 'contact@artfloral.com', phone: '+33155555555', city: 'Toulouse', priceRange: '€€', rating: 4.7, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80' } }),
  ]);
  console.log('✅ Prestataires créés');

  await Promise.all([
    prisma.accommodation.create({ data: { name: 'Château de la Loire', type: 'Château', description: 'Magnifique château du XVIIIe siècle.', address: '15 Rue du Château', city: 'Tours', postalCode: '37000', capacity: 200, pricePerNight: 5000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', amenities: 'Parking, Piscine, Jardin, Salle de réception' } }),
    prisma.accommodation.create({ data: { name: 'Salle des Étoiles', type: 'Salle de réception', description: 'Grande salle modulable avec vue panoramique.', address: '10 Avenue de la Grande Armée', city: 'Paris', postalCode: '75017', capacity: 400, pricePerNight: 3000, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', amenities: 'Sonorisation, Scène, Cuisine, Climatisation' } }),
    prisma.accommodation.create({ data: { name: 'Villa Méditerranée', type: 'Villa', description: 'Villa contemporaine avec piscine à débordement.', address: '25 Chemin des Criques', city: 'Nice', postalCode: '06000', capacity: 80, pricePerNight: 2000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', amenities: 'Piscine, Terrasse, BBQ, Parking' } }),
  ]);
  console.log('✅ Hébergements créés');

  const p = (cat: string) => providers.find(x => x.category === cat)!;
  await Promise.all([
    prisma.booking.create({ data: { providerId: p('Traiteur').id, eventId: event1.id, date: new Date('2025-06-15'), status: BookingStatus.CONFIRMED, price: 8500, notes: 'Menu dégustation 5 services' } }),
    prisma.booking.create({ data: { providerId: p('Photographe').id, eventId: event1.id, date: new Date('2025-06-15'), status: BookingStatus.CONFIRMED, price: 2500 } }),
    prisma.booking.create({ data: { providerId: p('DJ').id, eventId: event2.id, date: new Date('2025-09-20'), status: BookingStatus.CONFIRMED, price: 1800 } }),
    prisma.booking.create({ data: { providerId: p('Musicien').id, eventId: event1.id, date: new Date('2025-06-15'), status: BookingStatus.PENDING, price: 4500 } }),
    prisma.booking.create({ data: { providerId: p('Décoration').id, eventId: event2.id, date: new Date('2025-09-21'), status: BookingStatus.CONFIRMED, price: 1200 } }),
  ]);
  console.log('✅ Réservations prestataires créées');

  const accoms = await prisma.accommodation.findMany();
  if (accoms.length > 0) {
    await prisma.accommodationBooking.create({ data: { accommodationId: accoms[0].id, userId: organizer.id, eventId: event1.id, checkIn: new Date('2025-06-14'), checkOut: new Date('2025-06-16'), guests: 50, status: BookingStatus.CONFIRMED } });
  }
  console.log('✅ Réservations hébergements créées');

  await prisma.contribution.create({ data: { eventId: event1.id, userId: user.id, amount: 150, message: 'Félicitations aux mariés !', status: ContributionStatus.COMPLETED } });
  await prisma.contribution.create({ data: { eventId: event1.id, userId: admin.id, amount: 200, message: 'Pour le plus beau des mariages !', status: ContributionStatus.COMPLETED } });
  console.log('✅ Contributions créées');

  await prisma.notification.create({ data: { userId: organizer.id, eventId: event1.id, title: 'Nouvel invité confirmé', message: 'Alice Durand a confirmé sa présence.', type: NotificationType.GUEST_RSVP } });
  await prisma.notification.create({ data: { userId: organizer.id, eventId: event1.id, title: 'Paiement reçu', message: 'Une contribution de 150 € a été reçue.', type: NotificationType.CONTRIBUTION } });
  console.log('✅ Notifications créées');

  console.log('🎉 Seeding terminé !');
  console.log('📋 Identifiants de test :');
  console.log('   Admin     : admin@eventease.com / password123');
  console.log('   Organizer : organizer@eventease.com / password123');
  console.log('   User      : user@eventease.com / password123');
}

main()
  .catch((e) => { console.error('❌ Erreur:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
