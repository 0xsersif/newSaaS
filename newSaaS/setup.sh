#!/bin/bash

# CODShop SaaS - Quick Start Script
# This script sets up the entire application locally with Docker

set -e

echo "🚀 Starting CODShop SaaS Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Building Docker containers..."
docker-compose build

echo "🏃 Starting services..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Running migrations..."
docker-compose exec -T backend php artisan migrate --force

echo "🌱 Seeding database..."
docker-compose exec -T backend php artisan db:seed --force

echo "✅ Setup complete!"
echo ""
echo "🌐 Application is now running at:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo "   - Adminer: http://localhost:8080"
echo "   - MinIO Console: http://localhost:9001"
echo ""
echo "📝 Default credentials:"
echo "   - Email: test@example.com"
echo "   - Password: password"
echo ""
echo "🛑 To stop the application, run: docker-compose down"
echo "📜 To view logs, run: docker-compose logs -f"
