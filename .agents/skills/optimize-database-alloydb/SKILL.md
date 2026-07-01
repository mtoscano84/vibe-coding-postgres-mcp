---
name: optimize-database-alloydb
description: Upgrades an existing PostgreSQL database to production-grade standards. Applies an HNSW index for robust vector search performance and implements declarative table partitioning for scalability.
---

# SKILL: optimize-database-alloydb

You are a Principal Database Administrator specializing in PostgreSQL. Your task is to optimize an existing database schema for production workloads, ensuring maximum stability in local development environments.

**Expected Parameters:**
- `table_name`: The main table to optimize (e.g., 'restaurantes').
- `vector_column`: The column containing the embeddings (e.g., 'embedding').
- `partition_column`: The column to use for partitioning (e.g., 'neighborhood').

**Execution Steps (You MUST strictly follow these):**

1.  **Vector Search Optimization (HNSW Index):**
    - We will use the industry-standard HNSW index provided by `pgvector` to ensure cross-architecture stability while delivering massive performance gains over sequential scans.
    - Connect to the database and verify the `vector` extension is enabled (it should be).
    - Create an HNSW index on the `{vector_column}` using the cosine distance operator class (`vector_cosine_ops`).
    - **CRITICAL:** Use this exact syntax: 
      `CREATE INDEX idx_{table_name}_hnsw ON {table_name} USING hnsw ({vector_column} vector_cosine_ops) WITH (m = 16, ef_construction = 64);`
      *(Note: These parameters provide a good balance of build speed and recall for a demo dataset).*

2.  **Scalability Optimization (Declarative Partitioning):**
    - You must convert the existing `{table_name}` into a partitioned table based on the `{partition_column}` (List Partitioning).
    - Since PostgreSQL cannot directly convert a standard table to a partitioned one, you must follow the standard migration pattern:
      a) Rename the existing table: `ALTER TABLE {table_name} RENAME TO {table_name}_old;`
      b) Create the new partitioned table with the exact same schema as the old one, but add `PARTITION BY LIST ({partition_column})`. Include the `vector(768)` column.
      c) Create at least 3 partition tables for the most common values in the `{partition_column}` (e.g., 'Kreuzberg', 'Mitte', 'Neukölln') and one default partition:
         `CREATE TABLE {table_name}_kreuzberg PARTITION OF {table_name} FOR VALUES IN ('Kreuzberg');`
         `CREATE TABLE {table_name}_default PARTITION OF {table_name} DEFAULT;`
      d) Copy the data from the old table to the new partitioned table:
         `INSERT INTO {table_name} SELECT * FROM {table_name}_old;`
      e) (Optional but recommended) Drop the old table: `DROP TABLE {table_name}_old;`

3.  **Re-apply Indexes:**
    - Re-create the HNSW index (from Step 1) on the newly partitioned `{table_name}` so the performance benefits apply to the new distributed structure. 
    - Use the same syntax: `CREATE INDEX idx_{table_name}_partitioned_hnsw ON {table_name} USING hnsw ({vector_column} vector_cosine_ops) WITH (m = 16, ef_construction = 64);`

4.  **Completion:**
    - Verify the data migration was successful. No frontend code changes are required.