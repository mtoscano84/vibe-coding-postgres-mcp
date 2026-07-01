# Project Rules & Guidelines

## Database Connections
- When configuring a PostgreSQL/AlloyDB connection pool (e.g., using the `pg` library), always enable SSL for non-local connections to ensure compatibility with AlloyDB's default encryption requirement.
- Use the following pattern to allow both local development and secure cloud connection:
  ```typescript
  ssl: process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost'
    ? { rejectUnauthorized: false }
    : false
  ```

## TypeScript & Dependencies
- This is a TypeScript project. Whenever you install the `pg` library, you MUST also install `@types/pg` as a devDependency (`npm install -D @types/pg`) to prevent TypeScript compilation and type-checking errors during the build.

