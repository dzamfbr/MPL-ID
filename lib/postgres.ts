import { Pool, type QueryResultRow } from "pg";

declare global {
  var __mplIdPostgresPool: Pool | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL belum diatur.");
  }

  return databaseUrl;
}

export function getPostgresPool() {
  if (!global.__mplIdPostgresPool) {
    global.__mplIdPostgresPool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return global.__mplIdPostgresPool;
}

export async function queryPostgres<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  const result = await getPostgresPool().query<T>(text, values);

  return result.rows;
}
