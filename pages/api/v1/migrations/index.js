import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  await runMigrations(request, response, true);
}

async function postHandler(request, response) {
  await runMigrations(request, response, false);
}

async function runMigrations(request, response, dryRun) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: dryRun,
      dir: resolve(process.cwd(), "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migrations = await migrationRunner(defaultMigrationOptions);

    if (!dryRun && migrations.length > 0) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  } finally {
    await dbClient.end();
  }
}
