# Project State

## Decisions (Architecture Decision log)

| ID | Date | Decision | Rationale |
| --- | --- | --- | --- |
| AD-001 | 2026-06-27 | Adotar **pnpm workspaces** como gerenciador do monorepo (migrar de npm) | Isolamento estrito de deps + node_modules eficiente; escolha do usuário |
| AD-002 | 2026-06-27 | Layout `apps/{api,web}` + `packages/shared`, escopo de nomes `@sao-lourenco/*` | Separar apps de código compartilhado; nome casa com `sao-lourenco-api` |
| AD-003 | 2026-06-27 | Criar `packages/shared` já agora para contratos/tipos/Zod | Preparar consumo type-safe pelo web antes de cloná-lo |
| AD-004 | 2026-06-27 | `apps/web` entra como **placeholder mínimo**; stack alvo **React + Vite** | Código real será clonado do GitHub depois e sobreposto ao placeholder |
| AD-005 | 2026-06-27 | Consumo do `@sao-lourenco/shared` = **source p/ dev/typecheck/test (paths + alias vitest) + dist p/ runtime de produção**; pacote em CJS | ACs `--filter` auto-contidos; zero ferramenta nova; CJS casa com api `commonjs` e Vite consome CJS |
| AD-006 | 2026-06-27 | Empacotamento Docker da api via **`pnpm deploy --prod`** com contexto de build na raiz do workspace | Forma canônica de empacotar 1 app com deps `workspace:*` |
| AD-007 | 2026-06-27 | **Testes determinísticos**: toda chamada de banco/rede é mockada (fakes in-memory / test doubles). Testes "remotos" (banco/recursos externos reais) ficam para o futuro, como camada separada | Testes rápidos, sem infra; rodáveis no pre-commit; reprodutíveis |
| AD-008 | 2026-06-27 | Lint/format = **ESLint 9 flat config + Prettier**, config **única compartilhada na raiz**; lint/format rodam sobre **arquivos staged** no pre-commit | Menos duplicação/drift; pre-commit rápido |
| AD-009 | 2026-06-27 | Git hooks via **Lefthook**; pre-commit roda eslint+prettier (staged) + typecheck + suíte de testes (agora determinística) | Qualidade garantida no commit sem depender de Postgres |
| AD-010 | 2026-06-28 | Front (`apps/web`) **desacoplado do GitHub Spark**; persistência via **estado React** (`useState`), com auth elevado ao `App` e passado por prop ao `Header`. Sem `useKV`/runtime Spark. Sem persistência entre reloads (dados são mock/seed) | Rodar fora da plataforma Spark; integração real com `apps/api` fica p/ feature futura; escolha do usuário |
| AD-011 | 2026-06-28 | `apps/web` usa **tsconfig próprio ESM/bundler** (`jsx: react-jsx`, `moduleResolution: bundler`, paths `@/*`), **não** estende `tsconfig.base.json` | Base é CJS p/ a api; o front é ESM via Vite — estender quebraria |
| AD-012 | 2026-06-28 | Regras ESLint **React** (`react-hooks`, `react-refresh`) vivem no **config raiz** escopadas a `apps/web/**`; plugins como devDeps da raiz | Flat config não cascateia p/ subdir a partir da raiz; conforma AD-008 (config única na raiz) |

## Handoff (in-flight state)

- **Feature `web-app-migration`: CONCLUÍDA e VERIFICADA** (Verifier independente, PASS, 20/20 requisitos, sensor de mutação leve 1/1 killed — sem suíte de testes nesta feature por decisão AD-010, gate = comandos executáveis).
  - **spec:** `.specs/features/web-app-migration/spec.md` — 20 requisitos (WEBMIG-01..20), todos cobertos.
  - **design:** `.specs/features/web-app-migration/design.md` — Opção A (copiar app + reescrever configs + descartar clone); auth elevado ao `App` e passado por prop ao `Header` implementado como especificado.
  - **tasks:** `.specs/features/web-app-migration/tasks.md` — T1..T9 todas `✅ Done`, status geral `Done` (reordenado durante a execução: T6 antes de T2, T3 depois de T4/T5 — ver SPEC_DEVIATION na Execution Plan do tasks.md).
  - **validation:** `.specs/features/web-app-migration/validation.md` — relatório completo do Verifier (PASS, 20/20 ACs, gate 4/4, 4 SPEC_DEVIATIONs aceitáveis, sem gaps bloqueantes).
  - **Lição (gate de pre-commit):** `lefthook` roda `lint` escopado a `{staged_files}` com o config **raiz**, e `typecheck`/`test` via `pnpm -r` (repo inteiro, não só staged). Em migrações de código novo: configs de lint/tooling que o código novo precisa devem ser commitadas **antes** do código ser staged; `package.json` que liga o código ao `pnpm -r` deve entrar **depois** do código já estar correto — nunca antes.
  - **Resultado:** `apps/web` é agora o app real (React 19 + Vite 7 + Tailwind v4 + shadcn/Radix), livre de GitHub Spark, pnpm-aligned, incluído nos gates da raiz (typecheck/build/lint), documentado, e `portal-turstico-so-l/` removido da raiz.
  - **Próximo passo:** nenhum pendente desta feature. Se houver nova feature, começar pela fase Specify.
- **Feature `monorepo-restructure`: CONCLUÍDA e VERIFICADA** (Verifier independente, PASS, 14/14 requisitos, sensor de mutação 3/3 killed).
- **spec:** `.specs/features/monorepo-restructure/spec.md` — 14 requisitos (MONO-01..14), todos `Verified`.
- **design:** `.specs/features/monorepo-restructure/design.md` — Opção A (shared: source p/ dev, dist p/ runtime) + Opção A (mock via `vi.mock` do data-source, consistência cruzada user→service→review via registry singleton por entidade) — ambas implementadas como especificado.
- **tasks:** `.specs/features/monorepo-restructure/tasks.md` — T1–T11 todas `✅ Done`, status `Complete (Verified)`.
- **validation:** `.specs/features/monorepo-restructure/validation.md` — relatório completo do Verifier.
- **Repo:** monorepo pnpm ativo (`apps/api`, `apps/web` placeholder, `packages/shared`); suíte de testes 100% determinística (sem Postgres); ESLint 9 flat + Prettier + Lefthook pre-commit funcionando; Docker via `pnpm deploy --prod` validado e2e.
- **Próximo passo:** nenhum pendente desta feature. Se houver nova feature, começar pela fase Specify.
- **Pendência fora de escopo (não relacionada a esta feature):** pedido anterior do usuário "Valide o que foi implementado e está não commitado" foi interrompido antes da reestruturação e nunca finalizado — só revisitar se o usuário pedir explicitamente.

## Future work (registrado, fora do escopo atual)

- **Refactor de DI (Opção B):** tornar factories/`buildApp` injetáveis em vez do `vi.mock` — melhoria de arquitetura, feita depois como feature própria.
- **Camada de testes "remotos":** validação real contra Postgres/recursos externos (complementa AD-007).
