
# Vercel Deployment Guide

This project is configured to deploy on Vercel using Supabase as the database.

## Prerequisites

1.  **Supabase Project:** Create a new project on [Supabase](https://supabase.com).
2.  **Database Setup:** Run the following SQL in your Supabase SQL Editor to create the required table:

```sql
create table json_store (
  key text primary key,
  data jsonb
);
```

3.  **Environment Variables:**
    Add the following environment variables to your Vercel project settings:
    *   `SUPABASE_URL`: Your project URL.
    *   `SUPABASE_KEY`: Your `anon` public key.
    *   `JWT_SECRET`: A secure random string for session tokens.

## Deployment

1.  Push this repository to GitHub/GitLab/Bitbucket.
2.  Import the project into Vercel.
3.  Vercel will automatically detect the `vercel.json` and deploy the API as Serverless Functions.
4.  The frontend will be built using Vite and served as static assets.

## Notes

*   The application uses a `json_store` table to mimic the original file-based database structure. This ensures compatibility with the existing backend logic without a full rewrite.
*   The `backend_core` folder contains the business logic and API routes.
*   The `api` folder contains the Vercel entry point.
