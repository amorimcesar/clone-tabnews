import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

function getDefaultMigrationOptions(dbClient, dryRun) {
  return {
    dbClient: dbClient,
    dryRun: dryRun,
    dir: resolve(process.cwd(), "infra", "migrations"),
    direction: "up",
    log: () => {},
    migrationsTable: "pgmigrations",
  };
}

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationOptions = {
      ...getDefaultMigrationOptions(dbClient, true),
    };

    const pendingMigrations = await migrationRunner(migrationOptions);
    return pendingMigrations;
  } catch (error) {
    throw new ServiceError({
      message: "Não foi possível listar as migrações pendentes.",
      cause: error,
    });
  } finally {
    await dbClient.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrationOptions = {
      ...getDefaultMigrationOptions(dbClient, false),
    };

    const executedMigrations = await migrationRunner(migrationOptions);
    return executedMigrations;
  } catch (error) {
    throw new ServiceError({
      message: "Não foi possível executar as migrações pendentes.",
      cause: error,
    });
  } finally {
    await dbClient.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
