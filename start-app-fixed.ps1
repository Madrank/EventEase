# Script de démarrage EventEase - Version corrigée
Write-Host "🚀 Démarrage d'EventEase..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Vérifier Docker
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker est disponible" -ForegroundColor Green
    Write-Host "🐳 Démarrage de Redis..." -ForegroundColor Blue
    docker-compose up -d
    Write-Host "✅ Redis démarré avec succès" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker n'est pas disponible - Redis ne sera pas démarré" -ForegroundColor Yellow
}

# Vérifier les dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances racine..." -ForegroundColor Blue
    npm install
}

if (!(Test-Path "server/node_modules")) {
    Write-Host "📥 Installation des dépendances serveur..." -ForegroundColor Blue
    Push-Location server
    npm install
    Pop-Location
}

if (!(Test-Path "client/node_modules")) {
    Write-Host "📥 Installation des dépendances client..." -ForegroundColor Blue
    Push-Location client
    npm install
    Pop-Location
}

# Configuration Prisma
Write-Host "🔧 Configuration de la base de données..." -ForegroundColor Blue
Push-Location server
try {
    npx prisma generate | Out-Null
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de la génération du client Prisma (peut être ignorée)" -ForegroundColor Yellow
}
Pop-Location

# Démarrer l'application
Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Green
Write-Host "   - Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - API Docs: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host "   - Health Check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter l'application" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

# Démarrer l'application
npm run dev
