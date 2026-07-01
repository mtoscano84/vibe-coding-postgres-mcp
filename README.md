# Codelab: Vibe-Coding a Gastronomy Search App on Google Cloud (AlloyDB & Cloud Run)

In this codelab, you will learn how to build a modern, AI-powered restaurant search application called **Berlin AI Gastronomy Guide** using **Vibe Coding** (instructing an AI agent using natural language). 

You will start with a static Next.js frontend running on Google Cloud Run. Using an Agentic IDE (like Antigravity) connected to a live, private Google Cloud **AlloyDB** instance via the **AlloyDB Auth Proxy**, you will instruct the AI agent to:
1. Ingest a raw CSV dataset of Berlin restaurants.
2. Wire the Next.js frontend to the live database (Keyword Search).
3. Upgrade the search to use **Semantic Vector Search** (using Vertex AI embeddings in AlloyDB).
4. Apply production-grade database optimizations (HNSW Vector Index and Partitioning).

---

## 🏗️ Architecture

```
                                  +---------------------------------------+
                                  |         Google Cloud Project          |
                                  |                                       |
                                  |   +-------------------------------+   |
                                  |   |          VPC Network          |   |
+--------------------------+      |   |                               |   |
|   Local Machine (User)   |      |   |   +-----------------------+   |   |
|                          |      |   |   |    Cloud Run App      |   |   |
|  +--------------------+  |      |   |   | (berlin-gastronomy)   |   |   |
|  |   Agentic IDE      |  |      |   |   +-----------+-----------+   |   |
|  |  (Antigravity)     |  |      |   |               | (VPC Egress)  |   |
|  +---------+----------+  |      |   |               v               |   |
|            |             |      |   |   +-----------------------+   |   |
|            v             |      |   |   |    AlloyDB Instance   |   |   |
|  +---------+----------+  |      |   |   |     (Private IP)      |   |   |
|  |   Postgres MCP     |  |      |   |   +-----------^-----------+   |   |
|  +---------+----------+  |      |   +---------------|---------------+   |
|            |             |      |                   |                   |
|            v             |      |                   |                   |
|  +---------+----------+  |      |                   | (Secure Tunnel)   |
|  | AlloyDB Auth Proxy |==|======|===================+                   |
|  +--------------------+  |      |                                       |
+--------------------------+      |   +-------------------------------+   |
                                  |   |       Public GCS Bucket       |   |
                                  |   |  (vibe-coding-berlin-images)  |   |
                                  |   +-------------------------------+   |
                                  +---------------------------------------+
```

- **Frontend**: Next.js deployed on **Google Cloud Run** with Direct VPC Egress enabled.
- **Database**: **AlloyDB** (private IP only) running in your Google Cloud VPC.
- **Assets**: Restaurant images hosted in a public Google Cloud Storage (GCS) bucket.
- **AI Agent Connection**: Local IDE (Antigravity) connected to the private AlloyDB instance via the **AlloyDB Auth Proxy**.

---

## 📋 Phase 1: Pre-requisites & Infrastructure Setup

Before starting the vibe-coding cycle, you need to deploy the baseline cloud infrastructure.

### 1. Set Up your Google Cloud Project
1. Open Google Cloud Shell or your local terminal.
2. Ensure you are authenticated and have set your active project:
   ```bash
   gcloud auth login
   gcloud config set project [YOUR_PROJECT_ID]
   ```

### 2. Clone the Repository
Clone this repository to your local machine (or Cloud Shell) and navigate into the project directory:
```bash
git clone https://github.com/mtoscano84/vibe-coding-postgres-mcp.git
cd vibe-coding-postgres-mcp
```

### 3. Deploy the AlloyDB Cluster
We have provided an automated script to provision a private AlloyDB cluster and instance.
1. Run the deployment script:
   ```bash
   bash database/deploy_alloydb.sh --region us-central1
   ```
2. **Important**: Note the **Instance IP** and the **Initial Password** printed at the end of the script execution. You will need these to connect.

### 4. Deploy the Next.js Frontend to Cloud Run (State 0)
We will deploy the initial static version of the frontend to Cloud Run. It will run in the same VPC network as AlloyDB using **Direct VPC Egress**.
1. Navigate to the `frontend/` directory.
2. Build and deploy the application:
   ```bash
   gcloud run deploy berlin-gastronomy-guide \
     --source . \
     --network=[YOUR_VPC_NETWORK] \
     --subnet=[YOUR_VPC_NETWORK] \
     --allow-unauthenticated \
     --region=us-central1 \
     --quiet
   ```
3. Once deployed, note the **Service URL** of your Cloud Run application.

---

## 🔌 Phase 2: Connecting your Agent to Google Cloud

Since AlloyDB is running in a private VPC, your local Agentic IDE (Antigravity) cannot access it directly. We will use the **AlloyDB Auth Proxy** to tunnel traffic securely.

### 1. Install and Run the AlloyDB Auth Proxy
1. Download the proxy binary for your operating system (see [AlloyDB Auth Proxy installation guide](https://cloud.google.com/alloydb/docs/auth-proxy#install)).
2. Authenticate your local environment:
   ```bash
   gcloud auth application-default login
   ```
3. Start the proxy locally (replace `<PROJECT_ID>`, `<REGION>`, `<CLUSTER_NAME>`, and `<INSTANCE_NAME>` with your AlloyDB details):
   ```bash
   ./alloydb-auth-proxy projects/<PROJECT_ID>/locations/<REGION>/clusters/<CLUSTER_NAME>/instances/<INSTANCE_NAME>
   ```
   *The proxy will start and listen on `127.0.0.1:5432`.*

### 2. Configure the MCP Toolbox in your IDE
To allow the AI agent to interact with the database, configure the AlloyDB MCP server in your IDE.
1. In Antigravity, open **Settings > MCP Servers > View raw config**.
2. Add the following configuration to the `mcpServers` block:
   ```json
   "alloydb-postgres": {
     "command": "npx",
     "args": [
       "-y",
       "@toolbox-sdk/server",
       "--prebuilt",
       "alloydb-postgres",
       "--stdio"
     ],
     "env": {
       "ALLOYDB_POSTGRES_PROJECT": "[YOUR_PROJECT_ID]",
       "ALLOYDB_POSTGRES_REGION": "us-central1",
       "ALLOYDB_POSTGRES_CLUSTER": "alloydb-aip-01",
       "ALLOYDB_POSTGRES_INSTANCE": "alloydb-aip-01-pr",
       "ALLOYDB_POSTGRES_DATABASE": "postgres",
       "ALLOYDB_POSTGRES_USER": "postgres",
       "ALLOYDB_POSTGRES_PASSWORD": "[YOUR_ALLOYDB_PASSWORD]"
     }
   }
   ```
3. Save the config. Your agent now has direct, secure access to your cloud database!

---

## 🌊 Phase 3: The Vibe Coding Codelab

Open the repository in your Agentic IDE. Open the Agent Chat and execute the following steps by prompting the agent.

### Step 1: Database Ingestion
We need to load the restaurant catalog into our database.
* **Prompt**:
  > Read the headers of `database/seed_data_berlin.csv`. Connect via the MCP tool to the database, create a database named `restguidedb` if it doesn't exist, and create a table named `restaurants` in it with the correct data types. Then, load all the records from the CSV file into the table.

### Step 2: Connect Frontend to Database (Keyword Search)
Now we will wire the Next.js frontend to the live database.
* **Prompt**:
  > Connect our Next.js frontend to our new `restaurants` table in the `restguidedb` database using a connection pool (use the `pg` library, password is '[YOUR_PASSWORD]' at host '127.0.0.1' and port 5432). Replace the hardcoded mock data in `page.tsx` with a live query to the database, and implement keyword search on the restaurant name, category, and description.
* **Verification**:
  - The agent will install the `pg` package, configure the pool, and update `page.tsx` to query the database.
  - Redeploy the application to Cloud Run so it connects to the database:
    ```bash
    gcloud run deploy berlin-gastronomy-guide \
      --source . \
      --network=[YOUR_VPC_NETWORK] \
      --subnet=[YOUR_VPC_NETWORK] \
      --set-env-vars="DB_HOST=[YOUR_ALLOYDB_PRIVATE_IP],DB_USER=postgres,DB_PASS=[YOUR_PASSWORD],DB_NAME=restguidedb" \
      --allow-unauthenticated \
      --region=us-central1 \
      --quiet
    ```

### Step 3: Enable Semantic Vector Search
Now, we want to allow users to search by describing the "vibe" (e.g., *"cozy place for a date"*).
* **Prompt**:
  > Upgrade our database to support Semantic Vector Search. Enable the pgvector extension, register the Vertex AI embedding model in AlloyDB using `google_ml_integration`, generate embeddings for the restaurant descriptions, and update our search query to use vector similarity search.
* **Verification**:
  - The agent will run SQL commands to enable `vector`, configure the Vertex AI model integration, generate embeddings in a new `embedding` column, and update the search logic in `page.tsx`.

### Step 4: Database Optimization (Virtual DBA)
Optimize the database to scale to 100K+ rows and handle high concurrent search traffic.
* **Prompt**:
  > Act as a Principal Database Architect. Our semantic search is working, but we need to optimize the database for production scale. Analyze our current schema. What are the top 2 database-schema optimizations you recommend we implement right now? Explain them to me and wait for my approval before modifying the database.
* **Expected Recommendations**:
  - Create an **HNSW index** on the vector column.
  - Apply **Declarative Table Partitioning** (e.g., by neighborhood).
* **Action**: Once the agent explains these, reply with *"Approved, please apply these optimizations"* and let the agent execute them.

---

## 🛠️ Building the Environment (Creator Guide)

If you need to regenerate the assets or redeploy the public GCS bucket in a new environment, follow these steps:

### 1. Generate Images Locally
If you want to regenerate the restaurant images, you can run the image generation script:
1. Ensure you are authenticated with Google Cloud:
   ```bash
   gcloud auth application-default login
   ```
2. Run the image generation script to populate `frontend/public/images/berlin/`:
   ```bash
   python3 scripts/generate_images_real.py
   ```

### 2. Upload to GCS and Make Public
To upload the generated images to a new GCS bucket and make them public:
1. Define your bucket name:
   ```bash
   export BUCKET_NAME="vibe-coding-berlin-images"
   ```
2. Create the bucket with Uniform Bucket-Level Access:
   ```bash
   gcloud storage buckets create gs://$BUCKET_NAME --location=us-central1 --uniform-bucket-level-access
   ```
3. Upload the images:
   ```bash
   gcloud storage cp -r frontend/public/images/berlin gs://$BUCKET_NAME/images/
   ```
4. Grant public read access to the bucket (bypassing Domain Restricted Sharing if needed by configuring this at the project/org level first):
   ```bash
   gcloud storage buckets add-iam-policy-binding gs://$BUCKET_NAME --member=allUsers --role=roles/storage.objectViewer
   ```
5. Update `GCS_BUCKET_NAME` in `scripts/generate_catalog.py` and run it to regenerate the CSV with the new GCS URLs:
   ```bash
   python3 scripts/generate_catalog.py
   ```