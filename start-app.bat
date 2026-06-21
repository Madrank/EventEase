@echo off
title EventEase - Installateur

echo ====================================
echo    EventEase - Installation
echo ====================================
echo.

:: Vérifier Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe. Veuillez installer Node.js 18+.
    echo Telechargement : https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js trouve

:: Vérifier npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] npm n'est pas trouve.
    pause
    exit /b 1
)
echo [OK] npm trouve

:: Vérifier Docker (optionnel)
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker Desktop trouve
    echo Demarrage des services Docker...
    docker-compose up -d postgres redis
) else (
    echo [INFO] Docker Desktop non trouve. Assurez-vous d'avoir PostgreSQL et Redis en local.
)

echo.
echo Installation des dependances...
call npm install

echo.
echo Configuration des fichiers d'environnement...
if not exist "server\.env" (
    copy server\.env.example server\.env
    echo [OK] server\.env cree
)
if not exist "client\.env" (
    copy client\.env.example client\.env
    echo [OK] client\.env cree
)

echo.
echo Initialisation de la base de donnees...
cd server
call npx prisma migrate dev --name init
call npx prisma db seed
cd ..

echo.
echo ====================================
echo    Installation terminee !
echo.
echo    Pour demarrer l'application :
echo    npm run dev
echo.
echo    Frontend : http://localhost:3000
echo    Backend  : http://localhost:3001
echo    API Docs : http://localhost:3001/api-docs
echo ====================================
echo.

pause
