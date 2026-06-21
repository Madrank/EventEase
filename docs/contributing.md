# Guide de contribution

## Prérequis
- Node.js 18+
- npm 8+
- PostgreSQL 15+
- Redis 7+ (optionnel)

## Configuration locale

```bash
# Cloner le projet
git clone https://github.com/username/eventease.git
cd eventease

# Installer les dépendances
npm install

# Configurer l'environnement
cp server/.env.example server/.env
cp client/.env.example client/.env

# Démarrer les services (avec Docker)
docker-compose up -d postgres redis

# Initialiser la base de données
npm run db:migrate
npm run db:seed

# Démarrer le développement
npm run dev
```

## Conventions de code

### TypeScript
- Utiliser des types stricts
- Pas de `any` (sauf cas exceptionnels)
- Interfaces préfixées par `I` (optionnel)

### Commits
Suivre Conventional Commits :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `refactor:` refactoring
- `test:` tests
- `chore:` maintenance

### Tests
- Écrire des tests pour chaque nouvelle fonctionnalité
- Tests unitaires avec Jest
- Tests API avec Supertest
- Tests E2E avec Cypress

## Processus de review
1. Créer une branche depuis `develop`
2. Développer la fonctionnalité
3. Écrire les tests
4. Lancer `npm run lint` et `npm test`
5. Créer une Pull Request vers `develop`
6. Attendre la validation CI
