# Vibe Coding the Backend: AlloyDB Omni & MCP

This repository contains the code and instructions to demonstrate how to use an Agentic IDE (like Antigravity or Cursor) in combination with Model Context Protocol (MCP) to seamlessly integrate a Next.js frontend with a local AlloyDB Omni database using Vibe Coding

## About the Demo Application

In this demo, we build **Tu guIA Gastronómico**, a modern restaurant search application. We start with a static Next.js frontend displaying hardcoded mock data. Step-by-step, using only natural language prompts ("Vibe Coding"), we instruct our AI agent to:
1. Ingest a raw CSV dataset of restaurants.
2. Build a relational database schema in AlloyDB Omni and import the data.
3. Wire the React frontend to the live database.
4. Upgrade the search functionality to use **Semantic Vector Search**, allowing users to find restaurants by describing the "vibe" (e.g., "cozy place for a date") rather than matching exact keywords.
5. Apply production-grade database optimizations (Vector Index and Partitioning).

## Prerequisites

To run this demo locally, you will need:
*   An Agentic IDE (e.g., Antigravity, Cursor).
*   [Podman Desktop](https://podman-desktop.io/).
*   `git` and `npm` installed.
*   Google Cloud SDK (`gcloud`) installed and authenticated.
*   A Nano Banana API Key (for generating mock images).

---

## 1. Getting Started: Clone & Install

First, clone this repository to your local machine and install the necessary dependencies for the Next.js application.

```bash
# Clone the repository
git clone https://github.com/mtoscano84/vibe-e2e-postgres-mcp.git

# Navigate into the project directory
cd vibe-e2e-postgres-mcp

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Configuration

The repository contains a `.env.example` file. You need to create a `.env` file for local configuration:

```bash
# Copy the example env file
cp .env.example .env
```

Open the `.env` file and fill in the required values:
*   `POSTGRES_PASSWORD`: The password for the database (default is `pgpwd`).
*   `GCP_SA_KEY_PATH`: The absolute path to your Google Cloud Service Account JSON key (required for vector search). See **Section 5. Enabling AI Features** below for instructions on how to obtain this key.
*   `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud Project ID.

---

## 2. Generate Local Assets (Images)

To keep this repository lightweight, the high-resolution restaurant images are not included in the source code. Instead, we use a Python script that reads the restaurant data from our CSV files and generates the images locally using the Google GenAI SDK and the `imagen-4.0-generate-001` model.

### Prerequisites
Ensure you have the Google GenAI SDK installed in your Python environment:
```bash
pip install google-genai
```

### Execution
1.  Ensure you are authenticated with Google Cloud (e.g., via `gcloud auth application-default login`).
2.  Run the image generation script. This script will read the CSV files in `database/` and populate the `frontend/public/images/` folder:
    ```bash
    python scripts/generate_images_real.py
    ```
*Note: The script is configured to process images for both Madrid and Sevilla catalogs.*

---

## 3. Database Infrastructure Setup

We use **AlloyDB Omni** running locally via Podman to provide a production-grade, AI-ready PostgreSQL environment without incurring cloud costs during development.

### a. Install and Configure Podman

1.  **Install Podman Desktop:** If you haven't already, download and install [Podman Desktop](https://podman-desktop.io/).
    *   **Mac Users:** If the `podman` command isn't found in your `$PATH`, the most reliable fix is to install it via Homebrew: `brew install podman`.

2.  **Configure the Podman Machine:** Create and initialize your Podman virtual machine with these minimum specifications:
    *   **vCPUs:** 2
    *   **Memory:** 4 GB
    *   **Storage:** 50 GB

### b. Start a Fresh Database Instance

To ensure a clean state for the demo, run the `reset-demo.sh` script from the root of this project. This script will automatically stop and remove any old `alloydb-omni` container before starting a fresh one.

```bash
bash ./reset-demo.sh
```

Verify the new container is running:
```bash
podman ps
```
*You should see `docker.io/google/alloydbomni:latest` running on port `5432`.*

### c. Verify Connection

Test your connection to the database manually:
```bash
psql -h localhost -p 5432 -U postgres
# The password is "pgpwd" as defined in the script.
```

---

## 4. Agent & Tooling Setup (The "Vibe Coding" Stack)

This section configures your Agentic IDE to securely interact with the local database.

### a. Configure the MCP Toolbox

This repository includes a `mcp_config.example.json` at the root, which serves as a template for configuring the AlloyDB Omni toolbox.

**For Antigravity Users:**
Antigravity requires you to register MCP servers globally via its UI.
1. Open the Agent panel, click the `...` menu, select **MCP Servers**, then **Manage MCP Servers > View raw config**.
2. Copy the `"toolbox-alloydb"` object from `mcp_config.example.json` and paste it into the `"mcpServers"` block of your Antigravity raw config file.

### b. Register Custom "Skills"

Skills are version-controlled markdown recipes that teach the agent how to execute complex workflows. You need to symlink the skills from this repository to your IDE's global skill directory.

**Example: Registering the `connect-nextjs-to-db` Skill**

*(Instructions assume Antigravity; adjust paths for your IDE if needed)*

1.  Create the global skills directory:
    ```bash
    mkdir -p ~/.gemini/antigravity/skills/connect-nextjs-to-db
    ```
2.  Create a symbolic link from this repository to the global directory. Using `$(pwd)` ensures the absolute path is correct.
    ```bash
    # IMPORTANT: Replace the path with your actual project path
    ln -s "$(pwd)/skills/connect-nextjs-to-db" ~/.gemini/antigravity/skills/connect-nextjs-to-db
    ```
*(Repeat this process for any other skills in the `/skills` directory).*

---

## 5. Enabling AI Features (AlloyDB AI)

To use the native `embedding()` function within AlloyDB Omni, the container needs access to Vertex AI via a Google Cloud Service Account.

1.  **Create a Service Account Key:** Follow the official [AlloyDB Omni AI Setup Documentation](https://docs.cloud.google.com/alloydb/omni/containers/current/docs/install-with-alloydb-ai) to create a Service Account with the `Vertex AI User` role and download the JSON key.

2.  **Mount the Key:** Save your downloaded JSON key to a known location (e.g., `~/.config/gcp-keys/alloydb-omni-sa.json`). The `reset-demo.sh` script is already configured to mount this path; ensure the path in the script matches where you saved your key.

---

## 6. Running the Demo (The Vibe Coding Flow)

With the infrastructure and agent configured, you are ready to start Vibe Coding. Open this project (`vibe-e2e-postgres-mcp`) in your Agentic IDE, start the Next.js development server (`npm run dev`), and open the Agent Chat.

Follow this prompt sequence to reproduce the demo:

### Step 1: Database Initialization & Data Ingestion
Ask the agent to read your local CSV and construct the database schema autonomously.

> **Prompt 1:**  
> Lee las cabeceras del seed_data_sevilla.csv. Conéctate vía MCP a la base de datos restguidedb, crea la tabla restaurantes en AlloyDB Omni con los tipos de datos correctos, y luego genera y ejecuta el comando de Postgres (\copy o COPY) para importar todo el archivo.

### Step 2: Connect Frontend to the Database
Ask the agent to replace the hardcoded mock data in the React application with a live connection to AlloyDB.

> **Prompt 2:**  
> Act as a Senior Full-Stack Engineer. Our Next.js frontend is currently displaying hardcoded mock data. Connect it to our 'restaurantes' catalog in the 'restguidedb' database. Users should be able to search by name, neighborhood, or description. (DB password is 'pgpwd' on port 5432).

### Step 3: Upgrade Database with Semantic Search
Instruct the agent to add vector search capabilities directly into the database engine.

> **Prompt 3:**  
> Our users are complaining that searching for 'romantic dinner' returns no results because they are doing exact keyword matches. Please upgrade our AlloyDB database to support Semantic Vector Search for the 'restaurantes' catalog based on their descriptions.

### Step 4: Implement Semantic Search in the UI
Now tell the agent to update the frontend logic to consume the new vector search feature.

> **Prompt 4:**  
> Now make the frontend use this new semantic superpower. When a user searches, the app should find restaurants based on the meaning of their query, not the exact words. Replace the old search logic with vector similarity.

### Step 5: Production Optimization (The Virtual DBA)
Finally, ask the agent to act as an architect and optimize the table for production scale.

> **Prompt 5:**  
> Act as a Principal Database Architect for Google Cloud. Our semantic search on the `restaurantes` table is working perfectly for a small dataset. However, we are preparing for a launch that will scale the table to 100K+ rows and handle massive concurrent user searches. Analyze our current setup. What are the top 2 database-schema optimizations you recommend we implement right now and explain me why. (Keep your answer brief, focusing on the database layer. Wait for my approval before modifying the database).

*(Note: Once the agent replies with its recommendations—likely ScaNN indexing and Partitioning—you can approve it to let the MCP execute the DDL).*

---

## 7. Resetting the Demo

If you want to run the demo again from scratch, you need to reset the environment and the agent's context.

### a. Reset the Database and Codebase
Run the reset script. This script automatically stops and removes the modified AlloyDB Omni container, spins up a fresh, empty instance, and restores your local codebase (reverting any changes the agent made to your Next.js files).
```bash
bash ./reset-demo.sh
```

### b. Clear Antigravity Context
To ensure the agent doesn't use information, memory, or cached schemas from the previous run:
1. Close your current chat session in Antigravity.
2. Open a **New Chat** (or use the "Reload Window" / "Clear Context" command if available). This guarantees the agent starts with a completely fresh context window for your next demo run.