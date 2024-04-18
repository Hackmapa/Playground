#!/bin/bash

# Define parameters
DB_USER="root"
DB_PASS="root"
DB_NAME="hackmapa"
DB_PORT="3306"
DB_SERVICE="database"
MIGRATION_SERVICE="backend"
PERMISSIONS_PATH="/config/jwt"

# Check if database exists, and create it if it doesn't
echo "Checking if database exists..."
DB_EXISTS=$(docker-compose exec -T $DB_SERVICE mysql -u$DB_USER -p$DB_PASS -e "SHOW DATABASES LIKE '$DB_NAME';" | grep -w $DB_NAME)

if [ "$DB_EXISTS" ]; then
    echo "Database already exists."
else
    echo "Database does not exist. Creating database..."
    docker-compose exec -T $DB_SERVICE mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME;"
    echo "Database created."
fi

# Run Symfony migrations
echo "Running Symfony migrations..."
docker-compose exec $MIGRATION_SERVICE php bin/console doctrine:migrations:migrate --no-interaction

echo "Setup completed."
