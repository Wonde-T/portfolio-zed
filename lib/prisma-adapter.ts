import { PrismaMariaDb } from "@prisma/adapter-mariadb";

type ConnectionOptions = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  allowPublicKeyRetrieval: boolean;
  connectTimeout: number;
  connectionLimit: number;
};

/**
 * Builds the MariaDB/MySQL driver configuration from `DATABASE_URL`.
 *
 * Kept separate from `lib/db.ts` so the Prisma CLI seed can reuse it without
 * importing `server-only`, which throws outside a React Server Component.
 *
 * The shape is declared locally rather than importing `PoolConfig` from
 * `mariadb`: the adapter depends on its own copy of the driver, and the two
 * `PoolConfig` declarations are not assignable to each other.
 */
function getConnectionOptions(connectionLimit: number): ConnectionOptions {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }

  const url = new URL(connectionString);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    // MySQL 8 defaults to caching_sha2_password. Over the unencrypted Docker
    // network the connector must fetch the server's public key to authenticate.
    allowPublicKeyRetrieval: true,
    connectTimeout: 10_000,
    connectionLimit,
  };
}

export function createPrismaAdapter(connectionLimit = 5) {
  return new PrismaMariaDb(getConnectionOptions(connectionLimit));
}