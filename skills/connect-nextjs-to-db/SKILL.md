---
name: connect-nextjs-to-db
description: Transforms a static Next.js frontend into a live application by generating React Server Actions that connect to a PostgreSQL database.
---

# SKILL: connect-nextjs-to-db

You are an expert Full-Stack Engineer. Your task is to replace mock static data with live database data in a Next.js application.

**Expected Parameters from User:**
- `table_name`: The database table to query (e.g., 'restaurantes').
- `search_columns`: Array of columns to use for ILIKE text search (e.g., ['name', 'neighborhood', 'description']).
- `connection_string`: The DB URL (e.g., 'postgresql://postgres:supersecret@localhost:5432/restguidedb').

**Execution Steps (You MUST strictly follow these):**

1.  **Dependencies:** Ensure the `pg` package is installed in the `/frontend` directory. Install it if missing.

2.  **Backend Logic (Server Action):** 
    - Create a new file `frontend/app/actions.ts`.
    - Add `'use server'` at the top.
    - Initialize a `pg.Pool` using the provided `connection_string`.
    - Create an exported async function `fetchData(searchTerm?: string)`.
    - Implement a SQL query that selects all records from the `table_name`.
    - If `searchTerm` exists, append a `WHERE` clause using `ILIKE` dynamically across all provided `search_columns`.

3.  **Frontend Logic (Client Component):**
    - `page.tsx` is a Client Component. You must add state to manage the data.
    - Use `useState` to manage the `searchTerm` string and the `restaurants` data array.
    - Use a `useEffect` hook to call `fetchData()` ONCE on initial component mount to load the default data into the `restaurants` state.
    - **CRITICAL SEARCH LOGIC:** Bind the execution of `fetchData(searchTerm)` EXCLUSIVELY to the `onSubmit` event of the existing `<form>` element.

4.  **UI Code Modification (Your Most Important Task):**
    - You are **FORBIDDEN** from rewriting the overall JSX structure or altering the "Neon Tech" Tailwind CSS classes.
    - **CRITICAL IMAGE REPLACEMENT:**
        a) Locate the `<div>` inside the `.map()` loop that currently contains the placeholder logo (`/logo.png`).
        b) You **MUST DELETE** this entire placeholder `<div>` block.
        c) In its place, you **MUST INSERT** a new `<div>` containing a standard HTML `<img>` tag to display the restaurant's photo from the database.
        d) The `src` attribute of this new `<img>` tag **MUST** be the `image_path` field from the database record (`item.image_path`). The path is already correct, so do not modify it.
        e) The new `<img>` tag should be styled to fill its container while maintaining aspect ratio and having a smooth zoom effect on hover. Use these exact classes: `className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"`.
    - Finally, find the line `mockRestaurants.map((item) => (` and replace the `mockRestaurants` variable with your new `restaurants` state variable.
