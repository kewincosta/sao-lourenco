# syntax=docker/dockerfile:1

# ---------- Stage 1: builder ----------
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

WORKDIR /app

# Builder não é um repo git: desliga lifecycle scripts (ex.: o `prepare: lefthook
# install` da raiz, que falha sem `.git`/`git` binário) para todo `pnpm` neste stage.
ENV PNPM_CONFIG_IGNORE_SCRIPTS=true

# Manifests do workspace primeiro (cache de instalação)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN pnpm install --frozen-lockfile --filter @sao-lourenco/api...

# Fontes dos workspaces necessários
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

RUN pnpm -r --filter @sao-lourenco/api... build

# Empacota a api + suas deps de produção (incl. workspace:*) num diretório auto-contido.
# --legacy: a implementação padrão (pnpm 10+) exige `inject-workspace-packages=true`
# já no install; --legacy resolve workspace:* copiando o pacote real sem essa exigência.
RUN pnpm deploy --filter=@sao-lourenco/api --prod --legacy /app/deploy

# Fallback documentado no design: `pnpm deploy` copia o manifest do shared mas não
# considera seu `dist` (artefato de build) como parte do pacote publicável — o
# `main` (`./dist/index.js`) fica ausente. Copia o dist já buildado manualmente.
RUN cp -r /app/packages/shared/dist /app/deploy/node_modules/@sao-lourenco/shared/dist

# ---------- Stage 2: runner ----------
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/deploy ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
