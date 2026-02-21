# Passo a passo: contagem unificada de eventos por link

Objetivo: construir o modelo único (view, whatsapp_click, lead_capture) para toda a plataforma, em fases, de forma eficiente e eficaz.

---

## Visão geral das fases

| Fase | O quê | Resultado |
|------|--------|-----------|
| **1** | Infraestrutura (tabela + API unificada) | Novo caminho existe; nada quebra |
| **2** | Nutri usa só o novo modelo | Contagem confiável na área Nutri |
| **3** | Apenas **Wellness** migra | Contagem unificada em Nutri + Wellness |
| **4** | Matriz YLADA alinhada | Um único sistema para todos os links |
| **Coach** | Fica para o **modelo unificado** | Quando houver entrada única (Nutri + Wellness + Coach + médicos etc.), Coach entra no mesmo padrão; evita implementar duas vezes |

---

## FASE 1 — Infraestrutura

### Passo 1.1 — Migration: tabela `link_events`

Criar migration (ex.: `215-link-events-unificada.sql`):

- Tabela `link_events`:
  - `id` UUID PK
  - `event_type` TEXT NOT NULL CHECK (event_type IN ('view', 'whatsapp_click', 'lead_capture'))
  - `link_source` TEXT NOT NULL CHECK (link_source IN ('user_template', 'quiz', 'form', 'ylada_link', 'generated_link'))
  - `link_id` UUID NOT NULL (id do recurso: user_templates.id, quizzes.id, etc.)
  - `user_id` UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE (dono do link)
  - `area` TEXT NOT NULL (nutri, wellness, coach, ylada)
  - `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
  - Opcional: `lead_id` UUID NULL (para lead_capture, FK para leads.id se quiser)
- Índices:
  - `(user_id, link_id, event_type)` para contagem por link
  - `(user_id, area, created_at)` para totais por período
  - `(link_source, link_id)` para consultas por recurso

Não criar FK de `link_id` para tabelas específicas (user_templates, quizzes, etc.) para não acoplar; manter como UUID genérico.

### Passo 1.2 — Migration: colunas em `leads`

Na mesma migration ou em outra (`216-leads-link-ref.sql`):

- Se não existirem, adicionar em `leads`:
  - `link_source` TEXT NULL (user_template, quiz, form, ylada_link, generated_link)
  - `link_id` UUID NULL (id do recurso que gerou o lead)
  - `area` TEXT NULL (nutri, wellness, coach, ylada)
- Índice: `(user_id, link_id)` onde link_id IS NOT NULL (para contagem por link)
- Índice: `(user_id, area, created_at)` para totais por área e período

(Se `leads` já tiver `link_id` para generated_links, manter e passar a preencher também `link_source` e `area` onde já houver link.)

### Passo 1.3 — API unificada: `POST /api/link-events`

Criar rota `src/app/api/link-events/route.ts`:

- **Método POST**, pública (sem auth; o link é público).
- **Body (JSON):**
  - `event_type`: 'view' | 'whatsapp_click' | 'lead_capture'
  - `link_source`: 'user_template' | 'quiz' | 'form' | 'ylada_link' | 'generated_link'
  - `link_id`: UUID (obrigatório)
  - `area`: 'nutri' | 'wellness' | 'coach' | 'ylada'
- **Validação:** 
  - Resolver `user_id` a partir do link: buscar em user_templates ou quizzes (por link_id + link_source) o user_id; se não achar, 404.
  - Rate limit por IP (ex.: 60 views por minuto por IP).
- **Ação:** inserir uma linha em `link_events` com event_type, link_source, link_id, user_id, area.
- **Resposta:** 200 { success: true } ou 4xx/5xx.

Não alterar nenhum frontend ainda; só deixar a API pronta.

### Passo 1.4 — Função ou API de contagem

- **Opção A (RPC):** função SQL `get_link_events_stats(link_ids uuid[], link_source text, user_id uuid, since timestamptz default null)` que retorna por link_id: count view, count whatsapp_click, count lead_capture (e totais se link_ids for vazio).
- **Opção B (API):** `GET /api/link-events/stats?user_id=...&link_source=...&link_ids=...&since=...` (auth obrigatória, user_id do token) que consulta `link_events` e, para lead_capture, conta também em `leads` onde link_id preenchido.

Implementar uma das duas para uso nas Fases 2 e 3 (painéis e home).

---

## FASE 2 — Nutri

### Passo 2.1 — View: página pública Nutri ferramenta

- Em `src/app/pt/nutri/[user-slug]/[tool-slug]/page.tsx`, onde hoje chama `POST /api/nutri/ferramentas/track-view` com `tool_id`:
  - Trocar para `POST /api/link-events` com:
    - event_type: 'view'
    - link_source: 'user_template'
    - link_id: data.tool.id
    - area: 'nutri'
- Manter fallback: se a nova API falhar (ex.: 404 ou 501), opcionalmente chamar a antiga para não perder o número durante transição; ou já desligar a antiga se a migration estiver aplicada.

### Passo 2.2 — WhatsApp click: Nutri (WellnessCTAButton)

- O componente `WellnessCTAButton` já chama `POST /api/wellness/conversions` com template_id/slug.
- Adicionar chamada a `POST /api/link-events` com event_type: 'whatsapp_click', link_source: 'user_template', link_id: template_id, area: (prop ou inferido do contexto — ex. 'nutri' quando usado em página Nutri).
- Para não duplicar lógica, pode-se: (a) manter conversions e adicionar link-events em paralelo, ou (b) fazer o endpoint `/api/wellness/conversions` gravar também em `link_events` (inserir evento whatsapp_click). Preferir (b) para um único ponto de verdade.

### Passo 2.3 — Lead capture: Nutri (wellness/leads)

- Em `POST /api/wellness/leads` (usado quando a pessoa deixa nome/telefone no fluxo Nutri/Wellness):
  - Ao receber user_slug + tool_slug, resolver `user_templates.id` (link_id) e `user_id`.
  - Inserir em `leads` preenchendo `link_source = 'user_template'`, `link_id = <id da ferramenta>`, `area = 'nutri'` ou `'wellness'` conforme contexto.
  - Inserir em `link_events` um evento event_type: 'lead_capture', link_source: 'user_template', link_id, user_id, area (e opcionalmente lead_id após inserir o lead).
  - Atualizar `user_templates.leads_count` (incremento atômico ou RPC) para o tool_id correspondente, para manter compatibilidade com telas que leem esse campo.

### Passo 2.4 — Contagem na home e no painel Nutri

- Bloco “Sistema de Conversas Ativas” (home): “Conversas este mês” = contar em `link_events` (whatsapp_click + lead_capture) para user_id + area 'nutri' no mês, **ou** contar em `leads` com link_id preenchido e area 'nutri' no mês (definir uma regra única).
- Painel de links (Captar / ferramentas): para cada ferramenta, buscar contagens (view, whatsapp_click, lead_capture) via API de stats ou RPC, usando link_source 'user_template' e link_id = tool.id.

### Passo 2.5 — Testes manuais Nutri

- Abrir um link público Nutri → verificar 1 view em link_events.
- Completar fluxo e clicar no WhatsApp → verificar 1 whatsapp_click.
- Se houver formulário “deixar nome/telefone”, enviar → verificar 1 lead em leads com link_id + 1 lead_capture em link_events (se usar evento para lead_capture) e leads_count da ferramenta incrementado.

---

## FASE 3 — Apenas Wellness

Coach não é implementado nesta fase: será incluído quando o **modelo unificado** de áreas estiver pronto (entrada por qualquer lugar: Nutri, Wellness, Coach, médicos etc.), evitando implementar duas vezes.

### Passo 3.1 — View: Wellness

- Em `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`:
  - Onde chama `track-view`, trocar para `POST /api/link-events` com event_type: 'view', link_source: 'user_template', link_id: data.tool.id, area: 'wellness'.

### Passo 3.2 — WhatsApp click e lead capture: Wellness

- Já feito na Fase 2: `/api/wellness/conversions` insere em `link_events` (whatsapp_click) e `/api/wellness/leads` preenche leads + link_events (lead_capture) + leads_count; area inferida (nutri/wellness).

### Passo 3.3 — Contagem nos painéis Wellness ✅

- **Feito:** Página de links Wellness (`/pt/wellness/links`) chama `GET /api/link-events/stats?area=wellness&link_ids=...` e usa `by_link` para exibir views, leads e conversões por ferramenta. Dashboard Wellness (`/api/wellness/dashboard`) usa totais de `link_events` (lead_capture e whatsapp_click) para `leadsGerados` e `conversoes`.

---

## FASE 4 — Matriz YLADA ✅ Implementado

### Passo 4.1 — Opção A (espelhar)

- **Feito:** `POST /api/ylada/links/events` grava em `ylada_link_events` (como antes) e **também** em `link_events` com link_source: 'ylada_link', link_id, user_id (de ylada_links), area: 'ylada'.
- Mapeamento: `view` → view; `cta_click` → whatsapp_click. Eventos `start` e `complete` permanecem só em ylada_link_events.
- Listagem de links da matriz continua usando `get_ylada_link_stats` (ylada_link_events). Para relatórios unificados use `GET /api/link-events/stats?area=ylada`.

### Passo 4.2 — Leitura unificada (opcional)

- Quando quiser um painel único por área: usar `GET /api/link-events/stats?area=ylada&link_ids=...` para view e whatsapp_click (e lead_capture se no futuro a matriz tiver captura de lead).

---

## Checklist final (controle)

- [ ] Migration 215 (link_events) aplicada
- [ ] Migration 216 (leads: link_source, link_id, area) aplicada
- [ ] POST /api/link-events implementado e testado
- [ ] GET /api/link-events/stats (ou RPC) implementado
- [ ] Nutri: view, whatsapp_click e lead_capture indo para link_events + leads com link ref
- [ ] Nutri: home e painel Captar usando nova contagem
- [ ] Wellness: view → link_events; conversions/leads já na Fase 2
- [ ] Coach: no modelo unificado (futuro)
- [x] Matriz YLADA: eventos espelhados em link_events (view, cta_click → whatsapp_click)
- [ ] Documentação atualizada (CONTAGEM-3-EVENTOS-LINK-DEFINITIVO.md) com “Implementado em …”

---

## Ordem de execução sugerida (resumo)

1. Escrever e aplicar migrations (1.1 e 1.2).
2. Implementar POST /api/link-events (1.3) e API de stats (1.4).
3. Fase 2 (Nutri) completa (2.1 a 2.5).
4. Validar em produção/staging com Nutri.
5. Fase 3 (apenas Wellness). Coach quando houver modelo unificado.
6. Fase 4 (Matriz YLADA).
7. Marcar checklist e atualizar doc.

Isso mantém a medição eficiente e eficaz para os links como core business.
