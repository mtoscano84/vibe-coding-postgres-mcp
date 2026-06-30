#!/bin/bash
# Script to start AlloyDB Omni (Single Container with AI enabled) locally using Podman

echo "🚀 Starting AlloyDB Omni (AI-Ready) container..."

# 1. Load Environment Variables
if [ ! -f "../.env" ] && [ ! -f ".env" ]; then
    echo "❌ ERROR: No .env file found."
    exit 1
fi

if [ -f "../.env" ]; then
    source ../.env
else
    source .env
fi

if [ -z "$GCP_SA_KEY_PATH" ] || [ ! -f "$GCP_SA_KEY_PATH" ]; then
    echo "❌ ERROR: Valid GCP_SA_KEY_PATH is not configured in .env."
    exit 1
fi

PASSWORD="${POSTGRES_PASSWORD:-supersecret}"
CONTAINER_NAME="alloydb-omni"
DATA_DIR="/var/lib/postgresql/data"

# 2. Check if container exists
if podman ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container ${CONTAINER_NAME} already exists. Starting it..."
    podman start ${CONTAINER_NAME}
else
    echo "Creating and starting new DB container..."
    
    # Step 1: Run the container.
    podman run --name ${CONTAINER_NAME} \
      -e POSTGRES_PASSWORD=${PASSWORD} \
      -v ${GCP_SA_KEY_PATH}:/etc/postgresql/private-key.json \
      -v alloydb_omni_data_v1:${DATA_DIR} \
      -p 5432:5432 \
      --shm-size=4g \
      -d google/alloydbomni:latest

    echo "⏳ Waiting for database to initialize..."
    until podman exec -i ${CONTAINER_NAME} pg_isready -U postgres > /dev/null 2>&1; do
        sleep 1
    done

    # Step 2: Fix permissions on the mounted key file
    echo "🔐 Setting strict permissions on the Service Account JSON key..."
    podman exec ${CONTAINER_NAME} chown postgres /etc/postgresql/private-key.json
    podman exec ${CONTAINER_NAME} chmod 600 /etc/postgresql/private-key.json

    # Step 3: Configure postgresql.conf to enable the ML Agent
    echo "⚙️ Configuring postgresql.conf..."
    podman exec -i ${CONTAINER_NAME} sh -c "cat << EOF >> ${DATA_DIR}/postgresql.conf
omni_enable_ml_agent_process = 'on'
omni_google_cloud_private_key_file_path = '/etc/postgresql/private-key.json'
EOF"

    # Step 4: Restart the container to apply changes
    echo "🔄 Restarting container to apply ML Agent configuration..."
    podman restart ${CONTAINER_NAME}
fi

echo "⏳ Waiting for database to be ready after restart..."
until podman exec -i ${CONTAINER_NAME} pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

# 3. Create Database
if ! podman exec -i ${CONTAINER_NAME} psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'restguidedb'" | grep -q 1; then
    echo "Creating database 'restguidedb'..."
    podman exec -i ${CONTAINER_NAME} psql -U postgres -c "CREATE DATABASE restguidedb;"
fi

echo "✅ AlloyDB Omni with native AI enabled is running!"