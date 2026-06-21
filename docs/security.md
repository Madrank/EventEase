# Politique de sécurité

## Authentification
- JWT avec expiration (7 jours par défaut)
- Mots de passe hachés avec bcrypt (12 rounds)
- Rate limiting sur les routes d'authentification

## Protection des données
- Validation stricte des entrées (Joi)
- Headers de sécurité (Helmet)
- Protection CSRF via tokens JWT
- Chiffrement des données sensibles

## Conformité RGPD
- Consentement explicite pour les emails
- Droit à l'oubli (suppression des comptes)
- Portabilité des données
- Journalisation des accès
- Stockage sécurisé des données

## Bonnes pratiques
- ✅ Variables d'environnement pour les secrets
- ✅ Validation des entrées côté serveur
- ✅ Requêtes paramétrées (Prisma)
- ✅ Headers CORS configurés
- ✅ Rate limiting sur l'API
- ✅ Aucun secret dans le code source

## Signaler une vulnérabilité
Email : security@eventease.com
