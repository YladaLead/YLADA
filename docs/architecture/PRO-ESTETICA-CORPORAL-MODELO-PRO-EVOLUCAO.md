# Pro Estética Corporal — modelo “evolução do Pro Ylada”

Documento de referência para **reestruturar a arquitetura** mantendo a **aparência e UX** já definidas no painel actual. **Âmbito imediato:** só **estética corporal**. Capilar, hub de segmentos e outras áreas ficam **fora** até o modelo corporal estar fechado.

---

## 1. Resumo executivo

| Decisão | Conteúdo |
|--------|-----------|
| **Produto** | Especialização Ylada **Plano Pro** para clínicas de **estética corporal**: fluxos prontos, consultoria-first, **sempre centrado na dona** do negócio. |
| **O que não é** | Não replicar o raciocínio **Pro Líderes** (tenant = equipa + comunicação interna como eixo). |
| **UI** | **Manter** shell, cores, navegação, copy de alto nível e páginas já construídas (`ProEsteticaCorporalAreaShell`, sidebar, header, rotas `/pro-estetica-corporal/painel/*`). |
| **O que muda** | **Por baixo:** identidade de negócio, acesso, dados e RLS passam a refletir **“conta Pro + módulo estética corporal”**, não um segundo produto multi-tenant ao estilo Líderes. |

---

## 2. Visão de produto

1. **Narrativa comercial:** upgrade / linha Pro da Ylada com **experiência diferenciada** para estética corporal (antes ou integrado à consultoria).
2. **Utilizador-alvo:** a **dona** (decisora). Profissionais liberais ou terceiros, no futuro, entram como **periféricos** (convidados, integrações ou permissões limitadas), **sem** inverter o modelo para “organização tipo empresa Líderes”.
3. **Concentração:** construir o **modelo exacto** em **corporal**; **depois** clonar o padrão para capilar ou outras áreas, se fizer sentido.

---

## 3. Estado actual (baseline técnico)

### 3.1 Superfície preservada (aparência + rotas)

- **Base do painel:** `/pro-estetica-corporal/painel` (`PRO_ESTETICA_CORPORAL_BASE_PATH`).
- **Itens de menu** (referência): `src/config/pro-estetica-corporal-menu.ts` — Início, Noel, Links (biblioteca), Ritmo (resultados), Perfil.
- **Componentes de layout:** `ProEsteticaCorporalAreaShell`, `ProEsteticaCorporalSidebar`, `ProEsteticaCorporalHeader`, `ProEsteticaCorporalMobileNav`.
- **Páginas painel** (pasta): `src/app/pro-estetica-corporal/painel/*` (noel, retencao, resultados, perfil, biblioteca-links, etc.).
- **Site público / gates:** `src/app/pro-estetica-corporal/(site)/*`, `entrar`, `aguardando-acesso`, `conta-outra-edicao`.
- **Middleware:** canónico sem `/pt` para `/pro-estetica-corporal` (`src/middleware.ts`).

### 3.2 Acoplamento actual a “tenant Líderes”

- Tabela **`leader_tenants`** com `vertical_code = 'estetica-corporal'` e restrição **`UNIQUE(owner_user_id)`** (um dono = uma linha de tenant em todo o ecossistema Pro Líderes + estéticas).
- Resolução de contexto: `src/lib/pro-estetica-corporal-server.ts` (`ensureEsteticaCorporalTenantAccess`, `resolveEsteticaCorporalTenantContext`) sobre `resolveProLideresTenantContext` (`src/lib/pro-lideres-server.ts`).
- **APIs** que assumem `leader_tenant_id` / vertical: exemplos em `src/app/api/pro-estetica-corporal/*`.

Este acoplamento é o que se pretende **substituir conceptualmente** pelo modelo Pro-estética, **sem** obrigar a dona a pensar em “tenant”.

---

## 4. Modelo alvo (conceitual)

### 4.1 Entidades (linguagem de produto)

| Entidade | Descrição |
|----------|-----------|
| **Conta Ylada** | Utilizador autenticado (Supabase `auth.users`). |
| **Plano Pro (estética)** | Direito de acesso ao produto “Pro especializado estética”; amarra-se à **subscription / perfil** já usados na Ylada para Pro (detalhe de implementação a alinhar com `auth-server`, Stripe, `subscriptions`). |
| **Espaço da dona (corporal)** | **Um** contexto de negócio para estética corporal: preferências, nome da clínica, dados usados em Noel, links, ritmo, etc. **Não** é uma “empresa Líderes”; é **extensão do Pro** com `product_key` ou equivalente. |
| **Áreas / módulos** | Dentro do mesmo espaço, no futuro: outras linhas (ex. capilar) como **secções ou flags**, não necessariamente novos `leader_tenants`. |

### 4.2 Regras de acesso (alvo)

1. Utilizador **autenticado**.
2. Tem **assinatura / entitlement** “Pro estética corporal” (ou Pro geral + flag de módulo corporal — decisão de billing).
3. **Não** depende de existir linha em `leader_tenants` **só** porque “é o mesmo motor que Líderes”.

Redireccionamentos:

- Sem login → `/pro-estetica-corporal/entrar`.
- Com login, sem entitlement → página de **upgrade / aguardar consultoria** (manter UX de `aguardando-acesso` se o copy continuar válido, ou renomear para refletir “Pro estética”).
- Login com conta **errada** (ex.: outro produto) → manter `conta-outra-edicao` se ainda fizer sentido na narrativa Ylada.

---

## 5. Modelo de dados (proposta — a validar com BD real)

Objetivo: **uma fonte de verdade** para “quem é a dona e qual o contexto corporal”, compatível com evolução para mais áreas **no mesmo espaço**.

### 5.1 Opção A — Tabela dedicada (recomendada para clareza)

**`pro_estetica_owner_settings`** (nome ilustrativo)

- `user_id` (PK ou UNIQUE) — dona.
- `display_name`, `team_name`, `whatsapp`, `focus_notes`, etc. (campos hoje espelhados de `leader_tenants` onde fizer sentido).
- `vertical_scope` ou `primary_vertical` fixo `'corporal'` até existir multi-área no mesmo registo.
- `created_at`, `updated_at`.

**Vantagens:** linguagem alinhada ao produto; RLS simples (`user_id = auth.uid()`).  
**Migração:** backfill a partir de `leader_tenants` onde `vertical_code = 'estetica-corporal'` e `owner_user_id` coincidente.

### 5.2 Opção B — Reuso mínimo de `leader_tenants`

Manter **uma** linha por dona mas tratá-la **apenas** como “container de settings” corporal, **sem** expor “tenant” na UI e **sem** herdar fluxos de equipe Líderes. Menos migração de dados, mais dívida semântica.

**Recomendação do documento:** preferir **Opção A** quando a fase de implementação chegar, para o código e a documentação falarem a mesma língua que o produto.

### 5.3 Dados que continuam a precisar de “donde vem”

- **Noel / flows / scripts / links:** hoje podem estar ligados a `leader_tenant_id`. Plano: migrar para **`pro_estetica_*_id` ou `user_id`** + índices, ou mapear 1:1 na migração a partir do tenant corporal actual.
- **Membros / equipe:** se “sempre a dona” for regra nos próximos ciclos, **desactivar ou esconder** UI de equipe para este produto; se no futuro existirem colaboradores, modelar como **convidados ligados ao `user_id` da dona**, não como segundo “tenant dono”.

---

## 6. Camada de aplicação (alvo)

### 6.1 Novo módulo server (sugestão de ficheiros)

| Ficheiro (sugestão) | Responsabilidade |
|---------------------|------------------|
| `src/lib/pro-estetica-corporal-access.ts` | `ensureProEsteticaCorporalAccess()` — sessão + entitlement Pro estética + carregar row do espaço da dona (Opção A ou B). |
| `src/lib/pro-estetica-corporal-context.ts` | Tipo `ProEsteticaCorporalContext` (settings, flags demo, etc.) injectado no layout. |
| Migração gradual: **deprecar** chamadas directas a `ensureEsteticaCorporalTenantAccess` no fluxo corporal, mantendo implementação antiga até cutover. |

### 6.2 APIs `src/app/api/pro-estetica-corporal/*`

- Substituir dependência de `leader_tenant_id` da resolução Líderes por **contexto da dona** (novo ID ou `user_id`).
- Manter **contratos HTTP** estáveis onde possível para não quebrar clientes já referenciados.

### 6.3 Layout do painel

- `painel/layout.tsx` continua a chamar uma única função `ensure*Access`; por dentro, passa a usar o **novo modelo**, mas **mantém** as props actuais para `ProEsteticaCorporalAreaShell` (`painelContext`) — possível adaptar `operationLabel` e flags a partir de settings, não de “tenant”.

---

## 7. Fases de implementação (ordem sugerida)

| Fase | Entrega | Risco |
|------|---------|--------|
| **F0** | Este documento + revisão com equipa (billing, suporte). | Baixo |
| **F1** | Migração SQL: criar tabela (Opção A) + backfill a partir de tenants `estetica-corporal` existentes. | Médio — **ver §12 (primeira entrega).** |
| **F2** | `ensureProEsteticaCorporalAccess` + troca do layout painel + APIs críticas (noel, links, flows). | Alto |
| **F3** | Remover ou isolar dependência de `pro-estetica-corporal-server.ts` no caminho feliz; manter shim temporário se necessário. | Médio |
| **F4** | Demo (`demo@proesteticacorporal.com`): script SQL + entitlement de teste alinhados ao **novo** modelo. | Baixo |
| **F5** | Capilar / outras áreas: **copiar padrão** a partir de corporal. | — |

---

## 8. Fora de escopo imediato

- **`pro-estetica-capilar/**`** e APIs capilares — **congelados** ou mínimos até corporal estar estável.
- **`/pro-estetica`** hub de segmentos — pode coexistir; não bloqueia o modelo da dona corporal.
- **Pro Líderes** — sem alterações de produto neste documento; só **deixar de ser o modelo mental** para estética corporal.

---

## 9. Riscos e decisões em aberto

1. **Billing:** Pro geral vs SKU “Pro Estética Corporal”; impacto em `RequireSubscription`, Stripe e webhooks.
2. **Dados legados:** utilizadores que já têm `leader_tenants` com outra `vertical_code` **e** querem corporal — hoje `UNIQUE(owner_user_id)` impede dois donos; a migração tem de definir **prioridade** ou **fusão** de settings.
3. **RLS Supabase:** políticas novas na tabela dedicada; revisão de políticas antigas em tabelas que ainda referenciem `leader_tenant_id`.
4. **“Equipe” no menu:** alinhar com produto (ocultar vs remover rota).

---

## 10. Checklist rápido pós-implementação

- [ ] Login dona + entitlement → painel sem passar por “tenant Líderes” na cabeça do código.
- [ ] Demo em produção com um comando SQL + env claros.
- [ ] Noel, links, ritmo, retencao com persistência no novo modelo.
- [ ] UI igual ao baseline visual acordado (regressão visual mínima).
- [ ] Documento actualizado com decisões finais de billing e nome de tabelas.

---

## 11. Referência de ficheiros-chave (mapa)

```
src/app/pro-estetica-corporal/          # rotas App Router
src/components/pro-estetica-corporal/ # UI shell e páginas compostas
src/config/pro-estetica-corporal-*.ts   # menu, jornada, noel focus, ritmo demo
src/lib/pro-estetica-corporal-server.ts # resolução + sync workspace (§12)
src/types/pro-estetica-corporal.ts      # tipo da ligação dona ↔ tenant
src/app/api/pro-estetica-corporal/      # APIs REST (continuam com leader_tenant_id)
scripts/pro-estetica-corporal-demo-login.sql
migrations/301-pro-lideres-leader-tenants.sql  # origem UNIQUE owner + RLS
migrations/318-pro-estetica-corporal-workspace-settings.sql
```

---

## 12. Estado da implementação (primeira entrega)

- **Migração `318-pro-estetica-corporal-workspace-settings.sql`:** cria `pro_estetica_corporal_settings` (`user_id` UNIQUE → `leader_tenant_id`), RLS para o dono, backfill a partir de `leader_tenants` com `vertical_code = estetica-corporal`.
- **`resolveEsteticaCorporalTenantContext`:** lê primeiro a ligação na nova tabela (dona); se não existir, mantém o fluxo anterior (inclui **membros** da equipa via `leader_tenant_members`).
- **`ensureEsteticaCorporalTenantAccess`:** após acesso válido, faz **upsert** da ligação para manter o workspace sincronizado (JWT; fallback admin se necessário).
- **APIs / UI:** inalteradas na superfície; `leader_tenant_id` nas tabelas filhas mantém-se.
- **Deploy:** executar a migração **318** no Supabase (SQL Editor ou pipeline de migrations) antes de contar com a nova tabela em produção.
- **Onboarding (consultoria / implantação):** migração **319** (`pro_estetica_corporal_onboarding_links`), página pública `/pro-estetica-corporal/onboarding/[token]`, admin `/admin/pro-estetica-corporal/onboarding`, APIs em `/api/pro-estetica-corporal/leader-onboarding/*` e `applyCompletedCorporalOnboardingForEmail` ao entrar no painel (mesmo padrão Pro Líderes).

**Próximos passos (F2+):** billing Pro estética, eventualmente colunas próprias em `pro_estetica_corporal_settings` (nome da clínica, etc.) em vez de duplicar só via `leader_tenants`.

---

*Versão inicial do documento para alinhar produto e engenharia. Actualizar após decisões de billing e nomeação final das tabelas.*
