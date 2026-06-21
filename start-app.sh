#!/bin/bash

echo "===================================="
echo "   EventEase - Installation"
echo "===================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "[ERREUR] Node.js n'est pas installé. Veuillez installer Node.js 18+."
    echo "Téléchargement : https://nodejs.org/"
    read -p "Appuyez sur Entrée pour quitter"
    exit 1
fi
echo "[OK] Node.js trouvé : $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "[ERREUR] npm n'est pas trouvé."
    read -p "Appuyez sur Entrée pour quitter"
    exit 1
fi
echo "[OK] npm trouvé : $(npm --version)"

# Vérifier Docker (optionnel)
if command -v docker &> /dev/null; then
    echo "[OK] Docker trouvé"
    echo "Démarrage des services Docker..."
    docker-compose up -d postgres redis
else
    echo "[INFO] Docker non trouvé. Assurez-vous d'avoir PostgreSQL et Redis en local."
fi

echo ""
echo "Installation des dépendances..."
npm install

echo ""
echo "Configuration des fichiers d'environnement..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "[OK] server/.env créé"
fi
if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo "[OK] client/.env créé"
fi

echo ""
echo "Initialisation de la base de données..."
cd server
npx prisma migrate dev --name init
npx prisma db seed
cd ..

echo ""
echo "===================================="
echo "   Installation terminée !"
echo ""
echo "   Pour démarrer l'application :"
echo "   npm run dev"
echo ""
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:3001"
echo "   API Docs : http://localhost:3001/api-docs"
echo "===================================="
