#!/bin/bash

echo "🚀 Démarrage de SmartQueue..."

# Créer le réseau Docker s'il n'existe pas
docker network create smartqueue-network 2>/dev/null || true

# Démarrer les bases de données
echo "📊 Démarrage des bases de données..."
docker-compose up -d mongodb postgres redis

echo "⏳ Attente que les bases de données soient prêtes..."
sleep 10

# Vérifier que MongoDB est prêt
until docker exec smartqueue-mongodb mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    echo "⏳ En attente de MongoDB..."
    sleep 2
done

# Vérifier que PostgreSQL est prêt
until docker exec smartqueue-postgres pg_isready -U admin > /dev/null 2>&1; do
    echo "⏳ En attente de PostgreSQL..."
    sleep 2
done

echo "✅ Bases de données prêtes!"

# Installer les dépendances
echo "📦 Installation des dépendances..."

echo "Installing API Gateway..."
cd api-gateway && npm install
cd ..

for service in queue-service ticket-service user-service analytics-service; do
    echo "Installing $service..."
    cd services/$service && npm install
    cd ../..
done

# Démarrer tous les services
echo "🚀 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente que les services démarrent..."
sleep 15

# Vérifier l'état des services
echo "🔍 Vérification des services..."
for service in api-gateway queue-service ticket-service user-service analytics-service; do
    if docker ps | grep -q $service; then
        echo "✅ $service est en cours d'exécution"
    else
        echo "❌ $service a échoué à démarrer"
        docker logs $service --tail 10
    fi
done

echo ""
echo "🎉 SmartQueue est prêt!"
echo ""
echo "📱 Points d'accès:"
echo "   - API Gateway: http://localhost:4000"
echo "   - MongoDB: localhost:27017"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "🔧 Pour arrêter: docker-compose down"
echo "📋 Pour voir les logs: docker-compose logs -f"