# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala TODO (incluyendo devDeps) para poder compilar
RUN npm ci --legacy-peer-deps

COPY . .

# Elimina archivos .env locales antes de buildear
RUN rm -f .env .env.local .env.production

# Genera el cliente de Prisma y compila TypeScript
RUN npx prisma generate
RUN npm run build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

COPY package*.json ./

# Solo instala dependencias de producción
RUN npm ci --omit=dev --legacy-peer-deps

# Copia el build compilado desde el stage builder
COPY --from=builder /app/dist ./dist

# Copia el schema y las migraciones de Prisma (necesario para migrate deploy)
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma.config.ts ./

# Copia el cliente ya generado desde el builder ✅
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

# Corre las migraciones pendientes y luego levanta el binario compilado
CMD ["sh", "-c", "DATABASE_URL=$DATABASE_URL_BACK npx prisma migrate deploy && node dist/src/main"]