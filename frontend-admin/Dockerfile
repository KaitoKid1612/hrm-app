# ---------- Build ----------
FROM node:20.17.0-alpine AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend-admin ./frontend-admin
COPY shared ./shared

# ✅ Bỏ corepack, cài pnpm thủ công
RUN npm install -g pnpm@9.12.3 && pnpm --version

RUN pnpm install --filter frontend-admin...
RUN pnpm --filter frontend-admin run build

# ---------- Runtime ----------
FROM node:20.17.0-alpine
WORKDIR /app

COPY --from=builder /app/frontend-admin ./
RUN npm install -g pnpm@9.12.3 && pnpm --version
RUN pnpm install --prod --ignore-scripts

EXPOSE 3000
CMD ["pnpm", "start"]
