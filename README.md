# São Lourenço — Monorepo (POC)

API RESTful onde usuários publicam serviços que oferecem e outros usuários
visualizam, contatam e avaliam. Arquitetura **MVC modular por domínio**:

```
Request → Controller → Service → Repository → Database
```

POO + SOLID + Repository/Service Layer + Injeção de dependência via Factory
(sem libs de DI). Sem autenticação nesta fase.

## Stack

Node 24 · TypeScript 5 · pnpm workspaces · Fastify 5 · TypeORM 0.3 ·
PostgreSQL 17 · Zod · Axios · Vitest · Supertest · Faker · ESLint 9 (flat) +
Prettier · Lefthook · Docker.

## Estrutura (monorepo pnpm)

```
apps/
├── api/                # @sao-lourenco/api — a API atual (Fastify/TypeORM)
│   └── src/
│       ├── config/         # env (dotenv + validação Zod)
│       ├── shared/         # database, errors, middlewares, utils
│       ├── modules/        # users, services, reviews (controllers, services,
│       │                   # repositories, entities, schemas, routes, factories, tests)
│       ├── test/           # harness determinístico (fake repo + mock do data-source)
│       ├── app.ts          # buildApp() — Fastify + rotas (testável)
│       └── server.ts       # bootstrap — DataSource + migrations + listen
└── web/                 # @sao-lourenco/web — front (React 19 + Vite 7 + Tailwind v4 + shadcn/Radix)

packages/
└── shared/              # @sao-lourenco/shared — contratos/tipos/Zod compartilhados
```

`apps/api` consome `@sao-lourenco/shared` via `workspace:*` (tipos resolvidos
da fonte em dev/typecheck/test, do `dist` em runtime/build). `apps/web` foi
migrado de um clone GitHub Spark para o monorepo pnpm e está funcional —
ver `apps/web/README.md` para stack, comandos (`pnpm --filter @sao-lourenco/web
{dev,build,typecheck,lint}`) e a nota sobre persistência de dados em memória
(sem backend integrado ainda).

## Como rodar (local)

```bash
pnpm install
cp apps/api/.env.example apps/api/.env

# sobe o PostgreSQL (cria também o banco de testes)
docker compose up -d db

# inicia a API em http://localhost:3000 (roda as migrations no boot)
pnpm --filter @sao-lourenco/api dev
```

### Stack completa via Docker

```bash
docker compose up --build      # API + PostgreSQL (build via contexto do workspace)
```

## Comandos do workspace (raiz)

| Comando                           | Efeito                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm install`                    | Linka os workspaces (`apps/*`, `packages/*`); instala os git hooks (Lefthook) |
| `pnpm build`                      | Build topológico de todos os workspaces (`shared` antes de `api`)             |
| `pnpm test`                       | Roda os testes de todos os workspaces                                         |
| `pnpm typecheck`                  | Typecheck de todos os workspaces                                              |
| `pnpm lint` / `pnpm lint:fix`     | ESLint (flat config) em todo o repo                                           |
| `pnpm format` / `pnpm format:fix` | Prettier (check/write) em todo o repo                                         |

Scripts por app/pacote usam `--filter`, ex.: `pnpm --filter @sao-lourenco/api dev`.

## Endpoints (`@sao-lourenco/api`)

| Método | Rota                    | Descrição                 |
| ------ | ----------------------- | ------------------------- |
| POST   | `/users`                | Cria usuário              |
| POST   | `/users/auth`           | Autentica por CPF/CNPJ    |
| PUT    | `/users/:id`            | Atualiza dados do usuário |
| POST   | `/services`             | Publica serviço           |
| GET    | `/services`             | Lista serviços (filtros)  |
| GET    | `/services/:id`         | Detalha serviço           |
| PUT    | `/services/:id`         | Atualiza serviço          |
| DELETE | `/services/:id`         | Remove serviço            |
| POST   | `/services/:id/reviews` | Avalia serviço            |
| GET    | `/health`               | Healthcheck               |

Respostas de erro são padronizadas: `{ statusCode, error, message, details? }`.

## Migrations

```bash
pnpm --filter @sao-lourenco/api migration:generate
pnpm --filter @sao-lourenco/api migration:run
pnpm --filter @sao-lourenco/api migration:revert
```

> O `server.ts` já roda as migrations pendentes no boot.

## Testes determinísticos (sem Postgres)

A suíte de testes da api é **100% determinística**: o banco é mockado por um
fake in-memory de `Repository<T>` (`apps/api/src/test/`), injetado no seam
`AppDataSource.getRepository`. Nenhuma chamada real de banco/rede é feita —
os testes rodam em qualquer lugar, sem infraestrutura:

```bash
pnpm test                                       # raiz: todos os workspaces
pnpm --filter @sao-lourenco/api test            # só a api
```

Cobre o E2E completo de `POST /users` (201 + contrato + 409 + 400) e os
fluxos cross-domínio de Services e Reviews — via Supertest contra
`buildApp()`, igual antes, só que sem Postgres real.

## Qualidade no commit (Lefthook)

O `pnpm install` instala automaticamente os git hooks. No `pre-commit`:

1. ESLint `--fix` + Prettier `--write` nos arquivos staged.
2. `pnpm -r typecheck`.
3. `pnpm -r test` (determinístico — **não exige Postgres no ar**).

Um commit com erro de lint ou teste falhando é bloqueado (exit code
não-zero); corrigido, o commit passa normalmente.
