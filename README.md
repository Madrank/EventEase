# EventEase - Organisateur d'événements

## 📋 Description

EventEase est une application web complète pour l'organisation d'événements, développée selon le référentiel DWWM 2023. L'application permet de créer, gérer et partager des événements avec un système de gestion des invités, de réservation de prestataires et de collecte de fonds.

## 🎯 Fonctionnalités principales

- **Gestion des événements** : Création, modification, suppression d'événements
- **Gestion des invités** : Invitations par email/SMS, suivi des RSVP
- **Prestataires** : Recherche et réservation de traiteurs, photographes, musiciens
- **Hébergements** : Recherche de lieux par capacité et budget
- **Cagnotte collaborative** : Collecte de contributions financières
- **Application mobile** : Interface responsive pour tous les appareils
- **Sécurité RGPD** : Conformité aux réglementations européennes

## 🏗️ Architecture technique

### Frontend
- **Framework** : React 18 + TypeScript
- **Styling** : Tailwind CSS + Headless UI
- **État** : Redux Toolkit + RTK Query
- **Validation** : React Hook Form + Zod
- **Tests** : Jest + React Testing Library + Cypress

### Backend
- **Runtime** : Node.js + Express
- **Base de données** : PostgreSQL + Prisma ORM
- **Cache** : Redis
- **Authentification** : JWT + bcrypt
- **Validation** : Joi
- **Tests** : Jest + Supertest

### DevOps
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Déploiement** : Vercel (frontend) + Railway (backend)
- **Monitoring** : Sentry

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- npm 8+
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/eventease.git
cd eventease
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
# Copier les fichiers d'environnement
cp server/.env.example server/.env
cp client/.env.example client/.env

# Configurer les variables d'environnement
# Voir la section Configuration ci-dessous
```

4. **Démarrer la base de données**
```bash
# Avec Docker Compose
docker-compose up -d postgres redis

# Ou installer PostgreSQL et Redis localement
```

5. **Initialiser la base de données**
```bash
cd server
npm run db:migrate
npm run db:seed
```

6. **Démarrer l'application**
```bash
# Développement (frontend + backend)
npm run dev

# Ou séparément
npm run server  # Backend sur http://localhost:3001
npm run client  # Frontend sur http://localhost:3000
```

## 🔧 Configuration

### Variables d'environnement

#### Backend (server/.env)
```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/eventease"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="votre-secret-jwt-tres-securise"
JWT_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Sécurité
BCRYPT_ROUNDS=12
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (client/.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 📚 Documentation

- [Documentation API](./docs/api.md)
- [Guide de contribution](./docs/contributing.md)
- [Architecture technique](./docs/architecture.md)
- [Guide de déploiement](./docs/deployment.md)
- [Politique de sécurité](./docs/security.md)

## 🔒 Sécurité

- Authentification JWT sécurisée
- Hachage des mots de passe avec bcrypt
- Protection CSRF et XSS
- Validation stricte des entrées
- Conformité RGPD
- Chiffrement des données sensibles

## ♿ Accessibilité

- Conformité WCAG 2.1 AA
- Navigation au clavier
- Support des lecteurs d'écran
- Contraste de couleurs optimisé
- Textes alternatifs complets

## 🚀 Déploiement

### Production
```bash
# Build de production
npm run build

# Démarrage en production
npm start
```

### Docker
```bash
# Build des images
docker-compose build

# Démarrage des services
docker-compose up -d
```

## 📊 Monitoring

- **Logs** : Winston + Morgan
- **Métriques** : Prometheus + Grafana
- **Erreurs** : Sentry
- **Performance** : Lighthouse CI

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les détails sur la contribution.

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur Full-Stack** : JBxDev
- **Designer UX/UI** : JBxDev
- **DevOps** : JBxDev

## 📞 Support

- **Email** : support@eventease.com
- **Documentation** : https://docs.eventease.com
- **Issues** : https://github.com/Madrank/eventease/issues

---

**Conformité référentiel DWWM 2023** ✅
- Frontend dynamique sécurisé
- Backend avec base de données relationnelle
- Tests complets et documentation
- Accessibilité et RGPD
- Déploiement automatisé


