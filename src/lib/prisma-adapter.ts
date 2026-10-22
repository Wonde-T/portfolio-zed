import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Builds the PostgreSQL driver configuration from `DATABASE_URL`.
 *
 * Kept separate from `src/lib/db.ts` so the Prisma CLI seed can reuse it without
 * importing `server-only`, which throws outside a React Server Component.
 */
function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }

  return connectionString;
}

export function createPrismaAdapter(connectionLimit = 5) {
  return new PrismaPg({
    connectionString: getConnectionString(),
    max: connectionLimit,
    connectionTimeoutMillis: 10_000,
  });
}
