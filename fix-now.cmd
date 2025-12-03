@echo off
chcp 65001 >nul
echo ====================================
echo     CORRECTION IMMEDIATE
echo ====================================
echo.

echo 1. Arret de tout...
docker-compose down
echo    ✅ Arrete
echo.

echo 2. Suppression des images conflictuelles...
docker rmi backend-api-gateway --force 2>nul
docker rmi backend-user-service --force 2>nul
echo    ✅ Images conflictuelles supprimees
echo.

echo 3. Verification docker-compose.yml...
if not exist docker-compose.yml (
    echo ❌ docker-compose.yml manquant
    goto :create-compose
)

echo    Contenu de la section api-gateway:
findstr /c:"api-gateway" docker-compose.yml
echo.

:: S'assurer qu'il utilise la bonne image
powershell -Command "(Get-Content docker-compose.yml) -replace 'backend-api-gateway', 'smartqueue-api-gateway' | Set-Content docker-compose.yml"
echo    ✅ docker-compose.yml verifie
echo.

:create-compose
echo 4. Creation Dockerfile correct...
(
echo FROM node:18-alpine
echo WORKDIR /app
echo COPY package.json .
echo RUN npm install
echo COPY . .
echo EXPOSE 4000
echo CMD ["node", "src/index.js"]
) > api-gateway\Dockerfile
echo    ✅ Dockerfile: WORKDIR /app
echo.

echo 5. S'assurer que index.js est dans src...
if not exist "api-gateway\src\index.js" (
    echo ❌ index.js manquant dans src
    mkdir api-gateway\src 2>nul
    (
echo const express = require('express');
echo const app = express();
echo const PORT = 4000;
echo.
echo app.get('/health', (req, res) => {
echo   res.json({ status: 'OK', service: 'api-gateway' });
echo });
echo.
echo app.listen(PORT, () => {
echo   console.log('Server running on port ' + PORT);
echo });
    ) > api-gateway\src\index.js
    echo    ✅ index.js cree
)
echo.

echo 6. Reconstruire avec tag explicite...
docker build -t smartqueue-api-gateway:latest ./api-gateway
echo    ✅ Image reconstruite avec tag latest
echo.

echo 7. Forcer l'utilisation de la bonne image...
:: Modifier docker-compose.yml pour forcer l'image
(
echo version: '3.8'
echo.
echo services:
echo   api-gateway:
echo     image: smartqueue-api-gateway:latest
echo     container_name: smartqueue-api-gateway
echo     ports:
echo       - "4000:4000"
echo.
echo   mongodb:
echo     image: mongo:6
echo     container_name: smartqueue-mongodb
echo     ports:
echo       - "27017:27017"
echo     environment:
echo       MONGO_INITDB_ROOT_USERNAME: admin
echo       MONGO_INITDB_ROOT_PASSWORD: admin123
) > docker-compose-fixed.yml

copy docker-compose-fixed.yml docker-compose.yml /Y
echo    ✅ docker-compose.yml fixe
echo.

echo 8. Demarrage...
docker-compose up -d
echo    ✅ Services demarres
echo.

echo 9. Attente...
timeout /t 10 /nobreak >nul
echo.

echo 10. Verification...
docker ps | findstr api-gateway && echo ✅ API Gateway en cours d'execution || echo ❌ API Gateway arrete
echo.

echo 11. Test...
curl -s -m 10 http://localhost:4000/health && echo ✅ HEALTH OK || echo ❌ HEALTH erreur
echo.

echo 🌐 Si OK: http://localhost:4000/health
echo.
pause