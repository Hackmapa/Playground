#!/bin/bash

# Define parameters
DB_USER="root"
DB_PASS="root"
DB_NAME="hackmapa"
DB_PORT="3306"
DB_SERVICE="db"
MIGRATION_SERVICE="backend"
PERMISSIONS_PATH="/config/jwt"

# Check if database exists, and create it if it doesn't
echo "Checking if database exists..."
DB_EXISTS=$(docker compose exec -T $DB_SERVICE mariadb -u$DB_USER -p$DB_PASS -e "SHOW DATABASES LIKE '$DB_NAME';" | grep -w $DB_NAME)

if [ "$DB_EXISTS" ]; then
    echo "Database already exists."
else
    echo "Database does not exist. Creating database..."
    docker exec $MIGRATION_SERVICE php bin/console doctrine:database:create --no-interaction
    echo "Database created."
fi

# Run Symfony migrations
echo "Running Symfony migrations..."
docker exec $MIGRATION_SERVICE php bin/console doctrine:migrations:migrate --no-interaction

# Generate JWT keys
echo "Generating JWT keys..."
docker exec $MIGRATION_SERVICE php bin/console lexik:jwt:generate-keypair --skip-if-exists

echo "Setup completed."
