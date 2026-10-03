import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read directly rather than via `env()` so that `prisma generate` works in
    // the Docker build, where no database is reachable yet.
    url: process.env.DATABASE_URL,
  },
});