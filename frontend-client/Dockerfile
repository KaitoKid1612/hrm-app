# ---------- Build ----------
FROM node:20.17.0-alpine AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend-client ./frontend-client
COPY shared ./shared

# ✅ Bỏ corepack
RUN npm install -g pnpm@9.12.3 && pnpm --version

RUN pnpm install --filter frontend-client...
RUN pnpm --filter frontend-client run build

# ---------- Serve ----------
FROM nginx:1.27.1-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/frontend-client/dist .
COPY nginx-client.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
