# Análise: Links a partir do brief por perfil (liberais, vendedores, vários tipos)

**Objetivo:** A partir de um *brief* (texto livre), o sistema entrega o quiz ou a calculadora pronta, baseado no perfil de quem está usando (profissionais liberais, vendedores, vários segmentos).

---

## 1. Como está hoje

### 1.1 Perfil por categoria (bem detalhado)

| Item | Status | Onde |
|------|--------|------|
| Perfil único por usuário/segmento | ✅ | `ylada_noel_profile` (segment, profile_type, profession, category, sub_category, area_specific, flow_id, flow_version) |
| Tipos: liberal vs vendas | ✅ | `profile_type`: 'liberal' \| 'vendas' |
| Profissão por segmento | ✅ | `profession`: medico, estetica, odonto, psi, coach, nutricionista, vendedor_suplementos, etc. (whitelist em `ylada-profile-flows.ts`) |
| Fluxos de onboarding por tipo/profissão | ✅ | `PROFILE_FLOWS` em `ylada-profile-flows.ts` (liberal_v1, vendas_v1, steps com campos por profissão) |
| UI de perfil empresarial | ✅ | `/pt/perfil-empresarial` → `PerfilEmpresarialView` (areaCodigo ylada) |
| API perfil | ✅ | GET/PUT `/api/ylada/profile` (segment) |
| Injeção do perfil no Noel | ✅ | `buildProfileResumo(profile)` no system prompt de `/api/ylada/noel` |

Ou seja: **perfil por categoria está implementado** e o Noel já “conhece” o profissional (liberal/vendas, profissão, dores, metas, canais, etc.).

---

### 1.2 Processo reverso (brief → sugestão de template)

| Item | Status | Onde |
|------|--------|------|
| API interpret (texto → perfil sugerido + template) | ✅ | POST `/api/ylada/interpret` — body: `text`, opcional `segment`, `profile_type`, `profession` |
| Uso do perfil atual no interpret | ✅ | Página `/pt/links` envia `profile_type` e `profession` no body; a IA usa para priorizar template |
| Catálogo de templates na IA | ✅ | 2 templates fixos no prompt: `diagnostico_agenda`, `calculadora_perda` (ids no seed 208) |
| Resposta estruturada | ✅ | `profileSuggest`, `recommendedTemplateId`, `recommendedTemplateName`, `diagnosticSummary`, `confidence` |
| Resumo do conteúdo do template | ✅ | `diagnosticSummary` montado a partir do `schema_json` do template (quiz com N perguntas, resultados possíveis, etc.) |

Ou seja: **o “processo reverso” está implementado**: o profissional descreve para que quer o link → a IA sugere um template e um resumo do que o link entrega.

---

### 1.3 Templates e geração de link

| Item | Status | Onde |
|------|--------|------|
| Templates universais | ✅ | `ylada_link_templates` — 2 registros no seed: diagnóstico agenda (quiz), calculadora perda |
| Instâncias por usuário | ✅ | `ylada_links` (user_id, template_id, slug, title, config_json, cta_whatsapp, status) |
| Listagem de templates | ✅ | GET `/api/ylada/templates` |
| Listagem de links do usuário | ✅ | GET `/api/ylada/links` |
| Geração de link | ✅ | POST `/api/ylada/links/generate` (template_id + opcional title, cta_whatsapp, segment, category, sub_category) |
| Sugestões por template | ✅ | `suggested_prompts` (ex.: “Quero um quiz para qualificar quem tem interesse em agendar”) |
| Página pública do link | ✅ | `/l/[slug]` → busca em `ylada_links`, renderiza `PublicLinkView` (quiz ou calculadora) |
| Eventos (view, cta_click) | ✅ | POST `/api/ylada/links/events` (slug, event_type) |

Ou seja: **o sistema já entrega quiz/calculadora pronta** quando o usuário escolhe um template e gera o link; a URL `/l/[slug]` funciona.

---

### 1.4 UI de Links Inteligentes (/pt/links)

| Item | Status | Onde |
|------|--------|------|
| Carregar perfil (profile_type, profession) | ✅ | GET profile no load; usado em sugestões e no interpret |
| Sugestões por perfil | ✅ | `buildSuggestionsByProfile`: liberal → diagnostico/quiz/triagem; vendas → calculator; chips “Para sua atuação” e “Outras opções” |
| Campo “Para que você quer usar este link?” | ✅ | Textarea + botão “Interpretar” |
| Exibir resultado do interpret | ✅ | Bloco com profileSuggest, template recomendado, diagnosticSummary; select de template pré-preenchido |
| Gerar link após interpret | ✅ | Usuário clica “Gerar link” (template já pode estar selecionado pelo interpret) |
| Lista “Seus links” | ✅ | Editar título/WhatsApp, copiar URL, pausar/ativar/arquivar |

Ou seja: **o fluxo “brief → interpret → sugestão → gerar link” existe na página de links**, mas **tudo é feito na tela de Links**; o Noel **não** participa desse fluxo nem devolve link na conversa.

---

### 1.5 Noel e links “na hora”

| Item | Status | Onde |
|------|--------|------|
| Noel recebe perfil + snapshot | ✅ | `/api/ylada/noel` busca `ylada_noel_profile` e `user_strategy_snapshot`, injeta no system |
| Noel conhece segmento (ylada, psi, odonto, coach, nutra, etc.) | ✅ | `SEGMENT_CONTEXT` por segment |
| Noel tem lista de links ativos do usuário? | ❌ | Não; não existe `getNoelYladaLinks` nem injeção de `ylada_links` no contexto |
| Noel pode sugerir um link específico na resposta? | ❌ | Não |
| Noel pode chamar interpret + generate e devolver URL? | ❌ | Não |

Ou seja: **a partir de um brief no chat do Noel, o sistema ainda não entrega o quiz/calculadora pronta**. O brief só funciona em **/pt/links** via “Interpretar” + “Gerar link”.

---

## 2. Resumo: o que funciona x o que falta

- **Perfil por categoria (liberais, vendedores, vários tipos):** implementado (tabela, fluxos, UI, API, Noel).
- **Brief na página de Links:** implementado (interpret → sugestão de template + diagnóstico → usuário gera link).
- **Entrega do quiz/calculadora pronta:** implementada (gerar link → `/l/[slug]` com quiz ou calculadora).
- **Uso do perfil na recomendação:** implementado (interpret recebe profile_type/profession; UI filtra sugestões por perfil).
- **Noel não sugere nem gera link na conversa:** falta integrar “links ativos” + interpret (e opcionalmente generate) no Noel para que, a partir de um brief no chat, o sistema entregue o link/quiz/calculadora “na hora”.
- **Salvar perfil sugerido:** o interpret devolve `profileSuggest`, mas a UI não oferece “Usar e salvar perfil” (PUT profile) — opcional, mas melhora a experiência.
- **Catálogo maior:** hoje só 2 templates; para “vários tipos” faz sentido ampliar (mais templates ou variantes por segment/profession), conforme Fase 2.1 do cronograma.

---

## 3. Sequência de próximos passos recomendada

### Passo 1 — Noel: sugerir e, se possível, gerar link a partir do brief (prioridade alta)

**Objetivo:** Na conversa com o Noel, quando o profissional pedir um link/quiz/calculadora (brief), o sistema entregar a sugestão e, idealmente, o link pronto.

- **1.1** Criar algo análogo ao Nutri: função que monta “links ativos” do usuário a partir de `ylada_links` (id, title, slug, type, url `/l/{slug}`) para injetar no contexto do Noel.
- **1.2** No `/api/ylada/noel`:  
  - Se a mensagem indicar intenção de “querer um link / quiz / calculadora / ferramenta para engajar” (heurística ou pequeno classificador), chamar `POST /api/ylada/interpret` em backend (com text = mensagem do usuário + perfil atual) para obter `recommendedTemplateId` e `diagnosticSummary`.  
  - Injetar no system (ou pós-processar) a lista de links ativos + o resultado do interpret (template recomendado, resumo).  
  - Na resposta do Noel, incluir o link recomendado (e, se fizer sentido no produto, **gerar o link** via `POST /api/ylada/links/generate` e devolver a URL na resposta, ex.: “Criei este link para você: [título](url)”).
- **1.3** Definir se o Noel só **sugere** (“use o template X, vá em Links e gere”) ou se **gera o link na hora** e devolve a URL (recomendado para “entregar quiz/calculadora pronta” a partir do brief).

**Resultado:** Brief no chat → Noel entrega sugestão + link pronto (ou instrução clara para gerar em /pt/links).

---

### Passo 2 — Página Links: “Usar e salvar perfil” quando o interpret sugerir perfil (prioridade média)

**Objetivo:** Quando o interpret devolver `profileSuggest` preenchido, o profissional poder aplicar essa sugestão ao perfil em um clique.

- **2.1** Na página `/pt/links`, no bloco que exibe o resultado do interpret, adicionar botão “Usar e salvar perfil” (ou “Aplicar sugestão ao perfil”).  
- **2.2** Ao clicar: montar payload a partir de `profileSuggest` (segment, category, sub_category, dor_principal, etc.) e chamar `PUT /api/ylada/profile` (garantir que a API aceite esses campos se ainda não aceitar).  
- **2.3** Feedback de sucesso e, opcionalmente, atualizar estado local do perfil para as próximas ações na mesma página.

**Resultado:** Processo reverso fecha o ciclo “brief → perfil sugerido → salvar perfil” sem sair da tela de Links.

---

### Passo 3 — Reforçar recomendação por perfil em todo o fluxo (prioridade média)

**Objetivo:** Garantir que, em todo lugar, a recomendação de template use de forma explícita o perfil salvo (liberal/vendas, profession, segment).

- **3.1** No interpret: sempre que houver usuário autenticado, buscar `ylada_noel_profile` para o segment e enviar no body (ou no contexto da IA) profile_type, profession, category, sub_category, dor_principal, para a IA priorizar o template certo.  
- **3.2** Na listagem de templates na UI (/pt/links): manter e, se necessário, ampliar a ordenação/filtragem por perfil (liberal → quiz/diagnóstico primeiro; vendas → calculadora primeiro), já parcialmente feita com `TEMPLATE_TYPE_BY_PROFILE` e `buildSuggestionsByProfile`.  
- **3.3** Documentar no prompt do interpret os valores de `profile_type` e `profession` e como cada um mapeia para tipos de template (quiz vs calculadora, etc.).

**Resultado:** Recomendação consistente por tipo de profissional em interpret, UI e (após Passo 1) Noel.

---

### Passo 4 — Ampliar catálogo de templates (prioridade depois do 1–3)

**Objetivo:** Ter mais opções de quiz/calculadora por segmento ou profissão, para o “brief” cobrir mais casos (liberais, vendedores, médicos, psi, odonto, coach, nutra).

- **4.1** Definir 2–4 novos templates (ex.: triagem, diagnóstico de conversão, posicionamento, “erro oculto”), conforme MATRIZ-CENTRAL (Fase 2.1).  
- **4.2** Incluir no seed (ou migration) e no prompt do interpret os novos ids/nomes e quando usar cada um (por dor, por profile_type, por profession).  
- **4.3** Opcional: coluna ou metadado em `ylada_link_templates` indicando segmentos/profissões preferidos (ex.: `suggested_for_profiles: ['liberal'], suggested_for_professions: ['medico','psi']`) e usar na recomendação.

**Resultado:** Brief cobre mais cenários; interpret e Noel recomendam template mais adequado por perfil.

---

### Passo 5 — Testes e documentação do fluxo completo (prioridade contínua)

- **5.1** Fluxo E2E: login → perfil preenchido (liberal médico / vendas nutra / etc.) → /pt/links → brief no textarea → Interpretar → ver sugestão + diagnosticSummary → Gerar link → abrir `/l/[slug]` e concluir quiz/calculadora + clique WhatsApp.  
- **5.2** Após Passo 1: mesmo usuário → /pt/home → Noel → “Quero um quiz para qualificar quem quer agendar” → resposta com link criado ou instrução clara para Links.  
- **5.3** Atualizar PROCESSO-REVERSO-LINKS-INTELIGENTES.md e MATRIZ-CENTRAL-CRONOGRAMA.md com o que foi implementado (Noel + links, salvar perfil sugerido, catálogo).

**Resultado:** Fluxo “brief → quiz/calculadora pronta por perfil” documentado e estável.

---

## 4. Ordem sugerida de execução

1. **Passo 1** (Noel + links a partir do brief) — para fechar “sistema entrega quiz/calculadora pronta a partir do brief” também no chat.  
2. **Passo 2** (Usar e salvar perfil na página Links) — melhora o processo reverso.  
3. **Passo 3** (Reforçar recomendação por perfil) — garante consistência em interpret, UI e Noel.  
4. **Passo 4** (Ampliar catálogo) — quando quiser mais variedade por segmento/profissão.  
5. **Passo 5** (Testes e docs) — em paralelo e após cada passo.

---

## 5. Referências no repositório

- Perfil: `src/config/ylada-profile-flows.ts`, `src/lib/ylada-profile-resumo.ts`, `src/app/api/ylada/profile/route.ts`, `docs/PERFIL-POR-TOPICO-PROFISSAO-FLUXOS.md`
- Interpret: `src/app/api/ylada/interpret/route.ts`, `docs/PROCESSO-REVERSO-LINKS-INTELIGENTES.md`
- Templates e links: `migrations/207-ylada-link-tables.sql`, `208-ylada-link-templates-seed.sql`, `src/app/api/ylada/templates/route.ts`, `src/app/api/ylada/links/route.ts`, `src/app/api/ylada/links/generate/route.ts`
- Página pública: `src/app/l/[slug]/page.tsx`, `src/components/ylada/PublicLinkView.tsx`
- Noel: `src/app/api/ylada/noel/route.ts`, `docs/NOEL-YLADA-PERFIL-E-INTEGRACAO.md`
- Nutri (referência de “links no Noel”): `src/lib/noel-nutri/build-context.ts` (`getNoelNutriLinks`), `src/app/api/nutri/noel/route.ts`
- Cronograma: `docs/MATRIZ-CENTRAL-CRONOGRAMA.md`, `docs/PROGRAMACAO-SENSATA-PROXIMOS-PASSOS.md`
