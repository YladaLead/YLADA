# AGENTS.md — Regras do Agente de IA (Ylada / ylada-app)

> Regras que o agente de código (Claude Code / Cursor) deve seguir SEMPRE neste repositório.
> Origem: padrões repassados pelo Vinicius Miguel (24/06/2026). Detalhe e contexto: `../Desktop/Ylada-Workspace/Padroes_Codigo_Agente_IA.md`.
> Filosofia: regras ficam aqui (carregadas todo turno); fatos/decisões de sessão ficam na memória (`CLAUDE.md` e docs do workspace).

## Code style
- Funções: 4–20 linhas. Dividir se maior.
- Arquivos: abaixo de 500 linhas. Dividir por responsabilidade.
- Uma coisa por função, uma responsabilidade por módulo (SRP).
- Nomes específicos e únicos. Evitar `data`, `handler`, `Manager`. Preferir nomes com <5 hits no grep.
- Tipos explícitos. Sem `any`, sem tipo implícito.
- Sem duplicação. Extrair lógica compartilhada.
- Early return em vez de ifs aninhados. Máx. 2 níveis de indentação.
- Mensagem de exceção inclui o valor ofensor e o formato esperado.

## Comentários
- Manter comentários existentes no refactor (carregam intenção).
- Escrever o PORQUÊ, não o O QUÊ. Docstring em função pública: intenção + 1 exemplo.
- Referenciar issue/SHA quando a linha existe por causa de bug/restrição.

## Testes
- Rodam com um comando. Toda função nova ganha teste; bug fix ganha teste de regressão.
- Mockar I/O externo (API, DB, FS) com fakes nomeados, não stubs inline.
- F.I.R.S.T: fast, independent, repeatable, self-validating, timely.
- **Cobertura > 80%, duplicação < 3%** antes de abrir PR.

## Dependências
- Injetar por construtor/parâmetro, não global/import.
- Lib de terceiros atrás de uma interface fina do projeto.

## Estrutura
- Seguir a convenção do framework (Next.js/TS). Módulos pequenos e focados, não god files.
- `@/` mapeia pra `./src/`. Tipos em `src/types/`, lógica em `src/lib/`, UI em `src/components/`.

## Formatação
- Formatador padrão (prettier/eslint). Não discutir estilo além disso.

## Logging
- JSON estruturado pra debug/observabilidade; texto plano só pra saída ao usuário.

## Git
- Fetch + merge do upstream, build e teste local ANTES do PR.
- Feature/fix coberto por teste antes do commit.
- Commits não muito grandes; PBI pronto, commita. Mensagem foca no QUÊ e PORQUÊ.
- Branch por feature; PR focado no QUÊ e PORQUÊ; apagar branch mergeada.
- Lint local antes do PR. Não fazer squash (commits dão contexto). Checar cobertura/duplicação antes do PR.

## Específico do Ylada (preservar)
- **Adição pura atrás de flag, INERTE** quando migrar (nada importa o novo até ligar). Flag OFF = byte-idêntico.
- **Render nativo de fluxo** só com `meta.use_ylada_flow_native: true`.
- Copy de devolutiva = lookup determinístico no molde (`porFaixa`/`porPerfil`), NÃO gerar por IA no resultado.
- NÃO renomear `flow_id` existente (chave de lookup em banco/catálogo/OG).
- Commits sempre pelo terminal do Cursor (`git add <paths> && git commit && git push`), nunca `git add -A` cego.

## Banco / Supabase (segurança)
- **Toda `CREATE TABLE ... public.` numa migration DEVE vir seguida de `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`** — senão a tabela fica exposta pela API pública (alerta `rls_disabled_in_public`). Se o acesso é só via service-role (`supabaseAdmin`), ligar o RLS sem policy basta (o app continua intacto); se há acesso anon/authenticated, criar a policy junto.
- **Views em `public.` devem usar `security_invoker = on`** (respeitam o RLS de quem consulta, não o do criador). Evita o alerta `security_definer_view`.
- Depois de mexer no schema, conferir o **Security Advisor** do Supabase antes de dar a tarefa por concluída. Histórico: migration 453 esqueceu o RLS → corrigido na 455.
