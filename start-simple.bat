@echo off
echo 🚀 Démarrage d'EventEase...
echo ================================

echo 📦 Vérification des dépendances...
if not exist "node_modules" (
    echo Installation des dépendances racine...
    npm install
)

if not exist "server\node_modules" (
    echo Installation des dépendances serveur...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Installation des dépendances client...
    cd client
    npm install
    cd ..
)

echo 🐳 Démarrage de Redis...
docker-compose up -d

echo 🚀 Démarrage de l'application...
echo    - Backend: http://localhost:3001
echo    - Frontend: http://localhost:3000
echo    - API Docs: http://localhost:3001/api
echo    - Health Check: http://localhost:3001/health
echo.
echo Appuyez sur Ctrl+C pour arrêter l'application
echo ================================

npm run dev
