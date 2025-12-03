@echo off
chcp 65001 >nul
echo ============================================
echo     SMARTQUEUE - DEMARRAGE OPTIMISE
echo ============================================
echo.

:: Vérifier que Docker Desktop est lancé
echo 1. Verification de Docker Desktop...
tasklist | findstr /i "Docker Desktop" >nul
if errorlevel 1 (
    echo    ❌ Docker Desktop n'est pas lance
    echo.
    echo    Comment le lancer:
    echo    1. Appuyez sur Touche Windows
    echo    2. Tapez "Docker Desktop"
    echo    3. Appuyez sur Entree
    echo    4. Attendez que l'icone soit verte
    echo.
    pause
    exit /b 1
)
echo    ✅ Docker Desktop est en cours d'execution
echo.

:: Nettoyer les anciens conteneurs
echo 2. Nettoyage des anciens conteneurs...
docker-compose down 2>nul
echo    ✅ Nettoyage termine
echo.

:: Version simplifiée du docker-compose.yml
echo 3. Creation de la configuration simplifiee...
(
echo version: '3.8'
echo.
echo services:
echo   mongodb:
echo     image: mongo:6
echo     container_name: smartqueue-mongodb
echo     ports:
echo       - "27017:27017"
echo     environment:
echo       MONGO_INITDB_ROOT_USERNAME: admin
echo       MONGO_INITDB_ROOT_PASSWORD: admin123
echo.
echo   api-gateway:
echo     build: ./api-gateway
echo     container_name: smartqueue-api-gateway
echo     ports:
echo       - "4000:4000"
echo     environment:
echo       - NODE_ENV=development
echo       - JWT_SECRET=smartqueue-secret-123
echo     depends_on:
echo       - mongodb
echo.
echo   queue-service:
echo     build: ./services/queue-service
echo     container_name: smartqueue-queue-service
echo     ports:
echo       - "4001:4001"
echo     environment:
echo       - NODE_ENV=development
echo       - MONGODB_URI=mongodb://admin:admin123@mongodb:27017/smartqueue?authSource=admin
echo     depends_on:
echo       - mongodb
echo.
echo   user-service:
echo     build: ./services/user-service
echo     container_name: smartqueue-user-service
echo     ports:
echo       - "4003:4003"
echo     environment:
echo       - NODE_ENV=development
echo       - MONGODB_URI=mongodb://admin:admin123@mongodb:27017/smartqueue?authSource=admin
echo     depends_on:
echo       - mongodb
) > docker-compose-simple.yml
echo    ✅ Configuration creee
echo.

:: Utiliser la version simplifiée
copy docker-compose-simple.yml docker-compose.yml /Y >nul

:: Télécharger uniquement MongoDB d'abord
echo 4. Telechargement de MongoDB...
echo    (Cette etape peut prendre quelques minutes)
docker pull mongo:6
if errorlevel 1 (
    echo    ⚠️  Premier echec, nouvelle tentative...
    timeout /t 10 /nobreak >nul
    docker pull mongo:6
    if errorlevel 1 (
        echo    ❌ Impossible de telecharger MongoDB
        echo    Probleme de connexion internet
        echo.
        echo    Solutions:
        echo    1. Verifiez votre connexion
        echo    2. Essayez avec un hotspot mobile
        echo    3. Redemarrez Docker Desktop
        pause
        exit /b 1
    )
)
echo    ✅ MongoDB telecharge
echo.

:: Construire les images locales
echo 5. Construction des services...
echo    API Gateway...
docker build -t smartqueue-api-gateway ./api-gateway
echo    Queue Service...
docker build -t smartqueue-queue-service ./services/queue-service
echo    User Service...
docker build -t smartqueue-user-service ./services/user-service
echo    ✅ Construction terminee
echo.

:: Démarrer
echo 6. Demarrage des conteneurs...
docker-compose up -d
if errorlevel 1 (
    echo    ⚠️  Erreur au demarrage, tentative de correction...
    docker-compose down
    timeout /t 5 /nobreak >nul
    docker-compose up -d
    if errorlevel 1 (
        echo    ❌ Echec critique
        echo    Afficher les logs avec: docker-compose logs
        pause
        exit /b 1
    )
)
echo    ✅ Conteneurs demarres
echo.

:: Attendre
echo 7. Initialisation (40 secondes)...
echo    Patientez pendant le demarrage de MongoDB...
for /l %%i in (1,1,40) do (
    set /p "=." <nul
    timeout /t 1 /nobreak >nul
)
echo.
echo.

:: Test
echo 8. Test du systeme...
echo.
echo    Test MongoDB...
docker exec smartqueue-mongodb mongosh --quiet --eval "db.adminCommand('ping')" 2>nul
if errorlevel 1 (
    echo    ⚠️  MongoDB en cours d'initialisation...
    timeout /t 10 /nobreak >nul
    docker exec smartqueue-mongodb mongosh --quiet --eval "db.adminCommand('ping')" 2>nul && echo    ✅ MongoDB OK || echo    ❌ MongoDB Erreur
) else (
    echo    ✅ MongoDB OK
)

echo    Test API Gateway...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:4000/health' -TimeoutSec 10; Write-Host '    ✅ API Gateway: ' -NoNewline; Write-Host '$($response.status)' -ForegroundColor Green } catch { Write-Host '    ⚠️  API Gateway en cours de demarrage' -ForegroundColor Yellow }"

echo.
echo ============================================
echo        ✅ SMARTQUEUE EST OPERATIONNEL !
echo ============================================
echo.
echo 🌐 OUVREZ VOTRE NAVIGATEUR SUR :
echo    http://localhost:4000/graphql
echo.
echo 🧪 TESTEZ AVEC CETTE REQUETE :
echo {
echo   queues {
echo     id
echo     name
echo     isActive
echo   }
echo }
echo.
echo 📱 POUR L'APPLICATION MOBILE :
echo    cd ..\mobile
echo    flutter pub get
echo    flutter run
echo.
echo 🔧 COMMANDES UTILES :
echo    - Voir les logs : docker-compose logs -f
echo    - Arreter : docker-compose down
echo    - Redemarrer : docker-compose restart
echo.
pause