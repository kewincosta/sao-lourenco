# @sao-lourenco/web (placeholder)

Este diretório é um slot reservado para o frontend (React + Vite) no
workspace pnpm. Ele ainda não contém código de aplicação.

## O que vai acontecer aqui

O código real do web será **clonado de outro repositório no GitHub** e vai
**sobrepor** este placeholder — incluindo este `README.md` e o
`package.json`. Por isso o `package.json` atual:

- declara apenas `name` (`@sao-lourenco/web`), `private: true` e
  `type: module`;
- **não** declara nenhuma dependência de runtime ou de build, para não
  conflitar com o `package.json` real que virá do clone.

## Convenção esperada

- Stack: React + Vite.
- Consumo de contratos/tipos compartilhados via `@sao-lourenco/shared`
  (`workspace:*`), do mesmo jeito que `apps/api` já consome.
- Uma vez clonado, `pnpm install` na raiz do monorepo passa a linkar
  `@sao-lourenco/web` normalmente, sem passos extras.
