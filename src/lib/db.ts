import "server-only";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { createPrismaAdapter } from "@/lib/prisma-adapter";

function createPrismaClient() {
  return new PrismaClient({ adapter: createPrismaAdapter() });
}

// Reuse one client per process so dev hot-reloads don't exhaust connections.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}