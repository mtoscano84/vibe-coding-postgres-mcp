#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_PASS=${POSTGRES_PASSWORD:-"pgpwd"}

echo "--- Resetting Database on GCP (via Local Proxy) ---"
echo "Attempting to drop 'restguidedb' database..."

# Run psql command against localhost (AlloyDB Auth Proxy)
PGPASSWORD=$DB_PASS psql -h 127.0.0.1 -p 5432 -U postgres -c "DROP DATABASE IF EXISTS restguidedb;" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "Database 'restguidedb' dropped successfully."
else
  echo "⚠️ Warning: Could not connect to AlloyDB via 127.0.0.1:5432."
  echo "Make sure the AlloyDB Auth Proxy is running locally before running this script if you want to reset the database."
fi

echo "--- Resetting Codebase ---"
git reset --hard HEAD

# Clean up untracked files but preserve .env and node_modules
git clean -fdx -e .env -e frontend/node_modules/

echo "Freeing up port 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "Codebase reset complete."