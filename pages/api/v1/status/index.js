import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const databaseName = process.env.POSTGRES_DB;
    const updatedAt = new Date().toISOString();
    const result = await database.query({
      text: `
    SELECT
      current_setting('server_version') AS version,
      current_setting('max_connections')::int AS max_connections,
      (SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1) AS used_connections;
  `,
      values: [databaseName],
    });
    const dbInfo = result.rows[0];
    response.status(200).json({
      updated_at: updatedAt,
      database: {
        version: dbInfo.version,
        max_connections: dbInfo.max_connections,
        used_connections: parseInt(dbInfo.used_connections, 10),
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log(`\n Erro dentro do catch do controller:`);
    console.log(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}
export default status;
