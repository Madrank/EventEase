# Guide de déploiement

## Prérequis
- Docker & Docker Compose
- Domaine configuré (optionnel)

## Déploiement avec Docker

```bash
# Build et démarrage
docker-compose build
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

## Déploiement manuel

### Backend (Railway / VPS)

```bash
cd server
npm ci
npm run build
cp .env.production .env
npm start
```

### Frontend (Vercel / Netlify)

```bash
cd client
npm ci
npm run build
# Déployer le dossier client/build
```

## Variables d'environnement (Production)

### Backend
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/eventease
JWT_SECRET=<secret-tres-securise>
CORS_ORIGIN=https://mon-domaine.com
```

### Frontend
```env
REACT_APP_API_URL=https://api.mon-domaine.com/api
```

## Monitoring
- **Sentry** : Erreurs et performances
- **Winston** : Logs applicatifs
- **Prometheus + Grafana** : Métriques système
