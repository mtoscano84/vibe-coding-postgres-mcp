# Vibe Coding Demo Prompts

These are the exact prompts used in the live demonstration to build the application from scratch using the Antigravity IDE and the Model Context Protocol (MCP).

You can copy and paste these directly into your agent's chat window to replicate the workflow.

---

### Step 1: Database Initialization & Data Ingestion
**Goal:** Abstract the complexity of creating tables and importing data from CSV files.

```text
Lee las cabeceras del seed_data_madrid.csv. Conéctate vía MCP a la base de datos restguidedb, crea la tabla restaurantes en AlloyDB Omni con los tipos de datos correctos, y luego genera y ejecuta el comando de Postgres (\copy o COPY) para importar todo el archivo.
```

---

### Step 2: Backend Integration
**Goal:** Connect the Next.js frontend to the live database, replacing the mock data.

```text
Actúa como un Ingeniero Full-Stack Principal.
Nuestro frontend de Next.js actualmente muestra datos mock estáticos. Conéctalo a nuestro catálogo de 'restaurantes' en la base de datos 'restguidedb'.
Los usuarios deben poder buscar por nombre, barrio o descripción.
(La contraseña de la base de datos es 'pgpwd' en el puerto 5432)
```

---

### Step 3: Advanced Search with Vector Search
**Goal:** Enable semantic search capabilities using Vertex AI embeddings.

```text
Nuestros usuarios se quejan de que buscar 'cena romántica' no devuelve resultados porque se realizan búsquedas por palabras clave exactas. Por favor, actualiza nuestra base de datos de AlloyDB para soportar la Búsqueda Semántica Vectorial en el catálogo de 'restaurantes' basándote en sus descripciones.
```

---

### Step 4: Frontend Integration
**Goal:** Update the frontend to utilize the new semantic search capabilities.

```text
Ahora haz que el frontend utilice este nuevo superpoder semántico. Cuando un usuario busque, la aplicación debe encontrar restaurantes basándose en el significado de su consulta, no en las palabras exactas. Reemplaza la antigua lógica de búsqueda por similitud vectorial.
```

---

### Step 5: Production Optimizations
**Goal:** Optimize the database for performance using vector indexes and partitioning.

```text
Actúa como un Arquitecto de Bases de Datos Principal para Google Cloud.
Nuestra búsqueda semántica en la tabla `restaurantes` funciona perfectamente para un conjunto de datos pequeño. Sin embargo, nos estamos preparando para un lanzamiento que escalará la tabla a más de 100,000 filas y manejará búsquedas masivas de usuarios concurrentes.
Analiza nuestra configuración actual. ¿Cuáles son las 2 principales optimizaciones de esquema de base de datos que recomiendas implementar ahora mismo y explícame por qué?
(Mantén tu respuesta breve, centrándote en la capa de la base de datos. Espera mi aprobación antes de modificar la base de datos).
```