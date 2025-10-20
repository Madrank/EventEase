#!/bin/bash
# Script de démarrage EventEase - Une seule commande pour tout démarrer
# Conforme référentiel DWWM 2023

echo "🚀 Démarrage d'EventEase..."
echo "================================"

# Vérifier si Docker Desktop est en cours d'exécution
echo "📋 Vérification des prérequis..."

# Vérifier Docker
if docker ps >/dev/null 2>&1; then
    echo "✅ Docker est disponible"
    echo "🐳 Démarrage de Redis..."
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo "✅ Redis démarré avec succès"
    else
        echo "❌ Erreur lors du démarrage de Redis"
    fi
else
    echo "⚠️  Docker n'est pas disponible - Redis ne sera pas démarré"
fi

# Vérifier que les dépendances sont installées
echo "📦 Vérification des dépendances..."

if [ ! -d "node_modules" ]; then
    echo "📥 Installation des dépendances racine..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📥 Installation des dépendances serveur..."
    cd server
    npm install
    cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📥 Installation des dépendances client..."
    cd client
    npm install
    cd ..
fi

# Générer le client Prisma
echo "🔧 Configuration de la base de données..."
cd server
npx prisma generate >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Client Prisma généré"
else
    echo "⚠️  Erreur lors de la génération du client Prisma (peut être ignorée)"
fi
cd ..

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo "   - API Docs: http://localhost:3001/api"
echo "   - Health Check: http://localhost:3001/health"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter l'application"
echo "================================"

# Démarrer l'application avec concurrently
npm run dev
