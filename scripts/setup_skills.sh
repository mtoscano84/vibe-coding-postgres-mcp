#!/bin/bash
# scripts/setup_skills.sh
# Creates symbolic links from the repository's 'skills' folder 
# to the local Jetski environment (~/.gemini/jetski/skills/)

echo "🚀 Setting up Vibe Coding Skills for Jetski..."

# 1. Get the absolute path of the project root directory
# This command ensures we get the root path even if the script is run from inside the /scripts folder
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1 && pwd)"
SKILLS_DIR="$PROJECT_ROOT/skills"

# Check if the skills directory exists in the project
if [ ! -d "$SKILLS_DIR" ]; then
  echo "❌ Error: The directory $SKILLS_DIR does not exist."
  echo "Make sure you have created your skills in the repository."
  exit 1
fi

# 2. Define the global Jetski skills directory
JETSKI_GLOBAL_SKILLS="$HOME/.gemini/jetski/skills"

# 3. Create the global Jetski directory if it doesn't exist
mkdir -p "$JETSKI_GLOBAL_SKILLS"
echo "📂 Verified local Jetski skills directory at $JETSKI_GLOBAL_SKILLS"

# 4. Link project skills to the global Jetski directory
echo "🔗 Linking project skills..."

# Counter for successfully linked skills
LINKED_COUNT=0

for skill_path in "$SKILLS_DIR"/*; do
    if [ -d "$skill_path" ]; then
        skill_name=$(basename "$skill_path")
        target_link="$JETSKI_GLOBAL_SKILLS/$skill_name"
        
        # Remove existing link/folder if it exists to avoid conflicts
        rm -rf "$target_link"
        
        # Create the symbolic link
        ln -s "$skill_path" "$target_link"
        echo "   ✅ Linked skill: $skill_name"
        ((LINKED_COUNT++))
    fi
done

if [ $LINKED_COUNT -eq 0 ]; then
    echo "⚠️  No skills found in $SKILLS_DIR to link."
else
    echo "🎉 Success! $LINKED_COUNT skill(s) are now ready to use in Jetski."
fi