import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseInfo = await database.query(
    `SELECT
    current_setting('server_version') AS server_version,
    current_setting('max_connections')::int AS max_connections,
    (SELECT count(*)::int FROM pg_stat_activity WHERE state = 'active') AS current_connections;
    `,
  );

  const databaseVersionValue = databaseInfo.rows[0].server_version;
  const databaseMaxConnections = databaseInfo.rows[0].max_connections;
  const databaseOpenedConnectionsValue =
    databaseInfo.rows[0].current_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnections,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
