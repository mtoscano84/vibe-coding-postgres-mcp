# Vibe Coding Demo Prompts (Berlin AI Gastronomy Guide)

These are the exact prompts used in the live demonstration to build the application from scratch using the Antigravity IDE and the Model Context Protocol (MCP).

You can copy and paste these directly into your agent's chat window to replicate the workflow.

---

### Step 1: Database Initialization & Data Ingestion
**Goal:** Abstract the complexity of creating tables and importing data from CSV files.

```text
Read the headers of `database/seed_data_berlin.csv`. Connect via the MCP tool to the database, create a database named `restguidedb` if it doesn't exist, and create a table named `restaurants` in it with the correct data types. Then, load all the records from the CSV file into the table.
```

---

### Step 2: Backend Integration
**Goal:** Connect the Next.js frontend to the live database, replacing the mock data.

```text
Connect our Next.js frontend to our new `restaurants` table in the `restguidedb` database using a connection pool (use the `pg` library, password is '[YOUR_PASSWORD]' at host '127.0.0.1' and port 5432). Replace the hardcoded mock data in `page.tsx` with a live query to the database, and implement keyword search on the restaurant name, category, and description.
```

---

### Step 3: Enable Semantic Vector Search
**Goal:** Enable semantic search capabilities using Vertex AI embeddings.

```text
Upgrade our database to support Semantic Vector Search. Enable the pgvector extension, register the Vertex AI embedding model in AlloyDB using `google_ml_integration`, generate embeddings for the restaurant descriptions, and update our search query to use vector similarity search.
```

---

### Step 4: Database Optimization (Virtual DBA)
**Goal:** Optimize the database for performance using vector indexes and partitioning.

```text
Act as a Principal Database Architect. Our semantic search is working, but we need to optimize the database for production scale. Analyze our current schema. What are the top 2 database-schema optimizations you recommend we implement right now? Explain them to me and wait for my approval before modifying the database.
```

*(Note: Once the agent replies with its recommendations—likely HNSW indexing and Partitioning—you can reply with "Approved, please apply these optimizations" to let the agent execute the DDL).*