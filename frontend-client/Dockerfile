# ---------- Build ----------
FROM node:22.12.0-alpine AS builder
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY frontend-client/package.json frontend-client/tsconfig.json ./frontend-client/
COPY shared/package.json ./shared/

COPY frontend-client ./frontend-client
COPY shared ./shared

RUN npm install -g pnpm@10.18.0

RUN pnpm install --filter frontend-client...

WORKDIR /app/frontend-client
RUN pnpm run build

# ---------- Serve ----------
FROM nginx:1.27.1-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/frontend-client/dist ./
COPY nginx-client.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
