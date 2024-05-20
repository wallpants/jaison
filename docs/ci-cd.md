[👈 README.md](../README.md)

# CI-CD

## Database

There's a [Github Action](/.github/workflows/migrate-production.yml) that applies
any pending migrations on push to `main` for _production_ or on manual trigger.
There's another Github Action that handles the same for _staging_ on push to the
`staging` branch.

## Remix App

Remix App is deployed to [DigitalOcean's App Platform](https://www.digitalocean.com/products/app-platform),
which handles re-deploying on push to linked branch.

## GitHub Workflow

This is the workflow to follow to have `main` as the _production_ environment,
`staging` as the _staging_ environment.

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
   using the "Rebase and merge" strategy and delete your feature branch.

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
