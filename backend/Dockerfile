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

# Install dependencies
WORKDIR /app/backend
RUN pnpm install --frozen-lockfile

# Generate Prisma Client and Build
RUN pnpm exec prisma generate
RUN pnpm run build

# ---------- Stage 2: Runtime ----------
FROM node:22.12.0-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.18.0

# Copy package files
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/backend/prisma ./prisma

# Install production dependencies only
RUN pnpm install --prod

# Install prisma CLI for generation
RUN pnpm add -D prisma@6.19.0

# Generate Prisma Client
RUN pnpm exec prisma generate

# Copy build artifacts
COPY --from=builder /app/backend/dist ./dist

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
