# Script de démarrage EventEase - Une seule commande pour tout démarrer
# Conforme référentiel DWWM 2023

Write-Host "🚀 Démarrage d'EventEase..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Vérifier si Docker Desktop est en cours d'exécution
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Docker
try {
    $dockerStatus = docker ps 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker est disponible" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Docker n'est pas disponible - Redis ne sera pas démarré" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Docker n'est pas disponible - Redis ne sera pas démarré" -ForegroundColor Yellow
}

# Démarrer Redis si Docker est disponible
if ($dockerStatus) {
    Write-Host "🐳 Démarrage de Redis..." -ForegroundColor Blue
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis démarré avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du démarrage de Redis" -ForegroundColor Red
    }
}

# Vérifier que les dépendances sont installées
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances racine..." -ForegroundColor Blue
    npm install
}

if (!(Test-Path "server/node_modules")) {
    Write-Host "📥 Installation des dépendances serveur..." -ForegroundColor Blue
    Set-Location server
    npm install
    Set-Location ..
}

if (!(Test-Path "client/node_modules")) {
    Write-Host "📥 Installation des dépendances client..." -ForegroundColor Blue
    Set-Location client
    npm install
    Set-Location ..
}

# Générer le client Prisma
Write-Host "🔧 Configuration de la base de données..." -ForegroundColor Blue
Set-Location server
try {
    npx prisma generate
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de la génération du client Prisma (peut être ignorée)" -ForegroundColor Yellow
}
Set-Location ..

# Démarrer l'application
Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Green
Write-Host "   - Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - API Docs: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host "   - Health Check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter l'application" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

# Démarrer l'application avec concurrently
npm run dev
