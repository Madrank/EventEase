# Documentation API EventEase

## Authentification

### POST /api/auth/register
Créer un compte utilisateur.

**Body:**
```json
{
  "email": "user@email.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33612345678"
}
```

**Réponse (201):**
```json
{
  "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "..." },
  "token": "jwt-token"
}
```

### POST /api/auth/login
Connecter un utilisateur.

**Body:**
```json
{
  "email": "user@email.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "user": { "id": "...", "email": "..." },
  "token": "jwt-token"
}
```

### GET /api/auth/profile
Obtenir le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

---

## Événements

### GET /api/events
Liste paginée des événements.

**Query params:** `page`, `limit`, `search`, `category`, `city`, `status`

### GET /api/events/:id
Détail d'un événement avec invités, contributions et prestataires.

### POST /api/events
Créer un événement. (Authentifié)

### PUT /api/events/:id
Modifier un événement. (Propriétaire ou Admin)

### DELETE /api/events/:id
Supprimer un événement. (Propriétaire ou Admin)

### GET /api/events/my-events
Liste des événements de l'utilisateur connecté.

---

## Invités

### GET /api/events/:eventId/guests
Liste des invités d'un événement.

### POST /api/events/:eventId/guests
Ajouter un invité. `{ "email": "...", "firstName": "...", "lastName": "..." }`

### POST /api/events/:eventId/guests/bulk
Ajout multiple. `{ "guests": [{ "email": "...", "firstName": "..." }] }`

### PUT /api/events/guests/:id/status
Mettre à jour le statut RSVP. `{ "status": "ACCEPTED" }`

---

## Prestataires

### GET /api/providers
Liste paginée des prestataires.

**Query params:** `category`, `city`, `search`

### GET /api/providers/:id
Détail d'un prestataire.

### POST /api/providers/:eventId/:providerId/book
Réserver un prestataire pour un événement.

---

## Hébergements

### GET /api/accommodations
Liste paginée des hébergements.

**Query params:** `city`, `capacity`, `minPrice`, `maxPrice`, `type`

---

## Contributions

### GET /api/events/:eventId/contributions
Liste des contributions avec le total.

### POST /api/events/:eventId/contributions
Ajouter une contribution. `{ "amount": 50, "message": "Félicitations !" }`

---

## Notifications

### GET /api/notifications
Liste des notifications de l'utilisateur connecté.

### PUT /api/notifications/:id/read
Marquer une notification comme lue.

### PUT /api/notifications/read-all
Marquer toutes les notifications comme lues.
