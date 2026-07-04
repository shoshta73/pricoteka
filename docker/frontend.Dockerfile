FROM node:24-alpine3.24 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/core/package.json ./packages/core/
COPY apps/frontend/package.json ./apps/frontend/

RUN corepack enable
RUN pnpm install --frozen-lockfile

FROM deps AS build

WORKDIR /app
ARG VITE_APP_MODE=api
ARG VITE_API_URL=/api
ENV VITE_APP_MODE=$VITE_APP_MODE
ENV VITE_API_URL=$VITE_API_URL

COPY packages/core ./packages/core
COPY apps/frontend ./apps/frontend

RUN pnpm --filter @pricoteka/app generate:build-scripts
RUN pnpm --filter @pricoteka/app exec node build/dist/validate-i18n.js
RUN pnpm --filter @pricoteka/app generate:routes
RUN pnpm --filter @pricoteka/app exec tsc -b
RUN pnpm --filter @pricoteka/app exec vite build

FROM caddy:2.11.4-alpine AS runtime

COPY docker/frontend.Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/frontend/dist /srv
