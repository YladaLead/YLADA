# Programação estrutural — YLADA Matriz Central

Documento único para **não perder contexto** e construir em ordem. Marque cada etapa ao concluir (`- [x]`) e use a coluna **Onde ver (localhost)** para validar.

**Como usar:** uma etapa por vez; rodar `npm run dev`; validar na URL indicada antes de passar à próxima.

---

## Como funciona (fluxo)

1. **Entrada:** Pessoa acessa a landing por idioma — `/pt/ylada`, `/en/ylada` ou `/es/ylada` (quando i18n estiver ativo).
2. **Login:** Clica em Entrar → login/cadastro → redireciona para a home do painel.
3. **Painel (mesmo para todos):** Home (Noel), Trilha empresarial, Perfil empresarial, Links inteligentes, Leads, Configuração. A diferença é só o **contexto** (perfil: segment, category, sub_category, dor, idioma).
4. **Perfil:** Preenche categoria, subcategoria, dor principal, fase, canais etc. O Noel e a geração de links usam isso.
5. **Links:** Em “Links inteligentes”, escolhe um template (ou depois: “Descreva sua dor” → interpret sugere template) → gera link → recebe URL pública (`/l/[slug]`).
6. **Uso do link:** Compartilha a URL (bio, stories, DM). Quem clica abre a página pública do link (quiz ou calculadora), vê o resultado e clica no botão WhatsApp. O sistema registra eventos (view, cta_click).
7. **Noel:** No chat, o Noel usa perfil + trilha (snapshot) para sugerir estratégia, link e script em português, inglês ou espanhol conforme o idioma do usuário.

---

## Idiomas: português, inglês, espanhol

- **Rotas por idioma:** O produto deve ser acessível em **pt**, **en** e **es**. Mesmo backend e mesma lógica; só mudam idioma e copy.
  - **PT:** `ylada.com/pt/ylada` (ou `localhost:3000/pt/ylada`)
  - **EN:** `ylada.com/en/ylada`
  - **ES:** `ylada.com/es/ylada`
- **O que muda por idioma:** Textos da UI (menu, botões, labels), copy dos templates/links (quando houver copy packs por idioma) e respostas do Noel (idioma no perfil ou na URL).
- **O que já existe:** `src/lib/i18n.ts` e `src/lib/translations/` (pt.ts, en.ts, es.ts) para a página institucional. A matriz YLADA pode usar o mesmo padrão: chaves de tradução e `locale` (pt | en | es) na URL.
- **Próximos passos (Fase 3 ou antecipado):**
  - Adicionar rotas `/en/ylada` e `/es/ylada` (reutilizando os mesmos componentes e passando `locale`).
  - Campo **idioma** no perfil (`ylada_noel_profile`) para o Noel e para copy dos links (já previsto no modelo de “objetivo final”).
  - Copy packs por idioma para os templates (headlines, CTAs) quando existir biblioteca de copy.

Assim que a Fase 1 estiver estável, a Fase 3 detalha i18n (rotas en/es, traduções do painel YLADA, copy packs).

---

## Onde acompanhar no localhost

| O quê | URL |
|-------|-----|
| Página institucional (escolher área) | http://localhost:3000/pt |
| **YLADA — Landing** | http://localhost:3000/pt/ylada |
| **YLADA — Login** | http://localhost:3000/pt/ylada/login |
| **YLADA — Home (Noel)** | http://localhost:3000/pt/ylada/home |
| **YLADA — Trilha** | http://localhost:3000/pt/ylada/trilha |
| **YLADA — Perfil empresarial** | http://localhost:3000/pt/ylada/perfil-empresarial |
| **YLADA — Links inteligentes** | http://localhost:3000/pt/ylada/fluxos |
| **YLADA — Leads** | http://localhost:3000/pt/ylada/leads |
| **YLADA — Configuração** | http://localhost:3000/pt/ylada/configuracao |
| Link público (após Fase 1.5) | http://localhost:3000/l/[slug] |

---

## Fase 0 — Base (já feito)

- [x] Área Med removida; área YLADA criada em `/pt/ylada`
- [x] Config ylada-areas, auth, institutional com ylada
- [x] Nutri e Wellness intocadas
- [x] Redirect `/pt/med` → `/pt/ylada`

**Validar:** abrir http://localhost:3000/pt/ylada → ver landing; http://localhost:3000/pt/ylada/login → ver tela de login; após login → http://localhost:3000/pt/ylada/home (Noel), menu com Trilha, Perfil, Links, Leads, Config.

---

## Fase 1 — MVP do motor

### Etapa 1.1 — Perfil: category e sub_category

| Item | Ação |
|------|------|
| **O quê** | Adicionar campos `category` e `sub_category` ao perfil (ou usar `area_specific` JSONB). |
| **Onde** | Migration nova (ex.: `206-ylada-profile-category-subcategory.sql`) e/ou `ylada_noel_profile`; tipos em `src/types/ylada-profile.ts`. |
| **Onde ver** | http://localhost:3000/pt/ylada/perfil-empresarial — formulário deve permitir preencher categoria/subcategoria (ou já existir em area_specific). |

- [x] Migration 206 criada (rodar no Supabase)
- [x] Tipos TypeScript atualizados
- [x] Formulário de perfil exibe/grava category e sub_category

---

### Etapa 1.2 — Tabelas: templates, links, eventos

| Item | Ação |
|------|------|
| **O quê** | Criar `ylada_link_templates`, `ylada_links`, `ylada_link_events`. |
| **Onde** | Migration `207-ylada-link-tables.sql`. |
| **Onde ver** | Após rodar migration: tabelas visíveis no Supabase (Table Editor). |

- [x] Migration 207 criada (rodar no Supabase)
- [x] Índices em slug, user_id, link_id, created_at

---

### Etapa 1.3 — Seed dos 2 templates

| Item | Ação |
|------|------|
| **O quê** | Inserir 2 templates universais (ex.: diagnóstico_agenda, calculadora_perda) em `ylada_link_templates`. |
| **Onde** | Migration `208-ylada-link-templates-seed.sql`. |
| **Onde ver** | Supabase → `ylada_link_templates` com 2 linhas ativas. |

- [x] Migration 208 criada (rodar no Supabase: `208-ylada-link-templates-seed.sql`)
- [x] Template 1 (diagnóstico_agenda) com schema e variáveis
- [x] Template 2 (calculadora_perda) com schema e variáveis

---

### Etapa 1.4 — API: gerar link

| Item | Ação |
|------|------|
| **O quê** | `POST /api/ylada/links/generate`: recebe template_id + contexto (segment, category, etc.); cria linha em `ylada_links` com slug único e config_json. |
| **Onde** | `src/app/api/ylada/links/generate/route.ts`; GET `src/app/api/ylada/templates` e GET `src/app/api/ylada/links`. |
| **Onde ver** | http://localhost:3000/pt/ylada/fluxos — selecionar template, "Gerar link", ver link na lista e copiar URL. |

- [x] Endpoint POST /api/ylada/links/generate criado
- [x] GET /api/ylada/templates e GET /api/ylada/links
- [x] Slug único gerado; config_json a partir do template
- [x] UI em Fluxos: listar links + criar novo

---

### Etapa 1.5 — Rota pública do link + eventos

| Item | Ação |
|------|------|
| **O quê** | Página pública que renderiza o link (quiz/calculadora); botão WhatsApp; persistir eventos view e cta_click em `ylada_link_events`. |
| **Onde** | `src/app/l/[slug]/page.tsx`; `POST /api/ylada/links/events`. |
| **Onde ver** | http://localhost:3000/l/[um-slug-real] → ver conteúdo do link e clique no WhatsApp; eventos em `ylada_link_events`. |

- [x] Rota pública responde em /l/[slug]
- [x] Eventos view e cta_click persistidos (API events + PublicLinkView)

---

### Etapa 1.6 — API: interpret

| Item | Ação |
|------|------|
| **O quê** | `POST /api/ylada/interpret`: body `{ text, segment? }` → retorna JSON com profileSuggest, recommendedTemplateId, confidence. |
| **Onde** | `src/app/api/ylada/interpret/route.ts`. |
| **Onde ver** | http://localhost:3000/pt/links — bloco "Para que você quer usar este link?"; ou chamar API com texto livre. |

- [x] Endpoint criado
- [x] Resposta em JSON com schema definido; teste na página Links inteligentes

---

### Etapa 1.7 — Noel: resposta estruturada

| Item | Ação |
|------|------|
| **O quê** | Atualizar system prompt do Noel: (1) estrutura fixa (diagnóstico, estratégia, link, script, próximo passo); (2) injetar perfil completo (incl. category/sub_category quando existir). |
| **Onde** | `src/app/api/ylada/noel/route.ts` e prompt. |
| **Onde ver** | http://localhost:3000/pt/ylada/home → conversar com Noel; respostas seguem o formato combinado. |

- [ ] Prompt atualizado
- [ ] Resposta do Noel contém os 5 blocos

---

### Etapa 1.8 — UI: Meus links + Criar link

| Item | Ação |
|------|------|
| **O quê** | Em “Links inteligentes” (/pt/links): listar `ylada_links` do usuário; botão “Criar link” (escolher template ou “Descreva sua dor” → interpret → gerar). |
| **Onde** | `src/app/pt/ylada/(protected)/links/page.tsx` e componentes; chamadas a GET /api/ylada/links e POST generate. |
| **Onde ver** | http://localhost:3000/pt/links → lista de links; criar novo link e obter URL pública. |

- [ ] Lista de links do usuário
- [ ] Fluxo criar link (template ou interpret) funcionando

---

## Ordem recomendada de execução (Fase 1)

1. **1.1** Perfil (category/sub_category)
2. **1.2** Tabelas (templates, links, events)
3. **1.3** Seed dos 2 templates
4. **1.4** API gerar link
5. **1.5** Rota pública + eventos
6. **1.6** API interpret
7. **1.7** Noel estruturado
8. **1.8** UI Meus links + Criar link

---

## Fase 2 e 3 (resumo)

- **Fase 2:** +4 templates, memória Noel, dashboard métricas, fluxo “Descreva sua dor” na UI.
- **Fase 3:** **Idiomas pt / en / es** (rotas `/pt/ylada`, `/en/ylada`, `/es/ylada`; traduções do painel; copy packs por idioma); otimização custo IA.

Detalhamento das Fases 2 e 3 pode ser expandido neste mesmo doc quando a Fase 1 estiver concluída.

---

## Checklist rápido (não perder contexto)

- [ ] Migration 205 (segment ylada) aplicada no Supabase
- [ ] Ao desenvolver: sempre um passo por vez; validar no localhost antes de avançar
- [ ] Nutri e Wellness: não alterar
- [ ] **Idiomas:** produto preparado para pt, en, es (rotas e copy); Fase 3 implementa `/en/ylada`, `/es/ylada` e copy packs
- [ ] Referência de visão: `docs/MATRIZ-CENTRAL-CRONOGRAMA.md`
- [ ] Referência de filtragem: documento “DIRETRIZ ESTRUTURAL — FILTRAGEM DE PÚBLICO E CONEXÃO NOEL ↔ PERFIL”
