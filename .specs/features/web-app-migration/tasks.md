# Migração do Front (apps/web) — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user — do not proceed without it.**

---

**Design**: `.specs/features/web-app-migration/design.md`
**Status**: Done

---

## Test Coverage Matrix

> Gerada de codebase + guidelines + spec — confirmar antes do Execute. Guidelines encontradas: `lefthook.yml` (gate de pre-commit), `eslint.config.js`, decisão explícita do usuário "sem testes no web" (spec → Assumptions; AD-010). Como o usuário decidiu **não** adicionar testes ao web nesta feature, o gate é **build/typecheck/lint** (não há camada de teste unitário/e2e no web).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| --- | --- | --- | --- | --- |
| Config (package.json, vite.config, tsconfig, eslint) | none | build gate only | `apps/web/*` , `eslint.config.js` | `pnpm --filter @sao-lourenco/web typecheck && pnpm --filter @sao-lourenco/web build && pnpm --filter @sao-lourenco/web lint` |
| Entry/runtime (`main.tsx`, `vite-env.d.ts`) | none | build gate only | `apps/web/src/main.tsx`, `apps/web/src/*.d.ts` | build gate |
| UI/feature (`App.tsx`, `Header.tsx`, `components/**`) | none | build gate only (decisão: sem testes) | `apps/web/src/**` | build gate |
| Docs (READMEs) | none | leitura/manual | `apps/web/README.md`, `README.md` | n/a |

> Nota: o "strong default" (cobrir cada AC com teste) **não** se aplica porque o usuário decidiu explicitamente não adicionar testes ao web nesta migração. As ACs são verificadas por comandos executáveis (build/typecheck/lint/grep/boot) no gate Build e pelo Verifier.

## Parallelism Assessment

> Gerada de codebase — confirmar antes do Execute.

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
| --- | --- | --- | --- |
| (nenhum teste no web) | N/A | Sem testes; `[P]` decidido só por dependências de código/arquivo | decisão AD-010 / spec Assumptions |

Como não há testes, `[P]` reflete apenas ausência de dependência de código e ausência de edição do mesmo arquivo entre tarefas.

## Gate Check Commands

> Gerada de codebase — confirmar antes do Execute.

| Gate Level | When to Use | Command |
| --- | --- | --- |
| Quick | (não aplicável — sem testes unitários) | — |
| Full | (não aplicável — sem e2e/integration) | — |
| Build (web) | Após tarefas que tocam código/config do web | `pnpm --filter @sao-lourenco/web typecheck && pnpm --filter @sao-lourenco/web build && pnpm --filter @sao-lourenco/web lint` |
| Build (raiz) | Integração / fim de fase | `pnpm -r typecheck && pnpm -r build && pnpm exec eslint . && pnpm exec prettier --check apps/web` |
| Spark-free | Após de-Spark | `! grep -rn "@github/spark" apps/web` (deve retornar vazio / exit 1 no grep) |

---

## Execution Plan

> **SPEC_DEVIATION (descoberto na execução da Fase 1):** a ordem original (T3 logo após T1, T6 dependente de T3) quebra o gate de pre-commit do lefthook. `lint` roda `eslint --fix {staged_files}` com o **config raiz**, que hoje não tem regras/globals de React/JSX — qualquer arquivo `.tsx` do web staged sem T6 já presente falha o lint. `typecheck`/`test` rodam `pnpm -r` (repo inteiro, não só staged) — uma vez que `apps/web/package.json` (T3) existe com script `typecheck`, ele é varrido mesmo que o código ainda importe `@github/spark` (se T4/T5 não tiverem rodado). Reordenado para: **T6 antes de T2** (config de lint precisa existir antes de qualquer `.tsx` do web ser staged) e **T3 depois de T4+T5** (package.json só entra quando o código já está limpo de Spark, senão o typecheck `-r` falha). Também descoberto: `ServiceCard.tsx` tem um import morto pré-existente do clone (`RatingStars`, não usado) — removido como parte do T2 (arquivo já está sendo tocado/copiado; é o lint gate do próprio projeto que exige a correção, não scope creep).

### Phase 1: Placeholder out, lint config, trazer código (Sequential)

```
T1 ──→ T6 ──→ T2
```

> T1 já concluído e commitado (`chore(web): remove placeholder before migration`). Esta fase retoma em T6.

### Phase 2: Desacoplar Spark no código (Parallel OK)

```
T2 ──┬─→ T4 [P]
     └─→ T5 [P]
```

### Phase 3: package.json + integração (Sequential)

```
T4, T5 ──→ T3 ──→ T7
```

### Phase 4: Docs + limpeza (Parallel OK)

```
T7 ──┬─→ T8 [P]
     └─→ T9 [P]
```

---

## Task Breakdown

### T1: Remover placeholder de apps/web

**What**: Apagar os arquivos placeholder atuais para liberar o slot do app real.
**Where**: `apps/web/package.json`, `apps/web/README.md` (remover)
**Depends on**: None
**Reuses**: —
**Requirement**: WEBMIG-01, WEBMIG-10

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `apps/web/package.json` e `apps/web/README.md` placeholders removidos
- [ ] `apps/web/` fica vazio (pronto p/ receber o código)

**Tests**: none
**Gate**: Build (deferido p/ T7)
**Commit**: `chore(web): remove placeholder before migration`

---

### T2: Importar código-fonte e configs estáticas do clone [P]

**What**: Copiar o código de aplicação e as configs estáticas do clone para `apps/web`, **excluindo** Spark/npm/template.
**Where**: copiar p/ `apps/web/`: `src/`, `index.html`, `components.json`, `tailwind.config.js`, `tsconfig.json`. **Não** copiar: `package.json`, `package-lock.json`, `node_modules/`, `.git/`, `.github/`, `spark.meta.json`, `runtime.config.json`, `.spark-initial-sha`, `theme.json`, `PRD.md`, `LICENSE`, `SECURITY.md`, `README.md`, `.gitignore`.
**Depends on**: T6 *(reordenado — ver nota SPEC_DEVIATION na Execution Plan: o lint do pre-commit roda no config raiz sobre arquivos staged; sem T6, qualquer `.tsx` do web já falha o lint ao ser staged)*
**Reuses**: árvore de `portal-turstico-so-l/src/**` (shadcn/Radix/Tailwind) como está
**Requirement**: WEBMIG-01, WEBMIG-20

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `apps/web/src/`, `index.html`, `components.json`, `tailwind.config.js`, `tsconfig.json` presentes e idênticos ao clone, **exceto** `ServiceCard.tsx`: remover o import morto pré-existente `import { RatingStars } from './RatingStars'` (não usado no arquivo; é o lint gate do projeto que exige a remoção)
- [ ] Nenhum artefato de template/Spark/npm da lista de exclusão presente em `apps/web`
- [ ] `find apps/web -name package-lock.json -o -name spark.meta.json` vazio
- [ ] Sem `apps/web/package.json` ainda (entra só no T3, depois de T4/T5)

**Tests**: none
**Gate**: Build (deferido p/ T7)
**Commit**: `feat(web): import app source from cloned project`
**Status**: ✅ Done

---

### T3: Escrever apps/web/package.json (pnpm)

**What**: Criar o `package.json` do web alinhado ao pnpm, sem deps Spark e sem campos npm.
**Where**: `apps/web/package.json`
**Depends on**: T4, T5 *(reordenado — package.json só entra depois do código já estar livre de Spark; senão `pnpm -r typecheck` no pre-commit falharia ao incluir o web ainda importando `@github/spark`)*
**Reuses**: forma de `apps/api/package.json`; lista de deps derivada do `package.json` do clone
**Requirement**: WEBMIG-06, WEBMIG-09, WEBMIG-10, WEBMIG-11

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `name: "@sao-lourenco/web"`, `private: true`, `type: "module"`, `engines.node: ">=24"`
- [ ] `dependencies` = as do clone **menos** `@github/spark`, `@octokit/core`, `octokit`
- [ ] `scripts`: `dev`, `build` (`vite build`), `typecheck` (`tsc --noEmit`), `lint` (`eslint .`), `preview`; **sem** `test`/`kill`/`optimize`
- [ ] **Sem** campos `workspaces` e `overrides`
- [ ] `grep -E '"@github/spark"|"workspaces"|"overrides"|"octokit"' apps/web/package.json` vazio

**Tests**: none
**Gate**: Build (deferido p/ T7)
**Commit**: `feat(web): add pnpm-aligned package.json`
**Status**: ✅ Done (commit `f18714e`)

---

### T4: Desacoplar Spark do build/runtime (vite.config + main + d.ts) [P]

**What**: Remover plugins/runtime/globais do Spark dos pontos de entrada.
**Where**: `apps/web/vite.config.ts` (reescrever), `apps/web/src/main.tsx` (limpar), `apps/web/src/vite-end.d.ts` → `apps/web/src/vite-env.d.ts`
**Depends on**: T2
**Reuses**: `@vitejs/plugin-react-swc`, `@tailwindcss/vite`
**Requirement**: WEBMIG-05, WEBMIG-08

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `vite.config.ts` sem `@github/spark/*`; plugins = `[react(), tailwindcss()]`; alias `@`→`src` mantido
- [ ] `main.tsx` sem `import "@github/spark/spark"`
- [ ] `vite-end.d.ts` substituído por `vite-env.d.ts` contendo só `/// <reference types="vite/client" />` (sem globais Spark)
- [ ] `grep -rn "@github/spark" apps/web/vite.config.ts apps/web/src/main.tsx apps/web/src` vazio nesses arquivos

**Tests**: none
**Gate**: Build (deferido p/ T7) + Spark-free
**Commit**: `refactor(web): remove Spark build/runtime coupling`
**Status**: ✅ Done (commit `0da9a32`; nota: `apps/web/vite.config.ts` não havia sido copiado no T2 — criado aqui já de-Sparked, pois é o arquivo que esta task trata)

---

### T5: Substituir useKV por estado React (App + Header) [P]

**What**: Trocar persistência Spark KV por `useState`, elevando o auth ao `App` e passando por prop ao `Header`.
**Where**: `apps/web/src/App.tsx`, `apps/web/src/components/Header.tsx`
**Depends on**: T2
**Reuses**: `src/lib/types.ts`, `src/lib/mock-data.ts`
**Requirement**: WEBMIG-07

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `App.tsx`: `user`/`userServices`/`allReviews` via `useState` (`null`/`[]`/`mockReviews`); `import useKV` removido
- [ ] `App.tsx` passa `user` ao `<Header user={...} ... />`
- [ ] `Header.tsx`: `HeaderProps` com `user: User | null`; `useKV` removido; usa a prop
- [ ] `grep -rn "@github/spark" apps/web/src/App.tsx apps/web/src/components/Header.tsx` vazio
- [ ] Atualizadores funcionais preservados (review/serviço continuam funcionando na sessão)

**Tests**: none
**Gate**: Build (deferido p/ T7) + Spark-free
**Commit**: `refactor(web): replace Spark useKV with React state`
**Status**: ✅ Done (commit `be81faa`)

---

### T6: Bloco ESLint React no config raiz (escopado a apps/web)

**What**: Adicionar regras React ao `eslint.config.js` raiz escopadas a `apps/web/**` e instalar os plugins como devDeps da raiz.
**Where**: `eslint.config.js` (raiz, editar), `package.json` (raiz, devDeps)
**Depends on**: T1 *(reordenado — precisa existir antes de T2 trazer qualquer `.tsx`, não depende de T3)*
**Reuses**: `tseslint.config(...)` existente; AD-008 (config única raiz)
**Requirement**: WEBMIG-13

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Bloco flat com `files: ['apps/web/**/*.{ts,tsx}']` + `react-hooks`/`react-refresh`
- [ ] devDeps raiz `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh` adicionadas
- [ ] Estratégia para o ruído da UI gerada (`src/components/ui/**`) aplicada (override/relax) de modo que `eslint .` não falhe — validado no gate do T7
- [ ] `eslint.config.js` permanece em CJS coerente com o atual

**Tests**: none
**Gate**: Build (deferido p/ T7)
**Commit**: `chore(lint): add React rules scoped to apps/web`
**Status**: ✅ Done (commit `6a1873f`; follow-up fix `bb3b7af` adicionado durante o gate do T2 — Node globals para `apps/web/*.js` configs como `tailwind.config.js`, que rodam em Node e não eram cobertos pelos globals de browser do bloco React)

---

### T7: Integração — pnpm install, format e gate de build

**What**: Linkar o workspace, formatar o web e validar todos os gates de build/typecheck/lint.
**Where**: raiz (`pnpm-lock.yaml`), `apps/web/**` (format)
**Depends on**: T3
**Reuses**: `.prettierrc`/`.prettierignore` raiz; scripts `-r` raiz
**Requirement**: WEBMIG-02, WEBMIG-03, WEBMIG-04, WEBMIG-12, WEBMIG-14

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `pnpm install` na raiz conclui; `@sao-lourenco/web` aparece em `pnpm -r list`
- [ ] `pnpm exec prettier --write apps/web` aplicado; `prettier --check apps/web` passa
- [ ] Gate Build (web) passa: `pnpm --filter @sao-lourenco/web typecheck && build && lint`
- [ ] `pnpm --filter @sao-lourenco/web dev` serve `/` com HTTP 200 (HTML com `<div id="root">`) — checagem manual/curl
- [ ] Gate Build (raiz) passa: `pnpm -r typecheck && pnpm -r build && eslint .`
- [ ] `apps/web/dist/index.html` gerado

**Tests**: none
**Gate**: Build (raiz)
**Commit**: `build(web): link workspace, format, and pass build gates`
**Status**: ✅ Done (commit `ef24eba`; SPEC_DEVIATION: added `portal-turstico-so-l/**` to root `eslint.config.js` ignores — the clone is non-workspace content scheduled for removal in T9 and was failing the root `eslint .` gate; see commit message)

---

### T8: Atualizar documentação (READMEs) [P]

**What**: Reescrever o README do web e a seção do web no README raiz para refletir o app migrado.
**Where**: `apps/web/README.md`, `README.md` (raiz)
**Depends on**: T7
**Reuses**: estilo dos READMEs existentes
**Requirement**: WEBMIG-15, WEBMIG-16

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `apps/web/README.md` descreve app real (stack, comandos `pnpm --filter @sao-lourenco/web {dev,build,typecheck,lint}`, nota de persistência em memória)
- [ ] Seção do web no `README.md` raiz não diz mais "placeholder/slot reservado"
- [ ] `prettier --check` passa nos arquivos editados

**Tests**: none
**Gate**: Build (raiz)
**Commit**: `docs(web): document migrated web app`
**Status**: ✅ Done (commit `cd93ebc`; `apps/web/README.md` não existia desde o T1 — criado aqui já com a descrição do app real)

---

### T9: Remover diretório clone da raiz [P]

**What**: Apagar `portal-turstico-so-l/` (incluindo seu `.git`) da raiz do monorepo.
**Where**: `portal-turstico-so-l/` (remover)
**Depends on**: T7
**Reuses**: —
**Requirement**: WEBMIG-18, WEBMIG-19

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `portal-turstico-so-l/` não existe mais na raiz
- [ ] `find apps/web -name .git -o -path '*portal-turstico*'` vazio; sem repo git aninhado
- [ ] `pnpm install` ainda passa após a remoção

**Tests**: none
**Gate**: Build (raiz)
**Commit**: `chore(repo): remove cloned project directory after migration`
**Status**: ✅ Done (commit `c50824e`; também removido o ignore temporário `portal-turstico-so-l/**` do `eslint.config.js` raiz, registrado como obsoleto no T7)

---

## Parallel Execution Map

> Reordenado durante a execução (ver nota SPEC_DEVIATION na Execution Plan) — gate de pre-commit exige T6 antes de T2, e T3 depois de T4/T5.

```
Phase 1 (Sequential):
  T1 ── T6 ── T2

Phase 2 (Parallel após T2):
  T2 ──┬── T4 [P]
       └── T5 [P]

Phase 3 (Sequential):
  (T4, T5) ── T3 ── T7

Phase 4 (Parallel após T7):
  T7 ──┬── T8 [P]
       └── T9 [P]
```

> 4 fases → no Execute o orquestrador **oferece** 1 sub-agente por fase (offer-then-confirm). Verifier independente roda automaticamente após T9.

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1: Remover placeholder | 2 arquivos (remoção) | ✅ Granular |
| T2: Importar fonte | 1 concept (importar árvore) | ✅ Coeso |
| T3: package.json web | 1 arquivo | ✅ Granular |
| T4: De-Spark build/runtime | 3 arquivos, 1 concept (remover Spark da entrada) | ✅ Coeso |
| T5: useKV→useState | 2 arquivos, 1 concept (estado de auth/dados) | ✅ Coeso |
| T6: ESLint React raiz | 2 arquivos, 1 concept (lint React do web) | ✅ Coeso |
| T7: Integração/install/gate | 1 concept (linkar+validar) | ✅ Coeso |
| T8: READMEs | 2 arquivos, 1 concept (docs) | ✅ Coeso |
| T9: Remover clone | 1 diretório (remoção) | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
| --- | --- | --- | --- |
| T1 | None | (raiz) | ✅ Match |
| T6 | T1 | T1→T6 | ✅ Match |
| T2 | T6 | T6→T2 | ✅ Match |
| T4 | T2 | T2→T4 | ✅ Match |
| T5 | T2 | T2→T5 | ✅ Match |
| T3 | T4, T5 | (T4,T5)→T3 | ✅ Match |
| T7 | T3 | T3→T7 | ✅ Match |
| T8 | T7 | T7→T8 | ✅ Match |
| T9 | T7 | T7→T9 | ✅ Match |

`[P]` válidos: T4∥T5 (arquivos distintos, ambos só dependem de T2), T8∥T9 (docs vs remoção) — sem dependência mútua nem arquivo compartilhado. T6→T2→(T4,T5)→T3→T7 é sequencial (gate de pre-commit exige essa ordem).

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
| --- | --- | --- | --- | --- |
| T1 | Config/cleanup | none | none | ✅ OK |
| T2 | UI/feature (import) | none | none | ✅ OK |
| T3 | Config | none | none | ✅ OK |
| T4 | Entry/runtime + config | none | none | ✅ OK |
| T5 | UI/feature | none | none | ✅ OK |
| T6 | Config (lint) | none | none | ✅ OK |
| T7 | Integração (gate build) | none | none | ✅ OK |
| T8 | Docs | none | none | ✅ OK |
| T9 | Cleanup | none | none | ✅ OK |

Todas as camadas = `none` por decisão do usuário (sem testes no web; AD-010). Verificação das ACs é feita por comandos executáveis no gate Build e pelo Verifier (grep Spark-free, build/typecheck/lint, boot HTTP 200, ausência do clone). `Tests: none` é válido aqui porque a matriz diz `none` para todas as camadas — não é deferimento de teste.

---

## Requirement Coverage (spec → tasks)

| Requirement | Task(s) |
| --- | --- |
| WEBMIG-01 | T1, T2 |
| WEBMIG-02 | T7 |
| WEBMIG-03 | T7 |
| WEBMIG-04 | T7 |
| WEBMIG-05 | T4 |
| WEBMIG-06 | T3 |
| WEBMIG-07 | T5 |
| WEBMIG-08 | T4 |
| WEBMIG-09 | T3 |
| WEBMIG-10 | T1, T3 |
| WEBMIG-11 | T3 |
| WEBMIG-12 | T7 |
| WEBMIG-13 | T6, T7 |
| WEBMIG-14 | T7 |
| WEBMIG-15 | T8 |
| WEBMIG-16 | T8 |
| WEBMIG-17 | Verifier (pre-commit verde) |
| WEBMIG-18 | T9 |
| WEBMIG-19 | T9 |
| WEBMIG-20 | T2, T9 |

**Cobertura:** 20/20 requisitos mapeados (WEBMIG-17 validado pelo Verifier via pre-commit).
