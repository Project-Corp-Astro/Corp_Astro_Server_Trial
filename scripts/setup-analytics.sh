#!/bin/bash

# Corp Astro Analytics Setup Script
# This script helps set up the analytics database and run migrations

echo "Corp Astro Analytics Setup"
echo "=========================="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start the PostgreSQL database
echo "Starting PostgreSQL database for analytics..."
docker-compose -f docker-compose.analytics.yml up -d

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Check database connection
echo "Checking database connection..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec corp-astro-analytics-db pg_isready -U postgres > /dev/null 2>&1; then
        echo "Database is ready!"
        break
    fi
    
    echo "Waiting for database to be ready (attempt $attempt/$max_attempts)..."
    sleep 3
    attempt=$((attempt + 1))
    
    if [ $attempt -gt $max_attempts ]; then
        echo "Error: Could not connect to the database after $max_attempts attempts."
        echo "Please check the Docker logs with: docker logs corp-astro-analytics-db"
        exit 1
    fi
done

# Update database configuration if needed
echo "Checking database configuration..."
DB_CONFIG_FILE="src/config/database.js"

if [ -f "$DB_CONFIG_FILE" ]; then
    echo "Database configuration file found."
else
    echo "Error: Database configuration file not found at $DB_CONFIG_FILE"
    exit 1
fi

# Run database migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
else
    echo "Error: Migrations failed. Please check the error messages above."
    exit 1
fi

echo
echo "Analytics database setup complete!"
echo "You can now use the analytics system with your Corp Astro application."
echo
echo "To view the database, you can connect with these credentials:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: corp_astro_analytics"
echo "  Username: postgres"
echo "  Password: postgres"
echo
echo "To stop the database, run: docker-compose -f docker-compose.analytics.yml down"
echo "To start it again, run: docker-compose -f docker-compose.analytics.yml up -d"
