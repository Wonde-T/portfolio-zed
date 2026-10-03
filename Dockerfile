# syntax=docker/dockerfile:1

# ---- base ----------------------------------------------------------------
FROM node:22-alpine AS base
WORKDIR /app

# ---- deps ----------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./
RUN npm ci

# ---- builder -------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are inlined into the bundles by `next build`, so they have
# to exist *here* — the runtime environment of the runner cannot change them.
# docker-compose passes them from your .env.
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY=""
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME \
    NEXT_PUBLIC_CLOUDINARY_API_KEY=$NEXT_PUBLIC_CLOUDINARY_API_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The generated Prisma client lives outside node_modules, so it must exist
# before `next build` traces the server bundle.
RUN npx prisma generate
RUN npm run build

# ---- runner --------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

RUN mkdir -p ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

# ---- migrate -------------------------------------------------------------
# Runs `prisma migrate deploy` + seed, then exits. Keeps the Prisma CLI (and
# its native engine) out of the runtime image.
FROM base AS migrate
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json prisma7.config.ts ./
COPY prisma ./prisma
# The seed imports the generated client plus the adapter/section helpers.
COPY lib ./lib
RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]