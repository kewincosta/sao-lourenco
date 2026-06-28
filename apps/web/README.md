# @sao-lourenco/web

Front-end do portal turístico São Lourenço — catálogo de serviços/atrativos,
cadastro/login mock, publicação de serviços e avaliações.

## Stack

React 19 · Vite 7 · TypeScript 5 (ESM/bundler) · Tailwind CSS v4 · shadcn/ui ·
Radix UI · React Hook Form + Zod · React Router 7 · Zustand · TanStack Query ·
Vitest + React Testing Library + jsdom · ESLint 9 (flat, regras React no config raiz).

## Comandos

Execute pela raiz do monorepo (workspace pnpm):

```bash
pnpm install                                   # linka o workspace (raiz)
pnpm --filter @sao-lourenco/web dev            # dev server (Vite, http://localhost:5173)
pnpm --filter @sao-lourenco/web build          # build de produção (apps/web/dist)
pnpm --filter @sao-lourenco/web typecheck      # tsc --noEmit
pnpm --filter @sao-lourenco/web lint           # eslint .
pnpm --filter @sao-lourenco/web test           # vitest run
pnpm --filter @sao-lourenco/web preview        # serve o build de produção localmente
```

## Arquitetura

O front-end é organizado por página, com camadas compartilhadas explícitas.
Cada pasta de página é dona do seu fluxo; código reutilizado por mais de uma
página é promovido para `shared/`.

```text
src/
├── App.tsx           # QueryClientProvider > RouterProvider (só isso)
├── routes/           # createBrowserRouter: URLs → páginas, sob MainLayout
│   ├── index.tsx
│   └── ProtectedRoute.tsx   # guard: !auth → <Navigate to="/login" />
├── layouts/           # MainLayout (Header + <Outlet/> + Footer + Toaster)
├── pages/             # uma pasta por página (Home, Services, Attractions,
│                       # Login, Register, Dashboard), cada uma com index.tsx
│                       # e, quando necessário, components/, hooks/, utils.ts
├── shared/
│   ├── common/        # genéricos, agnósticos de domínio (ui/ shadcn, RatingStars, ErrorFallback)
│   ├── domain/         # componentes de domínio reutilizados por ≥2 páginas
│   │                    # (ServiceCard, AttractionCard, ServiceDetailModal)
│   ├── hooks/          # hooks de dados reutilizados (query hooks TanStack Query)
│   ├── utils/           # funções puras (cn, rating)
│   ├── types/           # tipos de domínio compartilhados
│   └── stores/          # Zustand (auth.store)
└── services/          # acesso a dados — sem React, sem TanStack Query
    ├── mock-data.ts    # seeds
    ├── data-source.ts  # store mutável in-memory, seeded de mock-data
    └── *.service.ts     # services.service, reviews.service, attractions.service, users.service, auth.service
```

### Camada de dados: Página → Hook → Service

Toda leitura/escrita de dados remotos segue o fluxo
**Página → Hook (TanStack Query) → Service → data-source (mock in-memory)**:

- `services/*.service.ts` só faz acesso a dados (sem React, sem TanStack Query).
- `shared/hooks/*` (ou `pages/X/hooks/*` quando específico de uma única página)
  encapsulam `useQuery`/`useMutation`, expondo `data`/`isLoading`/`isError` e
  invalidando as queries certas após uma mutation.
- Páginas consomem apenas hooks — nunca importam `mock-data` nem chamam
  `useQuery`/`useMutation` diretamente.

### Hierarquia de estado

| Estado                                                  | Ferramenta                   | Local                           |
| ------------------------------------------------------- | ---------------------------- | ------------------------------- |
| Usuário autenticado (sessão)                            | Zustand                      | `shared/stores/auth.store.ts`   |
| Serviços / avaliações / atrações (dados remotos)        | TanStack Query (fonte única) | `shared/hooks/*` + `services/*` |
| Modal aberto, item selecionado, filtros, campos de form | `useState`                   | dentro da própria página        |

### Direção de dependência

Página → domínio → comum, nunca o contrário:

- `pages/*` pode importar de `shared/*`, `services/*` e `layouts/*`/`routes/*`.
- `shared/domain/*` pode importar de `shared/common/*`, mas não de `pages/*`
  nem `layouts/*`.
- `shared/common/*` não importa nada de domínio, página ou layout.
- Nenhuma página importa arquivos internos de outra página.

## Persistência de dados (importante)

Nesta versão **não há backend integrado**. `services/data-source.ts` simula o
backend com um store mutável in-memory, seedado de `services/mock-data.ts` no
carregamento da aplicação — autenticação, serviços publicados pelo usuário e
avaliações passam por essa fonte via `services/*.service.ts` e
`shared/hooks/*`/`shared/stores/auth.store.ts`.

Isso significa:

- Tudo funciona normalmente durante a sessão (login, criar/excluir serviço,
  adicionar avaliação).
- **Um reload da página perde todo o estado** — volta aos dados mock iniciais.
- Não há chamada HTTP para `apps/api`; a integração real com a API é um
  trabalho futuro, fora do escopo desta versão.
