# Development

## ✅ Requirements

- [x] [Bun](https://bun.sh)
- [x] [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- [x] [Docker Desktop](https://www.docker.com/products/docker-desktop)

## 👷 Configure Environments

### Local Development

1. Start local **supabase**:

   ```sh
   supabase start
   ```

2. Create `.env` file and fill variables:

   ```sh
   cp .env.example .env
   ```

3. Start **remix** dev server:

   ```sh
   bun dev
   ```

### Staging

1. Create new Supabase Project in Dashboard

2. Create `staging` environment in GitHub repo Settings and configure any required
   _variables_ and _secrets_. Take a look at [github workflows](./.github/workflows/)
   to see what's needed.

3. Create new [App Platform](https://www.digitalocean.com/products/app-platform)
   project and link to GitHub repo `staging` branch for automatic deployments.
   Setup required _environment variables_. Take a look at [.env.example](./.env.example)
   to see what's needed.

### Production

Repeat **Staging** steps whilst changing variables where needed.

## Database

### New Tables

Whenever a new database table is added, be sure to enable RLS (Row Level Security).
This prevents any access to the data from the supabase clients. We're okay with
that and don't have to specify any policies, because **drizzle** bypasses RLS.

All interactions with the database must happen through **drizzle**.

### Webhooks

You can get [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
working locally by pointing to `host.docker.internal` instead of `localhost` in
Supabase Dashboard.

```sh
bun dev --host
```

<img src="./docs/database_webhooks.png" alt="database webhooks"/>

### Seed

Run [seed scripts](./drizzle/seed/):

```sh
bun drizzle:seed
```

Remote databases can also be seeded by updating `.env` to point to them.

### Local Schema Changes

You can do quick database schema iterations by modifying the
[schema files](./app/schemas/database/) and running the command:

```sh
bun drizzle:push
```

### Remote Schema Changes

#### Generate migration file

This command runs a diff from the current state of the database to what the database
would look like if only migration files are applied. Meaning if there are any changes
that are not covered by the existing migrations, the generated migration file
should include those changes.

```sh
supabase db diff | supabase migration new {schema_name}
```

Migration files are to be commited and they're applied on remote environments by
a GitHub action.

## Authentication

We're doing PKCE (Proff Key for Code Exchange) because we're doing server rendering.
Default email templates from supabase [don't work](https://supabase.com/docs/guides/auth/auth-email-templates#redirecting-the-user-to-a-server-side-endpoint).

For local development update templates at [/supabase/templates](./supabase/templates/).
Don't forget to update [/supabase/config.toml](./supabase/config.toml) to declare
template overrides.

For remote environments, update templates at [Supabase Dashboard Email Templates](https://supabase.com/dashboard/project/_/auth/templates).

## GitHub Workflow

1. Create a new branch from `staging` for your `feature` work:

   ```sh
   git checkout staging
   git pull
   git checkout -b feature/add-modals
   ```

2. Work on your `feature` branch, making commits as needed.

3. When the feature is complete, push the `feature` branch to GitHub and create a
   pull request from the `feature` branch to `staging`.

4. After the pull request is reviewed and approved, merge it into `staging`
   using the "Rebase and merge" strategy.

5. Once the changes are verified in the `staging` branch, create a pull request
   from `staging` to `main`, review it, and merge it using the "Rebase and merge"
   strategy.

6. After merging `staging` into `main`, update the `staging` branch with the
   latest changes from `main`:

   ```sh
   git checkout staging
   git pull origin main --rebase
   git push --force-with-lease origin staging
   ```

7. Now, both branches (`staging` and `main`) are in sync,
   and you can start working on a new feature by creating a new branch from the
   updated `staging` branch.
