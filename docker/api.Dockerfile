FROM node:24-alpine3.24 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/core/package.json ./packages/core/
COPY apps/api/package.json ./apps/api/

RUN corepack enable
RUN pnpm install --frozen-lockfile

FROM deps AS build

WORKDIR /app

COPY packages/core ./packages/core
COPY apps/api ./apps/api

RUN pnpm --filter @pricoteka/api build

FROM node:24-alpine3.24 AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/package.json ./apps/api/package.json
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/packages/core ./packages/core
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/drizzle ./apps/api/drizzle
COPY --from=build /app/apps/api/drizzle.config.ts ./apps/api/drizzle.config.ts

WORKDIR /app/apps/api
EXPOSE 3000

CMD ["node", "dist/index.js"]
