[👈 README.md](../README.md)

# Deploy

1. Create a new Supabase Project at the Dashboard.

---

2. Enable [Database Webhooks in Supabase](https://supabase.com/dashboard/project/_/database/hooks):
   <img src="/docs/enable-webhooks.png" />

---

3. Update email templates on [Supabase Email Templates](https://supabase.com/dashboard/project/_/auth/templates)
   with contents from [supabase/templates](/supabase/templates/). This is required
   because we're doing PKCE since we're server rendering. Default email templates
   from supabase [don't work](https://supabase.com/docs/guides/auth/auth-email-templates#redirecting-the-user-to-a-server-side-endpoint).
   <img src="/docs/email-templates.png" />

---

4. Update Github's _Environment Secrets_ with Project keys `SUPABASE_ACCESS_TOKEN`,
   `SUPABASE_DB_PASSWORD`, and `SUPABASE_PROJECT_ID`. You can setup **_staging_**
   and **_production_** environments.
   <img src="/docs/environment-secrets.png" />

---

5. Trigger Github Action to run migrations in the Environment you want to deploy.
   <img src="/docs/trigger-github-action.png" />

---

6. Create a new _App Platform_ Project in [DigitalOcean](https://cloud.digitalocean.com/)
   and link it to this repository for automatic deploys. Dont forget to add the _Environment
   Variables_ specified in [.env.example](/.env.example) when setting up the project.

---

7. Once the App Platform Project has deployed, _update webhook urls_ in
   [Supabase Database Webhooks config](https://supabase.com/dashboard/project/_/database/hooks)
   to point to the newly deployed app.
   <img src="/docs/update-webhooks-urls.png" />

---

8. Update [Supabase Authentication URL Configuration](https://supabase.com/dashboard/project/_/auth/url-configuration)
   to point to the newly deployed app.
   <img src="/docs/url-configuration.png" />

---

9. Invite your first user and start using the app.
   <img src="/docs/invite-user.png" />
