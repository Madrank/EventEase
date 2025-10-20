@echo off
REM Script de démarrage EventEase - Une seule commande pour tout démarrer
REM Conforme référentiel DWWM 2023

echo 🚀 Démarrage d'EventEase...
echo ================================

REM Vérifier si Docker Desktop est en cours d'exécution
echo 📋 Vérification des prérequis...

REM Vérifier Docker
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker est disponible
    echo 🐳 Démarrage de Redis...
    docker-compose up -d
    if %errorlevel% equ 0 (
        echo ✅ Redis démarré avec succès
    ) else (
        echo ❌ Erreur lors du démarrage de Redis
    )
) else (
    echo ⚠️  Docker n'est pas disponible - Redis ne sera pas démarré
)

REM Vérifier que les dépendances sont installées
echo 📦 Vérification des dépendances...

if not exist "node_modules" (
    echo 📥 Installation des dépendances racine...
    npm install
)

if not exist "server\node_modules" (
    echo 📥 Installation des dépendances serveur...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo 📥 Installation des dépendances client...
    cd client
    npm install
    cd ..
)

REM Générer le client Prisma
echo 🔧 Configuration de la base de données...
cd server
npx prisma generate >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Client Prisma généré
) else (
    echo ⚠️  Erreur lors de la génération du client Prisma (peut être ignorée)
)
cd ..

REM Démarrer l'application
echo 🚀 Démarrage de l'application...
echo    - Backend: http://localhost:3001
echo    - Frontend: http://localhost:3000
echo    - API Docs: http://localhost:3001/api
echo    - Health Check: http://localhost:3001/health
echo.
echo Appuyez sur Ctrl+C pour arrêter l'application
echo ================================

REM Démarrer l'application avec concurrently
npm run dev
