# ---------- Stage 1: Build ----------
FROM node:22.12.0-alpine AS builder
WORKDIR /app

# Copy only necessary workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY backend/package.json backend/tsconfig.json backend/prisma ./backend/
COPY shared/package.json ./shared/

# Copy source
COPY backend ./backend
COPY shared ./shared

# Install pnpm
RUN npm install -g pnpm@10.18.0

# Install backend + shared deps only
RUN pnpm install --filter backend...

# Build backend
WORKDIR /app/backend
RUN pnpm run build

# ---------- Stage 2: Runtime ----------
FROM node:22.12.0-alpine
WORKDIR /app

# Copy required build artifacts
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/shared ./shared
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm install -g pnpm@10.18.0

RUN pnpm install --filter backend --prod --ignore-scripts

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
