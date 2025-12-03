#!/bin/bash
echo "🧹 Nettoyage complet..."
docker-compose down -v
docker network rm smartqueue-network 2>/dev/null || true
echo "✅ Nettoyage terminé!"