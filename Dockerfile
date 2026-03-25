# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# --- CONFIGURAÇÃO DE AMBIENTE (Injetada pelo Cloud Build) ---
# 1. Declara que o Dockerfile espera receber este argumento (--build-arg)
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME

# 2. Transforma o argumento em uma variável de ambiente real para o Next.js ler
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
# -----------------------------------------------------------

# O comando de build agora tem acesso à variável (ex: HML) e vai embuti-la no JS
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY public ./public

# Nota: NODE_ENV=production indica ao Node para rodar otimizado. 
# Isso não conflita com o seu NEXT_PUBLIC_ENVIRONMENT=HML.
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node_modules/.bin/next", "start"]