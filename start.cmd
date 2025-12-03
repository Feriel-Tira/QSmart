@echo off
chcp 65001 >nul
echo ========================================
echo     SMARTQUEUE - DEMARRAGE RAPIDE
echo ========================================
echo.

:: Vérifier Docker
echo 1. Verification de Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Docker n'est pas lance
    echo    Lancez Docker Desktop depuis le menu Demarrer
    pause
    exit /b 1
)
echo    ✅ Docker OK
echo.

:: Démarrer les conteneurs
echo 2. Demarrage des conteneurs...
docker-compose up -d
if errorlevel 1 (
    echo    ❌ Erreur Docker Compose
    echo    Verifiez le fichier docker-compose.yml
    pause
    exit /b 1
)
echo    ✅ Conteneurs demarres
echo.

:: Attendre
echo 3. Attente du demarrage (30 secondes)...
echo    Cette etape peut prendre du temps...
timeout /t 30 /nobreak >nul
echo.

:: Tester les services
echo 4. Test des services...
echo.

echo    API Gateway (4000)...
curl -s -m 5 http://localhost:4000/health && echo ✅ OK || echo ❌ Erreur

echo    Queue Service (4001)...
curl -s -m 5 http://localhost:4001/health && echo ✅ OK || echo ❌ Erreur

echo    Ticket Service (4002)...
curl -s -m 5 http://localhost:4002/health && echo ✅ OK || echo ❌ Erreur

echo    User Service (4003)...
curl -s -m 5 http://localhost:4003/health && echo ✅ OK || echo ❌ Erreur

echo.
echo ========================================
echo          ✅ PRET A UTILISER !
echo ========================================
echo.
echo 🌐 GraphQL Playground:
echo    http://localhost:4000/graphql
echo.
echo 📊 Pour tester, collez cette requete:
echo.
echo {
echo   queues {
echo     id
echo     name
echo     isActive
echo   }
echo }
echo.
echo 🔧 Commandes:
echo    - Logs: docker-compose logs -f
echo    - Arreter: docker-compose down
echo    - Redemarrer: docker-compose restart
echo.
pause