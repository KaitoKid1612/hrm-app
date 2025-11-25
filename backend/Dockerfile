# ---------- Stage 1: Build ----------
FROM node:22.12.0-alpine AS builder
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY backend ./backend
COPY shared ./shared

# Enable corepack and check pnpm
RUN npm install -g pnpm@9.12.3 && pnpm --version

# Install only backend + shared deps
RUN pnpm install --filter backend...

WORKDIR /app/backend

# Build TypeScript
RUN pnpm run build

# ---------- Stage 2: Runtime ----------
FROM node:22.12.0-alpine
WORKDIR /app

# Copy only build output + essential files
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/shared ./shared

# Install pnpm manually (bypass Corepack)
RUN npm install -g pnpm@9.12.3 && pnpm --version
RUN pnpm install --filter backend --prod --ignore-scripts

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
