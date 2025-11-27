# ---------- Build ----------
FROM node:22.12.0-alpine AS builder
WORKDIR /app

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY frontend-admin ./frontend-admin
COPY shared ./shared

RUN npm install -g pnpm@9.12.3 && pnpm --version
RUN pnpm install --filter frontend-admin...
RUN pnpm --filter frontend-admin run build

# ---------- Runtime ----------
FROM node:22.12.0-alpine
WORKDIR /app

COPY --from=builder /app/frontend-admin/.next ./.next
COPY --from=builder /app/frontend-admin/public ./public
COPY --from=builder /app/frontend-admin/package.json ./
COPY --from=builder /app/shared ./shared

RUN npm install -g pnpm@9.12.3
RUN pnpm install --prod --filter frontend-admin --ignore-scripts

EXPOSE 3000
CMD ["pnpm", "start"]
