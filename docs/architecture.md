# Architecture technique

## Stack technique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le style
- **Redux Toolkit** pour la gestion d'état
- **React Router v6** pour le routage
- **Headless UI** pour les composants accessibles
- **React Hook Form** pour la validation

### Backend
- **Node.js** + **Express** (TypeScript)
- **Prisma ORM** pour PostgreSQL
- **Redis** pour le cache
- **JWT** pour l'authentification
- **Joi** pour la validation
- **Winston** pour les logs

### Base de données
- **PostgreSQL 15** (relationnelle)
- Schéma géré par Prisma Migrations
- Seed de développement inclus

## Structure du projet

```
eventease/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   ├── store/          # Redux store
│   │   ├── types/          # Types TypeScript
│   │   └── hooks/          # Hooks personnalisés
│   └── package.json
├── server/                 # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma   # Modèle de données
│   │   └── seed.ts         # Données de test
│   └── src/
│       ├── config/         # Configuration
│       ├── controllers/    # Contrôleurs API
│       ├── middlewares/    # Middlewares (auth, validation)
│       ├── routes/         # Routes API
│       ├── services/       # Services métier
│       └── validations/    # Schémas de validation
├── docker-compose.yml
└── package.json            # Monorepo root
```

## Flux de données

1. L'utilisateur interagit avec l'interface React
2. Les appels API sont effectués via Axios avec intercepteurs JWT
3. Le serveur Express valide et traite la requête
4. Prisma interagit avec PostgreSQL
5. Les réponses sont renvoyées au client
6. Redux met à jour l'état de l'application

## Sécurité

- Authentification JWT (stocké en localStorage)
- Mots de passe hachés avec bcrypt (12 rounds)
- Rate limiting (100 requêtes/15 min par IP)
- Headers de sécurité avec Helmet
- Validation stricte des entrées avec Joi
- Protection CORS configurée
