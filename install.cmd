@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════╗
echo ║  INSTALLATION DES DEPENDANCES NPM    ║
echo ╚══════════════════════════════════════╝
echo.

:: Vérifier npm
where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ npm n'est pas dans le PATH
    echo.
    echo Ajoutez Node.js au PATH:
    echo C:\Program Files\nodejs\
    pause
    exit /b 1
)

echo ✅ npm detecte
echo.

:: 1. API Gateway
echo [1/6] API Gateway...
cd api-gateway
if exist package.json (
    echo   Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo   ⚠️  Erreur, tentative avec --force...
        call npm install --force
    )
) else (
    echo   ❌ package.json manquant
)
cd ..
echo.

:: 2. Queue Service
echo [2/6] Queue Service...
cd services\queue-service
if exist package.json (
    echo   Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo   ⚠️  Erreur, tentative avec --force...
        call npm install --force
    )
) else (
    echo   ❌ package.json manquant
)
cd ..\..
echo.

:: 3. Ticket Service
echo [3/6] Ticket Service...
cd services\ticket-service
if exist package.json (
    echo   Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo   ⚠️  Erreur, tentative avec --force...
        call npm install --force
    )
) else (
    echo   ❌ package.json manquant
)
cd ..\..
echo.

:: 4. User Service
echo [4/6] User Service...
cd services\user-service
if exist package.json (
    echo   Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo   ⚠️  Erreur, tentative avec --force...
        call npm install --force
    )
) else (
    echo   ❌ package.json manquant
)
cd ..\..
echo.

:: 5. Analytics Service
echo [5/6] Analytics Service...
cd services\analytics-service
if exist package.json (
    echo   Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo   ⚠️  Erreur, tentative avec --force...
        call npm install --force
    )
) else (
    echo   ❌ package.json manquant
)
cd ..\..
echo.

echo [6/6] Verification...
echo Liste des node_modules crees:
dir /s node_modules | find "Rép" || echo Aucun node_modules trouve
echo.

echo ╔══════════════════════════════════════╗
echo ║        ✅ INSTALLATION TERMINEE      ║
echo ╚══════════════════════════════════════╝
echo.
echo Prochaine etape:
echo   1. Lancez Docker Desktop
echo   2. Executez: docker-compose up -d
echo   3. Testez: curl http://localhost:4000/health
echo.
pause