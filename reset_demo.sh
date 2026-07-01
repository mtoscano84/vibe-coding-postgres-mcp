#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_HOST=${DB_HOST:-"127.0.0.1"}
DB_PASS=${DB_PASS:-"pgpwd"}
DB_NAME=${DB_NAME:-"postgres"}

echo "--- Resetting Database Table ---"
echo "Attempting to drop 'restaurants' table on $DB_HOST..."

# Try to run psql command to drop the table
if command -v psql &> /dev/null; then
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p 5432 -U postgres -d $DB_NAME -c "DROP TABLE IF EXISTS restaurants CASCADE;" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "Successfully dropped 'restaurants' table."
  else
    echo "⚠️ Warning: Could not connect to the database via psql."
    echo "👉 You can easily reset the database by asking your Antigravity agent:"
    echo "   \"Reset the database by dropping the restaurants table.\""
  fi
else
  echo "Note: 'psql' CLI is not installed locally."
  echo "👉 You can easily reset the database by asking your Antigravity agent:"
  echo "   \"Reset the database by dropping the restaurants table.\""
fi

echo ""
echo "--- Resetting Codebase to State 0 ---"
git reset --hard HEAD

# Clean up untracked files but preserve .env and node_modules
git clean -fdx -e .env -e frontend/node_modules/

echo "Freeing up port 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "Codebase reset complete."