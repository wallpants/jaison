# Deployment

1. Create a new Supabase Project at the Dashboard

2. Enable [Database Webhooks in Supabase](https://supabase.com/dashboard/project/_/database/hooks).
   <img src="docs/enable-webhooks.png" alt="enable-webhooks" />

3. Update Github's _Environment Secrets_ with Project keys `SUPABASE_ACCESS_TOKEN`,
   `SUPABASE_DB_PASSWORD`, and `SUPABASE_PROJECT_ID`.

   You can setup **_staging_** and **_production_** environments.
   <img src="docs/environment-secrets.png" alt="environment-secrets" />
