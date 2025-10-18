/**
 * Script de données de test pour EventEase
 * Ajoute des prestataires et lieux d'exemple
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log("🌱 Début du seeding...");

    // Créer des prestataires de test
    const providers = await Promise.all([
      prisma.provider.create({
        data: {
          name: "Traiteur Deluxe",
          description:
            "Service de traiteur haut de gamme pour tous vos événements. Spécialisé dans la cuisine française et internationale.",
          category: "CATERING",
          email: "contact@traiteur-deluxe.com",
          phone: "01 23 45 67 89",
          website: "https://traiteur-deluxe.com",
          address: "456 Avenue des Champs-Élysées",
          city: "Paris",
          postalCode: "75008",
          country: "France",
          priceRange: "100-500€",
          images: "traiteur1.jpg,traiteur2.jpg",
          rating: 4.8,
          reviewCount: 25,
        },
      }),
      prisma.provider.create({
        data: {
          name: "Photo Studio Pro",
          description:
            "Photographe professionnel spécialisé dans les événements. Capturons vos moments précieux avec style et créativité.",
          category: "PHOTOGRAPHY",
          email: "info@photostudiopro.fr",
          phone: "01 98 76 54 32",
          website: "https://photostudiopro.fr",
          address: "789 Rue de Rivoli",
          city: "Paris",
          postalCode: "75001",
          country: "France",
          priceRange: "200-800€",
          images: "photo1.jpg,photo2.jpg",
          rating: 4.9,
          reviewCount: 18,
        },
      }),
      prisma.provider.create({
        data: {
          name: "DJ Music Events",
          description:
            "DJ professionnel avec plus de 10 ans d'expérience. Ambiance garantie pour vos soirées et événements.",
          category: "MUSIC",
          email: "dj@musicevents.com",
          phone: "06 12 34 56 78",
          website: "https://musicevents.com",
          address: "321 Boulevard Saint-Germain",
          city: "Paris",
          postalCode: "75005",
          country: "France",
          priceRange: "150-400€",
          images: "dj1.jpg,dj2.jpg",
          rating: 4.7,
          reviewCount: 32,
        },
      }),
      prisma.provider.create({
        data: {
          name: "Déco Élégance",
          description:
            "Service de décoration florale et d'événements. Transformons vos espaces en lieux magiques et mémorables.",
          category: "DECORATION",
          email: "contact@deco-elegance.fr",
          phone: "01 55 66 77 88",
          website: "https://deco-elegance.fr",
          address: "654 Rue de la Paix",
          city: "Paris",
          postalCode: "75002",
          country: "France",
          priceRange: "80-300€",
          images: "deco1.jpg,deco2.jpg",
          rating: 4.6,
          reviewCount: 21,
        },
      }),
    ]);

    console.log(`✅ ${providers.length} prestataires créés`);

    // Créer des lieux de test
    const venues = await Promise.all([
      prisma.venue.create({
        data: {
          name: "Salle des Fêtes Municipale",
          description:
            "Grande salle polyvalente de 200m² idéale pour les événements privés et professionnels. Équipée d'une scène et d'un système son.",
          address: "123 Place de la République",
          city: "Paris",
          postalCode: "75011",
          country: "France",
          capacity: 150,
          pricePerDay: 300.0,
          amenities: "parking,wifi,kitchen,stage,sound_system",
          images: "salle1.jpg,salle2.jpg",
          latitude: 48.8566,
          longitude: 2.3522,
          rating: 4.5,
          reviewCount: 12,
        },
      }),
      prisma.venue.create({
        data: {
          name: "Château de Versailles - Salle des Fêtes",
          description:
            "Prestigieuse salle de réception dans un cadre historique exceptionnel. Parfait pour les événements d'entreprise et mariages.",
          address: "Place d'Armes",
          city: "Versailles",
          postalCode: "78000",
          country: "France",
          capacity: 300,
          pricePerDay: 1500.0,
          amenities:
            "parking,wifi,kitchen,stage,sound_system,projector,security",
          images: "chateau1.jpg,chateau2.jpg",
          latitude: 48.8049,
          longitude: 2.1204,
          rating: 4.9,
          reviewCount: 8,
        },
      }),
      prisma.venue.create({
        data: {
          name: "Espace Moderne - Business Center",
          description:
            "Salle de conférence moderne et équipée pour les événements professionnels. Technologie de pointe et service haut de gamme.",
          address: "456 Avenue des Ternes",
          city: "Paris",
          postalCode: "75017",
          country: "France",
          capacity: 80,
          pricePerDay: 450.0,
          amenities:
            "wifi,air_conditioning,projector,sound_system,disabled_access",
          images: "business1.jpg,business2.jpg",
          latitude: 48.8841,
          longitude: 2.3201,
          rating: 4.7,
          reviewCount: 15,
        },
      }),
      prisma.venue.create({
        data: {
          name: "Jardin Secret - Espace Vert",
          description:
            "Magnifique jardin privé de 1000m² avec terrasse couverte. Idéal pour les événements en plein air et les réceptions estivales.",
          address: "789 Rue de la Roquette",
          city: "Paris",
          postalCode: "75011",
          country: "France",
          capacity: 120,
          pricePerDay: 200.0,
          amenities: "outdoor_space,kitchen,bar,parking",
          images: "jardin1.jpg,jardin2.jpg",
          latitude: 48.8592,
          longitude: 2.3742,
          rating: 4.4,
          reviewCount: 9,
        },
      }),
    ]);

    console.log(`✅ ${venues.length} lieux créés`);

    // Les avis nécessitent un événement, on les ajoutera plus tard
    console.log(`ℹ️  Avis non créés (nécessitent un événement)`);

    console.log("🎉 Seeding terminé avec succès !");
    console.log("\n📊 Résumé :");
    console.log(`- ${providers.length} prestataires`);
    console.log(`- ${venues.length} lieux`);
    console.log(`- 0 avis (nécessitent des événements)`);
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seeding
seedData();
