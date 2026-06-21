Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   EventEase - Installation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js trouvé : $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Node.js n'est pas installé. Veuillez installer Node.js 18+." -ForegroundColor Red
    Write-Host "Téléchargement : https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm trouvé : $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] npm n'est pas trouvé." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier Docker (optionnel)
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker Desktop trouvé : $dockerVersion" -ForegroundColor Green
    Write-Host "Démarrage des services Docker..." -ForegroundColor Yellow
    docker-compose up -d postgres redis
} catch {
    Write-Host "[INFO] Docker Desktop non trouvé. Assurez-vous d'avoir PostgreSQL et Redis en local." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Configuration des fichiers d'environnement..." -ForegroundColor Yellow
if (-not (Test-Path "server\.env")) {
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "[OK] server\.env créé" -ForegroundColor Green
}
if (-not (Test-Path "client\.env")) {
    Copy-Item "client\.env.example" "client\.env"
    Write-Host "[OK] client\.env créé" -ForegroundColor Green
}

Write-Host ""
Write-Host "Initialisation de la base de données..." -ForegroundColor Yellow
Set-Location server
npx prisma migrate dev --name init
npx prisma db seed
Set-Location ..

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "   Pour démarrer l'application :" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Frontend : http://localhost:3000" -ForegroundColor White
Write-Host "   Backend  : http://localhost:3001" -ForegroundColor White
Write-Host "   API Docs : http://localhost:3001/api-docs" -ForegroundColor White
Write-Host "====================================" -ForegroundColor Cyan

Read-Host "Appuyez sur Entrée pour quitter"
