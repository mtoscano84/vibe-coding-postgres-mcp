#!/bin/bash

echo "--- Resetting Database ---"
podman rm -f alloydb-omni 2>/dev/null
podman volume rm alloydb_omni_data_v1 2>/dev/null

./database/start-alloydb-omni.sh

echo "Waiting 5 seconds for DB to start..."
sleep 5

# Create the database only if it doesn't exist (start script might already do this, but safe to keep)
podman exec -i alloydb-omni psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'restguidedb'" | grep -q 1 || podman exec -i alloydb-omni psql -U postgres -c "CREATE DATABASE restguidedb;"

echo "Database reset complete."

echo "--- Resetting Codebase ---"
git reset --hard HEAD

# THE FIX: Added -e .env to protect your local credentials
git clean -fdx -e frontend/public/images/ -e .env

cd frontend && npm install

# Free up port 3000 if busy
echo "Freeing up port 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "Codebase reset complete."