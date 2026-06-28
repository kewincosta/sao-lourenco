# @sao-lourenco/web

Front-end do portal turístico São Lourenço — catálogo de serviços/atrativos,
cadastro/login mock, publicação de serviços e avaliações.

## Stack

React 19 · Vite 7 · TypeScript 5 (ESM/bundler) · Tailwind CSS v4 · shadcn/ui ·
Radix UI · React Hook Form + Zod · ESLint 9 (flat, regras React no config raiz).

## Comandos

Execute pela raiz do monorepo (workspace pnpm):

```bash
pnpm install                                   # linka o workspace (raiz)
pnpm --filter @sao-lourenco/web dev            # dev server (Vite, http://localhost:5173)
pnpm --filter @sao-lourenco/web build          # build de produção (apps/web/dist)
pnpm --filter @sao-lourenco/web typecheck      # tsc --noEmit
pnpm --filter @sao-lourenco/web lint           # eslint .
pnpm --filter @sao-lourenco/web preview        # serve o build de produção localmente
```

## Persistência de dados (importante)

Nesta versão **não há backend integrado**. Autenticação (login mock), serviços
publicados pelo usuário e avaliações vivem inteiramente em **estado React**
(`useState`), seedados com dados mock no carregamento da aplicação.

Isso significa:

- Tudo funciona normalmente durante a sessão (login, criar/excluir serviço,
  adicionar avaliação).
- **Um reload da página perde todo o estado** — volta aos dados mock iniciais.
- Não há chamada HTTP para `apps/api`; a integração real com a API é um
  trabalho futuro, fora do escopo desta versão.
