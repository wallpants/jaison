[👈 README.md](../README.md)

# Development

## ✅ Requirements

- [x] [Bun](https://bun.sh)
- [x] [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- [x] [Docker Desktop](https://www.docker.com/products/docker-desktop)

## 👷 Configure Environments

### Local Development

There are certain restrictions when working in a local environment. Haven't found
a way to make files uploaded to Supabase's Storage available to outside services,
meaning we can't send the audio files to _rev.ai_.

Deploy to a _staging_ environment to test the entire workflow.

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

<img src="/docs/update-webhooks-urls.png" />

### Seed

Run [seed scripts](/drizzle/seed/):

```sh
bun drizzle:seed
```

Remote databases can also be seeded by updating `.env` to point to them.

### Local Schema Changes

You can do quick database schema iterations by modifying the
[schema files](/app/schemas/database/) and running the command:

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

We're doing PKCE (Proof Key for Code Exchange) because we're doing server rendering.
Default email templates from supabase [don't work](https://supabase.com/docs/guides/auth/auth-email-templates#redirecting-the-user-to-a-server-side-endpoint).

For local development update templates at [/supabase/templates](/supabase/templates/).
Don't forget to update [/supabase/config.toml](/supabase/config.toml) to declare
template overrides.
