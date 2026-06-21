# EventEase - Organisateur d'événements

Application web complète pour l'organisation d'événements avec gestion des invités, réservation de prestataires et collecte de fonds.

## 🚀 Démarrage rapide

**Windows (double-clic) :** `start-app.bat`  
**PowerShell :** `.\start-app.ps1`  
**Linux/Mac :** `./start-app.sh`

Ou manuellement :
```bash
npm install
docker-compose up -d
npm run db:migrate && npm run db:seed
npm run dev
```

## 📖 Documentation

- [Documentation API](./docs/api.md)
- [Architecture technique](./docs/architecture.md)
- [Guide de contribution](./docs/contributing.md)
- [Guide de déploiement](./docs/deployment.md)

## 🧪 Identifiants de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@eventease.com | password123 |
| Organisateur | organizer@eventease.com | password123 |
| Utilisateur | user@eventease.com | password123 |

## 🛠️ Stack

**Frontend :** React 18, TypeScript, Tailwind CSS, Redux Toolkit  
**Backend :** Node.js, Express, Prisma, PostgreSQL, Redis  
**DevOps :** Docker, GitHub Actions
