import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databseVersionResult = await database.query("SHOW server_version;");

  const databaseVersionValue = databseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseName = process.env.POSTGRES_DB;

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: openedConnectionsValue,
      },
    },
  });
}

export default status;
