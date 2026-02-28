# Links Inteligentes — Métricas do diagnóstico + Variação controlada

## 1. Sistema mínimo de métricas

### 1.1 Tabela (já criada)

**Migration:** `migrations/225-ylada-diagnosis-metrics.sql`

| Campo | Tipo | Uso |
|-------|------|-----|
| id | uuid | PK; devolvido ao front para registrar clique |
| created_at | timestamptz | Momento do diagnóstico |
| link_id | uuid | FK ylada_links (qual link gerou) |
| flow_id | text | config_json.meta.flow_id |
| architecture | text | RISK_DIAGNOSIS, BLOCKER_DIAGNOSIS, etc. |
| level | text | baixo/medio/alto (quando existir) |
| main_blocker | text | Bloqueio único exibido |
| fallback_used | boolean | true se validação falhou e caiu no fallback |
| clicked_whatsapp | boolean | true quando visitante clica no CTA |
| clicked_at | timestamptz | Momento do clique |
| time_to_click_ms | integer | clicked_at - created_at em ms |
| theme | text | config_json.meta.theme_raw |
| objective | text | config_json.meta.objective |
| cta_variant | text | Texto do CTA exibido (A/B: qual CTA converte mais) |
| diagnosis_shown_at | timestamptz | Quando o resultado foi exibido (evento result_view) |
| diagnosis_read_time_ms | integer | Tempo em ms entre exibir o resultado e clicar no CTA (permanência na página) |

**Migration 226:** `cta_variant`. **Migration 228:** `diagnosis_shown_at` e `diagnosis_read_time_ms` — tempo de leitura do diagnóstico (ouro para tráfego pago: engajamento real com o conteúdo).

### 1.2 Onde salvar

**No momento do diagnóstico (único lugar que gera diagnóstico):**

- Quando a página pública submeter o formulário, a API que chama `generateDiagnosis` deve:
  1. Buscar o link por slug e ler `config_json.meta` (theme, objective, flow_id, architecture).
  2. Montar `DiagnosisInput` (meta + professional + visitor_answers).
  3. Chamar `generateDiagnosis(input)` e saber se caiu em fallback (ex.: try/catch com flag ou retorno enriquecido).
  4. **INSERT** em `ylada_diagnosis_metrics`: link_id, flow_id, architecture, level (se risco), main_blocker, fallback_used, theme, objective, **cta_variant** (texto do CTA retornado em `diagnosis.cta_text`); clicked_whatsapp = false, clicked_at = null, time_to_click_ms = null.
  5. Devolver ao front: `{ diagnosis: DiagnosisDecisionOutput, metrics_id: uuid }`.

**No momento do clique (CTA WhatsApp):**

- O front já dispara `POST /api/ylada/links/events` com `event_type: 'cta_click'` e `slug`.
- **Opção A (recomendada):** o front envia também `metrics_id` (guardado no state após o diagnóstico). A API de events:
  - Insere/espelha o evento em `ylada_link_events` como hoje.
  - Se vier `metrics_id`, faz **UPDATE** em `ylada_diagnosis_metrics`: `clicked_whatsapp = true`, `clicked_at = now()`, `time_to_click_ms = extract(epoch from (now() - created_at)) * 1000`.
- **Opção B:** criar `POST /api/ylada/links/diagnosis/click` que recebe `metrics_id` e só atualiza `ylada_diagnosis_metrics`; o front chama esse endpoint além do track de events. Menos acoplado ao events, mas duas chamadas.

Recomendação: **Opção A** — estender o body de `POST /api/ylada/links/events` com `metrics_id` opcional e, quando `event_type === 'cta_click'` e `metrics_id` presente, atualizar `ylada_diagnosis_metrics`. Assim não perdemos o primeiro usuário e mantemos um único ponto de registro de clique.

---

## 2. Variação controlada (sem quebrar o contrato)

Estrutura continua fixa (contrato + validação). Só a **camada de expressão** varia.

### 2.1 Variação por nível (ex.: risco)

- **Risco alto** → tom mais **direto**: consequence com verbos fortes (piorar, comprometer); growth_potential com “salto” (ex.: “dá para destravar e evoluir rápido”).
- **Risco médio** → tom **estratégico**: consequence com “estável” / “ciclo”; growth_potential com “evolução consistente” / “plano coerente”.
- **Risco baixo** → tom **preventivo**: consequence mais leve; growth_potential com “ajuste fino” / “manter ganhos”.

**Implementação:** em `diagnosis-templates.ts`, por arquitetura (pelo menos RISK_DIAGNOSIS), ter **consequence_by_level** e **growth_potential_by_level** (opcionais). Ex.:

- `consequence`: mantido como fallback se não houver por nível.
- `consequence_by_level?: { alto: string, medio: string, baixo: string }`.
- Na montagem do resultado, se existir `level` e `consequence_by_level[level]`, usar esse texto; senão, usar `consequence`.
- Mesma ideia para **growth_potential_by_level** (e depois para outras arquiteturas com “nível”, se houver).

Cada string continua passando na validação (tensão em consequence, ganho em growth_potential). Nada de IA livre; só escolha de template por nível.

### 2.2 Variação de intensidade do growth_potential

- Três “intensidades”: **ajuste fino**, **evolução consistente**, **salto estratégico**.
- Por arquitetura (e opcionalmente por nível), definir 1–3 variantes que passem na validação (mesmos marcadores de ganho).
- Na montagem: **escolha determinística** (ex.: hash do theme + level) ou **rotação** (ex.: contador por link_id ou por dia) para alternar qual variante usar. Sem aleatoriedade pura, para ser reproduzível e testável.

### 2.3 Rotação de verbos de tensão

- Lista fixa de verbos/frases de tensão (perda, estagnação, risco) que já passam na validação.
- Por arquitetura, ter 2–3 **consequence alternativas** (todas com marcadores válidos) e escolher uma por rotação ou por hash(link_id + created_at). Assim evitamos sempre o mesmo “continuar/piorar” sem alterar estrutura nem regras semânticas.

**Resumo:**  
- Contrato e validação **inalterados**.  
- Novos campos opcionais nos templates: `consequence_by_level`, `growth_potential_by_level`, e listas de variantes (consequence / growth_potential).  
- Motor escolhe variante por nível e, se quiser, por rotação/hash, e monta o mesmo `DiagnosisDecisionOutput`; no final continua `validateDiagnosisDecision(out)`.

---

## 3. Ordem ideal: integrar primeiro ou métricas junto?

**Recomendação: integrar já com métrica desde o primeiro acesso.**

- Se integrar **sem** métrica e só depois adicionar, você perde os primeiros 30–50 diagnósticos (quais bloqueios/níveis converteram).
- A tabela e o fluxo (INSERT no diagnóstico + UPDATE no clique) são pequenos; dá para ir para produção já com métrica.
- Ordem sugerida:
  1. **Migration 225** (já feita).
  2. **API de diagnóstico na página pública:** `POST /api/ylada/links/[slug]/diagnosis` (ou equivalente) que gera diagnóstico, faz INSERT em `ylada_diagnosis_metrics` e retorna `diagnosis` + `metrics_id`.
  3. **Página pública** usa essa API no submit do form, guarda `metrics_id` no state e, no clique do CTA, envia `metrics_id` junto com o evento `cta_click`.
  4. **Events API** estendida: se `event_type === 'cta_click'` e `metrics_id` presente, atualizar `ylada_diagnosis_metrics` (clicked_whatsapp, clicked_at, time_to_click_ms).
  5. Depois: adicionar variação por nível e rotação de variantes nos templates (consequence/growth_potential) conforme acima.

Assim você já sobe com motor blindado + métrica desde o primeiro usuário e, em seguida, introduz variação controlada sem quebrar o contrato.

---

## 4. Fluxo exato da API pública de diagnóstico

### 4.1 Endpoint

**POST** `/api/ylada/links/[slug]/diagnosis`  
- **Público** (sem auth).  
- **Body:** `{ visitor_answers: Record<string, unknown> }` — valores do formulário (ids dos campos = chaves; valor string ou number conforme o campo).

### 4.2 Fluxo no backend

1. **Resolve link:** `GET ylada_links WHERE slug = :slug AND status = 'active'`. Se não achar → 404.
2. **Lê config:** `config_json.meta` → theme_raw, objective, flow_id, architecture; `config_json.form.fields` para saber quais chaves esperar (opcional: normalizar visitor_answers para o formato que o motor espera, ex. symptoms, history_flags, impact_level para RISK_DIAGNOSIS).
3. **Monta DiagnosisInput:**
   - `meta`: objective, theme: { raw }, area_profissional (de meta ou default 'geral'), architecture.
   - `professional`: name/whatsapp do dono do link (se quiser personalizar; pode vir de outra tabela ou ficar vazio).
   - `visitor_answers`: body.visitor_answers.
4. **Gera diagnóstico:** `generateDiagnosis(input)`. Detectar se caiu em fallback (ex.: retorno enriquecido `{ diagnosis, fallbackUsed }` ou try/catch com flag).
5. **INSERT** `ylada_diagnosis_metrics`: link_id, flow_id, architecture, level (do resultado, se existir), main_blocker, fallback_used, theme, objective, **cta_variant** = diagnosis.cta_text; demais campos como na seção 1.2.
6. **Response 200:** `{ diagnosis: DiagnosisDecisionOutput, metrics_id: string }`.

Erros: 400 (body inválido), 404 (link não encontrado/inativo), 500 (erro do motor ou do insert; em último caso devolver fallback sem métrica ou com métrica de fallback).

### 4.3 Front (página pública)

- **ConfigDrivenLinkView** (flow com form): no submit do form, em vez de só `setStep('result')`:
  1. Chamar `POST /api/ylada/links/${slug}/diagnosis` com `{ visitor_answers: values }` (values = estado dos campos do form).
  2. Receber `{ diagnosis, metrics_id }`. Guardar `diagnosis` e `metrics_id` no state.
  3. Ir para o step `result` e exibir: profile_title, profile_summary, main_blocker, consequence, growth_potential; botão com `diagnosis.cta_text`; link WhatsApp com `diagnosis.whatsapp_prefill` (query param ou mensagem pré-preenchida).
  4. No **clique do CTA:** além de abrir WhatsApp, chamar `POST /api/ylada/links/events` com `{ slug, event_type: 'cta_click', metrics_id }` (e device/utm se já enviar hoje).

### 4.4 Events API estendida

- **Body aceito:** além de `slug`, `event_type`, `utm_json`, `device`, aceitar **`metrics_id`** (opcional).
- **event_type `result_view`** + metrics_id: UPDATE `ylada_diagnosis_metrics` SET diagnosis_shown_at = now() (quando o resultado foi exibido). O front dispara ao mostrar a tela do diagnóstico.
- **event_type `cta_click`** + metrics_id: UPDATE clicked_whatsapp, clicked_at, time_to_click_ms e **diagnosis_read_time_ms** (tempo entre diagnosis_shown_at e o clique; se result_view não foi enviado, fica null).

Ordem: integrar diagnóstico + métrica (INSERT + metrics_id) e events com metrics_id; depois, variação emocional.

---

## 5. Qual métrica olhar primeiro (primeiros 100 usuários)

- **Principal:** **taxa de clique por main_blocker** (e por nível, se for RISK_DIAGNOSIS).  
  Query: `main_blocker`, `count(*)` total, `count(*) filter (where clicked_whatsapp)` cliques → ordenar por taxa (cliques/total). Os bloqueios que mais convertem são os que mais “doem” ou mais ressoam — priorize esses na copy e na ordem.
- **Secundária:** **taxa por architecture** (RISK vs BLOCKER etc.) e **time_to_click_ms** (mediana): se alguém clica em 2s vs 2min, o contexto emocional é diferente; use para calibrar tom.
- **Depois de ter cta_variant:** taxa de conversão por **cta_variant** para A/B de texto do botão.

Não otimize variação emocional antes de ter pelo menos 50–100 diagnósticos; até lá, a métrica que importa é **qual main_blocker (e nível) converte mais**.

---

## 5.1 Primeira leitura após ~20 diagnósticos reais

Logo após os primeiros diagnósticos reais (não só testes manuais), olhe no banco:

| O quê | Por quê |
|-------|--------|
| **1. Taxa de clique por main_blocker** | Ver qual dor/bloqueio faz a pessoa agir. |
| **2. Nível alto vs médio — qual tem menor time_to_click** | Quem age mais rápido (ex.: risco alto clica em menos tempo). |
| **3. diagnosis_read_time_ms** (mediana) | Tempo de permanência na página do resultado até o clique — engajamento real. |
| **4. fallback_used** | Deve ficar próximo de 0. Se subir, algo está instável (validação ou templates). |

Query exemplo (por main_blocker e nível):

```sql
SELECT main_blocker, level,
       count(*) AS total,
       sum(CASE WHEN clicked_whatsapp THEN 1 ELSE 0 END) AS clicks,
       round(avg(time_to_click_ms) / 1000.0, 1) AS avg_time_sec
FROM ylada_diagnosis_metrics
WHERE architecture = 'RISK_DIAGNOSIS'
GROUP BY main_blocker, level
ORDER BY total DESC;
```

E monitorar fallback:

```sql
SELECT count(*) AS total, sum(CASE WHEN fallback_used THEN 1 ELSE 0 END) AS fallbacks
FROM ylada_diagnosis_metrics;
```

---

## 5.2 Mini experimento com dois públicos (liberal vs wellness)

Testar com **profissional liberal** (racional, agenda, conversão) e **wellness/emocional** (dor, risco, saúde) — mas **não misturar na análise**.

- **Como separar:** use **um link por público** (ex.: um link com tema/objetivo para liberal, outro para wellness). Na análise, filtre por `link_id` (ou por `theme` / `objective` em `ylada_diagnosis_metrics`).
- **Volume sugerido:** ex.: 10 diagnósticos liberais + 10 wellness; não alterar nada no motor, só observar.
- **Comparar:**

| Grupo        | Taxa de clique | Mediana time_to_click |
|-------------|----------------|------------------------|
| Liberal     | ?              | ? (geralmente mais alto — pensam antes de clicar) |
| Wellness    | ?              | ? (pode ser mais rápido) |

**Possível cenário:** wellness clica mais; liberal clica menos mas pode fechar mais depois — isso orienta copy futura. O que importa é **qual dor move mais rápido**, não qual texto é bonito.

---

## 6. Organização do código (implementação)

| O quê | Onde |
|-------|------|
| **Motor** retorno com fallback | `src/lib/ylada/diagnosis-engine.ts`: `generateDiagnosis` → `DiagnosisGenerationResult` (`diagnosis`, `fallbackUsed`, `level`). |
| **Tipos** | `src/lib/ylada/diagnosis-types.ts`: `DiagnosisGenerationResult`; export em `src/lib/ylada/index.ts`. |
| **Migrations** | `225` tabela métricas; `226` cta_variant; `227` user_agent + ip_hash. |
| **API diagnóstico** | `src/app/api/ylada/links/[slug]/diagnosis/route.ts`: POST, resolve link por slug, monta `DiagnosisInput` de `config_json.meta` + body.visitor_answers, chama `generateDiagnosis`, INSERT em `ylada_diagnosis_metrics` (inclui cta_variant, fallback_used, user_agent, ip_hash), retorna `{ diagnosis, metrics_id }`. Sem rate limit por IP. |
| **API events** | `src/app/api/ylada/links/events/route.ts`: body aceita `metrics_id` opcional; se `event_type === 'cta_click'` e `metrics_id`, UPDATE em `ylada_diagnosis_metrics` (clicked_whatsapp, clicked_at, time_to_click_ms). |
| **Front** | `src/components/ylada/PublicLinkView.tsx`: `ConfigDrivenLinkView` verifica `meta.architecture` em `DIAGNOSIS_ARCHITECTURES`; se sim, submit chama POST `/api/ylada/links/${slug}/diagnosis`, guarda `diagnosis` e `metrics_id`, exibe resultado do motor e CTA com `diagnosis.cta_text`; no clique, `trackEvent(slug, 'cta_click', { metrics_id })` e abre WhatsApp com `diagnosis.whatsapp_prefill`. `trackEvent` aceita opcional `options.metrics_id`; `onCtaClick(metricsId?, whatsappPrefill?)` para construir URL com prefill. |
