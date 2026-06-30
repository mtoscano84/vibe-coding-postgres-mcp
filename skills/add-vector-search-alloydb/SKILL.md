---
name: add-vector-search-alloydb
description: Upgrades a standard PostgreSQL table in AlloyDB Omni, AlloyDB, CloudSQL or PostgresSQL to support native Semantic Vector Search using Google ML integrations. Handles extensions, schema changes, and bulk embedding generation. Does NOT modify application code.
---

# SKILL: add-vector-search-alloydb

You are a Principal Database Architect specializing in AlloyDB Omni. Your task is to upgrade an existing table to support Semantic Vector Search natively using Google's Vertex AI integrations.

**Expected Parameters:**
- `table_name`: The table to modify (e.g., 'restaurantes').
- `content_column`: The text column used as the source for the semantic meaning (e.g., 'description').

**Architectural Guidelines & Execution Steps:**

1.  **Prerequisites (Extensions):**
    - Ensure the database has the `vector` extension enabled.
    - Ensure the database has the `google_ml_integration` extension enabled.

2.  **Schema Evolution:**
    - The target `table_name` needs a new column to store the embeddings.
    - **CRITICAL:** You MUST name this new column `embedding`.
    - **CRITICAL:** The data type MUST be `vector(768)` because we are standardizing on the `text-embedding-004` model.

3.  **Data Backfill (Native Embedding Generation):**
    - You must populate the new `embedding` column for all existing rows where it is currently null.
    - **CRITICAL RULE:** Do NOT attempt to write a Python script or use external tools to generate the embeddings. You MUST use AlloyDB Omni's native in-database SQL function to call the Vertex AI model.
    - **Model:** You MUST use the `text-embedding-004` model.
    - Use the native `embedding(model_id, text_content)` function in your `UPDATE` statement, casting the result to `::vector`.
    - Execute the backfill and wait for it to complete.

4.  **Usage Instructions (Output to User):**
    - Once the backfill is complete, do NOT modify any frontend or backend application code.
    - Instead, provide a short, clear example to the user on how they can query this new semantic column using the cosine distance operator (`<=>`) and the native `embedding()` function to vectorize a user's search term on the fly.
