# Links Inteligentes — Testes em desenvolvimento (antes de produção controlada)

---

**Testes da Camada 0 + Single Card + StrategicIntro (tema sensível, 1 card, intro, disclaimer):** ir direto para a **seção 5.5** — checklist passo a passo com ordem sugerida.

---

## Como vamos testar — Passo a passo (ordem a seguir)

Siga na ordem. Marque cada item quando concluir.

| # | O que fazer | Onde conferir |
|---|-------------|----------------|
| **1** | Rodar as 4 migrations (225, 226, 227, 228) no Supabase | Tabela `ylada_diagnosis_metrics` existe com todas as colunas |
| **2** | Ter um link ativo com `architecture: RISK_DIAGNOSIS` e form com os campos da seção 1.2 (symptoms, history_flags, impact_level, attempts_count, age). Anotar o **slug** do link | `ylada_links` → link com status active e config_json correto |
| **3** | Subir o app (`npm run dev`) e abrir no navegador: `http://localhost:3000/l/SEU_SLUG` | Página do link abre com o formulário |
| **4** | Preencher o form com dados de **risco alto**: Sintomas: `dor, cansaço, insônia` — Histórico: `tratamento, retorno` — Impacto: `alto` — Tentativas: `4` — Idade: `45` → Clicar em "Ver meu resultado" | Aparece a tela de resultado com **main_blocker = "Risco alto ignorado"** e um botão de CTA (ex.: "Analise seu caso") |
| **5** | No Supabase: abrir `ylada_diagnosis_metrics` e achar a linha mais recente (ou filtrar por `main_blocker = 'Risco alto ignorado'`). Conferir: `level` = alto, `fallback_used` = false, `clicked_whatsapp` = false, `diagnosis_shown_at` preenchido (front disparou result_view) | Uma linha nova com esses valores |
| **6** | Na mesma tela do navegador, clicar no botão do CTA (WhatsApp) | Abre o WhatsApp (ou o link configurado); nada quebra |
| **7** | No Supabase: na **mesma** linha do passo 5, conferir: `clicked_whatsapp` = true, `clicked_at` e `time_to_click_ms` preenchidos, `diagnosis_read_time_ms` preenchido (tempo de leitura até o clique) | Valores atualizados na linha |
| **8** | (Opcional) Clicar de novo no CTA na mesma sessão (ou enviar de novo o evento cta_click com o mesmo metrics_id). No banco: a linha **não** deve mudar (só o primeiro clique conta) | `clicked_at` e `time_to_click_ms` continuam iguais |

**Resumo:** 1 → migrations | 2 → link com slug | 3 → abrir página | 4 → preencher e ver resultado | 5 → conferir INSERT no banco | 6 → clicar no CTA | 7 → conferir UPDATE no banco | 8 → (opcional) clique duplo não altera.

Se quiser testar **só pela API** (sem abrir o navegador): use o **Passo 3, 4, 5 e 6** da seção "Passo a passo dos testes" abaixo (POST diagnosis → conferir INSERT → POST events cta_click → conferir UPDATE). O passo 4 do navegador garante que **result_view** e **diagnosis_read_time_ms** também funcionam.

---

## 1. Escolher perfil → Perguntas → Interpretação

Ordem recomendada: **primeiro escolher o perfil** do link, **depois** definir as perguntas do formulário e **entender** como as respostas viram diagnóstico. Só então rodar os testes.

### 1.1 Escolher o perfil (arquitetura do link)

| Perfil | Arquitetura | Público típico | O que o diagnóstico mostra |
|--------|-------------|----------------|----------------------------|
| **Wellness / Risco** | `RISK_DIAGNOSIS` | Emocional, saúde, dor, medo | Nível de risco (alto / médio / baixo) → main_blocker: "Risco alto ignorado", "Risco médio acumulado" ou "Risco recorrente não tratado" |
| **Profissional liberal / Bloqueio** | `BLOCKER_DIAGNOSIS` | Racional, agenda, conversão | Tipo de bloqueio (rotina, processo, hábitos, emocional, expectativa) → main_blocker com o label correspondente |

Escolha **um** perfil por link. Para o mini experimento (liberal vs wellness), use **um link com RISK_DIAGNOSIS** (wellness) e **outro com BLOCKER_DIAGNOSIS** (liberal), e analise separado.

---

### 1.2 Perguntas do formulário (por perfil)

Os **ids** dos campos precisam ser exatamente os abaixo, senão o motor não reconhece. O front envia o que o usuário digitou; a API aceita **texto separado por vírgula** para listas e converte em array (ex.: sintomas "dor, cansaço, insônia" → `["dor","cansaço","insônia"]`).

#### Perfil **RISK_DIAGNOSIS** (Wellness / Risco)

Use estes campos em `config_json.form.fields`:

| id | label (sugestão) | type | O que o motor faz |
|----|------------------|------|-------------------|
| `symptoms` ou `sintomas` | "Quais sinais você nota? (separados por vírgula)" | text | Vira array; cada item = 1 ponto (máx. 6). |
| `history_flags` ou `historico` | "Já teve tratamento/retorno? (separados por vírgula)" | text | Vira array; cada item = 2 pontos (máx. 6). |
| `impact_level` ou `impact` | "Impacto no seu dia a dia?" | text | "alto"=4, "medio"=2, "baixo"=0. |
| `attempts_count` | "Quantas vezes já tentou algo antes?" | number | ≥4=2 pts, ≥2=1 pt. |
| `age` | "Sua idade" | number | ≥45=2 pts, ≥30=1 pt. |

**Exemplo de `form` no config do link:**

```json
"form": {
  "fields": [
    { "id": "symptoms", "label": "Quais sinais você nota? (separados por vírgula)", "type": "text" },
    { "id": "history_flags", "label": "Já fez tratamento ou teve retorno? (separados por vírgula)", "type": "text" },
    { "id": "impact_level", "label": "Impacto no seu dia a dia?", "type": "text" },
    { "id": "attempts_count", "label": "Quantas vezes já tentou algo antes?", "type": "number" },
    { "id": "age", "label": "Sua idade", "type": "number" }
  ],
  "submit_label": "Ver meu resultado"
}
```

Para **impact_level** o usuário precisa digitar exatamente "alto", "medio" ou "baixo" (ou você pode usar um select no front com essas três opções).

---

#### Perfil **BLOCKER_DIAGNOSIS** (Profissional liberal / Bloqueio)

| id | label (sugestão) | type | O que o motor faz |
|----|------------------|------|-------------------|
| `barriers` ou `barreiras` | "O que mais te atrapalha? (separados por vírgula)" | text | Palavras-chave: rotina, tempo, emocional, processo, hábitos, expectativa → somam pontos por tipo. |
| `routine_consistency` | "Sua rotina é consistente? (1–10)" | number | ≤4 soma pontos em "rotina". |
| `emotional_triggers` | "Emocionalmente estável? (1–10)" | number | ≤4 soma em "emocional". |
| `process_clarity` | "Clareza do seu processo? (1–10)" | number | ≤4 soma em "processo". |
| `habits_quality` | "Qualidade dos hábitos? (1–10)" | number | ≤4 soma em "hábitos". |
| `goal_realism` | "Suas metas são realistas? (1–10)" | number | ≤4 soma em "expectativa". |

**Exemplo de `form` no config do link:**

```json
"form": {
  "fields": [
    { "id": "barriers", "label": "O que mais te atrapalha? (ex.: tempo, ansiedade, falta de clareza)", "type": "text" },
    { "id": "routine_consistency", "label": "Sua rotina é consistente? (1 a 10)", "type": "number" },
    { "id": "emotional_triggers", "label": "Emocionalmente estável? (1 a 10)", "type": "number" },
    { "id": "process_clarity", "label": "Clareza do seu processo? (1 a 10)", "type": "number" },
    { "id": "habits_quality", "label": "Qualidade dos hábitos? (1 a 10)", "type": "number" },
    { "id": "goal_realism", "label": "Suas metas são realistas? (1 a 10)", "type": "number" }
  ],
  "submit_label": "Ver meu resultado"
}
```

---

### 1.3 Interpretação: respostas → diagnóstico

Assim você confere se “acertou o perfil”: dadas as respostas, qual main_blocker / nível deve aparecer.

#### RISK_DIAGNOSIS (pontos → nível → main_blocker)

O motor soma:

- **Sintomas:** 1 ponto por item (máx. 6).
- **Histórico (history_flags):** 2 pontos por item (máx. 6).
- **Impacto:** "alto"=4, "medio"=2, "baixo"=0.
- **Tentativas (attempts_count):** ≥4 = 2 pts, ≥2 = 1 pt.
- **Idade (age):** ≥45 = 2 pts, ≥30 = 1 pt.

**Total:**

- **≥ 11** → nível **alto** → main_blocker = **"Risco alto ignorado"**
- **≥ 6 e &lt; 11** → nível **médio** → main_blocker = **"Risco médio acumulado"**
- **&lt; 6** → nível **baixo** → main_blocker = **"Risco recorrente não tratado"**

Exemplos rápidos:

- 3 sintomas + 2 itens histórico + impacto alto + 4 tentativas + 45 anos → 3+4+4+2+2 = 15 → **alto** → "Risco alto ignorado".
- 1 sintoma + impacto médio + 2 tentativas + 30 anos → 1+2+1+1 = 5 → **baixo** → "Risco recorrente não tratado". (Para cair em médio, precisa ≥6.)

#### BLOCKER_DIAGNOSIS (palavras + notas → bloqueio)

O motor conta **palavras-chave** no texto de `barriers`/`barreiras` (rotina, tempo, emocional, processo, hábitos, expectativa, etc.) e soma pontos com as notas 1–10 (cada ≤4 soma no bloqueio correspondente). O **bloqueio com mais pontos** vence; em empate, a ordem é: rotina → processo → hábitos → emocional → expectativa.

**main_blocker** exibido:

- rotina → **"Rotina desorganizada"**
- processo → **"Processo pouco claro"**
- habitos → **"Hábitos inconsistentes"**
- emocional → **"Bloqueio emocional"**
- expectativa → **"Expectativa descalibrada"**

Exemplo: usuário escreve "tempo, organização" e dá 3 em routine_consistency → forte em rotina → "Rotina desorganizada".

---

Depois de escolher o perfil, colar as perguntas no config do link e entender a interpretação, use o **passo a passo dos testes** abaixo para validar no banco e na API.

---

## Passo a passo dos testes (ordem a seguir)

### Pré-requisitos

- App rodando em desenvolvimento (`npm run dev` ou equivalente).
- Supabase acessível (migrations rodadas; você consegue abrir o SQL Editor / tabelas).

---

### Passo 1 — Rodar as migrations

No Supabase (SQL Editor ou seu fluxo de migração), execute na ordem:

1. `migrations/225-ylada-diagnosis-metrics.sql`
2. `migrations/226-ylada-diagnosis-metrics-cta-variant.sql`
3. `migrations/227-ylada-diagnosis-metrics-user-agent-ip-hash.sql`
4. `migrations/228-ylada-diagnosis-read-time.sql`

**Conferir:** tabela `ylada_diagnosis_metrics` tem também `diagnosis_shown_at` e `diagnosis_read_time_ms` (tempo de leitura do resultado até o clique).

---

### Passo 2 — Ter um link de teste

Você precisa de um link **ativo** com:

- `status` = `'active'`
- `config_json.meta.architecture` = o perfil que você escolheu (ex.: `'RISK_DIAGNOSIS'`)
- `config_json.meta.theme_raw` (ou `theme.raw`) preenchido
- `config_json.meta.objective` (ex.: `'captar'`)
- `config_json.form.fields` = **as perguntas da seção 1.2** para esse perfil (ids exatos)

Use as perguntas da **seção 1.2** (RISK_DIAGNOSIS ou BLOCKER_DIAGNOSIS) no `form.fields`. Exemplo mínimo para RISK (completo em 1.2):

```json
{
  "meta": {
    "architecture": "RISK_DIAGNOSIS",
    "theme_raw": "sua saúde",
    "objective": "captar",
    "flow_id": "teste"
  },
  "page": { "title": "Teste" },
  "form": {
    "fields": [
      { "id": "symptoms", "label": "Quais sinais você nota? (separados por vírgula)", "type": "text" },
      { "id": "history_flags", "label": "Já fez tratamento ou teve retorno? (separados por vírgula)", "type": "text" },
      { "id": "impact_level", "label": "Impacto no seu dia a dia? (alto, medio ou baixo)", "type": "text" },
      { "id": "attempts_count", "label": "Quantas vezes já tentou algo antes?", "type": "number" },
      { "id": "age", "label": "Sua idade", "type": "number" }
    ],
    "submit_label": "Ver meu resultado"
  }
}
```

**Conferir:** na tabela `ylada_links`, o link existe e tem esse `slug`. Anote o `slug` para os próximos passos.

---

### Passo 3 — POST diagnosis (risco alto)

Envie um POST para a API de diagnóstico (troque `SEU_SLUG` pelo slug do passo 2).

**URL:** `POST http://localhost:3000/api/ylada/links/SEU_SLUG/diagnosis`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**

```json
{
  "visitor_answers": {
    "symptoms": ["dor", "cansaco", "insonia"],
    "history_flags": ["tratamento_anterior", "retorno"],
    "impact_level": "alto",
    "attempts_count": 4,
    "age": 45
  }
}
```

**Conferir na resposta (200):**

- `diagnosis` com: `profile_title`, `profile_summary`, `main_blocker`, `consequence`, `growth_potential`, `cta_text`, `whatsapp_prefill`
- `main_blocker` = `"Risco alto ignorado"`
- `cta_text` imperativo (ex.: `"Analise seu caso"`)
- `metrics_id` = um UUID

**Copie e guarde o `metrics_id`** para o passo 5.

---

### Passo 4 — Conferir INSERT no banco

No Supabase, abra a tabela `ylada_diagnosis_metrics` e localize a linha cujo `id` é o `metrics_id` da resposta do passo 3.

**Conferir:**

- `link_id` = id do seu link de teste
- `architecture` = `RISK_DIAGNOSIS`
- `level` = `alto`
- `main_blocker` = `Risco alto ignorado`
- `fallback_used` = `false`
- `cta_variant` preenchido (ex.: "Analise seu caso")
- `clicked_whatsapp` = `false`
- `clicked_at` = null
- `time_to_click_ms` = null

---

### Passo 5 — POST events (simular clique no CTA)

Envie um POST para a API de events (troque `SEU_SLUG` e `METRICS_ID`).

**URL:** `POST http://localhost:3000/api/ylada/links/events`  
**Headers:** `Content-Type: application/json`  
**Body:**

```json
{
  "slug": "SEU_SLUG",
  "event_type": "cta_click",
  "metrics_id": "METRICS_ID"
}
```

**Conferir na resposta:** `{ "success": true }`.

---

### Passo 6 — Conferir UPDATE no banco

Na mesma linha de `ylada_diagnosis_metrics` (id = `metrics_id`):

**Conferir:**

- `clicked_whatsapp` = `true`
- `clicked_at` preenchido (timestamp)
- `time_to_click_ms` ≥ 0 (tempo desde o diagnóstico até o clique)
- `diagnosis_shown_at` preenchido (o front dispara `result_view` ao exibir o resultado)
- `diagnosis_read_time_ms` ≥ 0 (tempo de permanência na página do resultado até o clique)

---

### Passo 7 (opcional) — Clique duplo

Com o **mesmo** `metrics_id` do passo 5, envie **de novo** o mesmo body do passo 5 (segundo “clique”).

**Conferir no banco:** a linha **não** deve mudar: `clicked_at` e `time_to_click_ms` continuam com os valores do primeiro clique. (O segundo clique não atualiza.)

---

### Passo 8 (opcional) — Risco médio

Repita o **passo 3** com este body (mesmo slug):

```json
{
  "visitor_answers": {
    "symptoms": ["um_sinal"],
    "impact_level": "medio",
    "attempts_count": 2,
    "age": 30
  }
}
```

**Conferir na resposta:** `main_blocker` = `"Risco médio acumulado"`; textos com tom menos agressivo que o risco alto.

---

### Passo 9 (opcional) — Query de integridade

No Supabase (SQL Editor):

```sql
SELECT main_blocker,
       count(*) AS total,
       sum(CASE WHEN clicked_whatsapp THEN 1 ELSE 0 END) AS clicks
FROM ylada_diagnosis_metrics
GROUP BY main_blocker
ORDER BY total DESC;
```

**Conferir:** totais e cliques batem com os testes que você fez (ex.: pelo menos 1 linha “Risco alto ignorado” com 1 click se você fez passo 5).

---

Quando os passos 1–6 (e, se fizer, 7–9) estiverem ok, pode seguir para produção controlada.

---

## 1. Ajustes já aplicados no código

- **IP:** `x-forwarded-for` com múltiplos IPs → usar sempre o primeiro: `split(',')[0].trim()`; senão `x-real-ip`; senão `null`. (Vem em `diagnosis/route.ts`.)
- **time_to_click_ms:** `Math.max(0, valor)` para nunca ficar negativo. (Vem em `events/route.ts`.)
- **CTA click:** UPDATE em `ylada_diagnosis_metrics` só quando `clicked_whatsapp = false` (primeiro clique); segundo clique não altera `time_to_click_ms` nem `clicked_at`. (Select verifica `clicked_whatsapp`; UPDATE usa `.eq('clicked_whatsapp', false)`.)

---

## 2. Dados exatos de teste (visitor_answers)

O motor RISK_DIAGNOSIS usa: `symptoms` ou `sintomas` (array), `history_flags` ou `historico`/`history` (array), `impact_level` ou `impact` (string ou number), `attempts_count` (number), `age` (number).  
Pontos: sintomas (até 6), histórico (até 6 × 2), impact alto=4/medio=2/baixo=0, attempts≥4=2/≥2=1, age≥45=2/≥30=1. **Total ≥ 11 = alto, ≥ 6 = médio.**

### TESTE 1 — Risco ALTO (diagnóstico forte)

Objetivo: `main_blocker` = "Risco alto ignorado", tom direto, CTA imperativo, métrica gravada.

```json
{
  "visitor_answers": {
    "symptoms": ["dor", "cansaco", "insonia"],
    "history_flags": ["tratamento_anterior", "retorno"],
    "impact_level": "alto",
    "attempts_count": 4,
    "age": 45
  }
}
```

Validar na resposta e no banco: `level` = "alto", `main_blocker` = "Risco alto ignorado", `consequence` com tom direto, `cta_text` imperativo (ex.: "Analise seu caso"), `metrics_id` presente; após clique: `clicked_whatsapp` = true, `time_to_click_ms` > 0.

---

### TESTE 2 — Risco MÉDIO (variação de tom)

Objetivo: consequence menos agressivo, growth_potential mais estratégico, summary entre 180–350.

```json
{
  "visitor_answers": {
    "symptoms": ["um_sinal"],
    "impact_level": "medio",
    "attempts_count": 2,
    "age": 30
  }
}
```

Validar: `level` = "medio", `main_blocker` = "Risco médio acumulado"; texto sem corte estranho; summary no intervalo 180–350.

---

### TESTE 3 — Forçar fallback (validação falha) ⭐ **O MAIS IMPORTANTE**

**Por que:** a maior parte das falhas aparece no fallback; é onde muitos sistemas quebram em silêncio e onde a métrica costuma falhar. Se o fallback funcionar liso, o sistema está robusto.

Objetivo: `fallbackUsed` = true, diagnóstico ainda dentro do contrato, métricas com `fallback_used` = true.

**Como forçar:** alterar temporariamente um template para que a validação falhe.

1. Em `src/lib/ylada/diagnosis-templates.ts`, no objeto `RISK` (RISK_DIAGNOSIS), trocar `consequence` por uma frase **sem** marcador de tensão e sem verbo de impacto, por exemplo:

   ```ts
   consequence: 'Situação neutra sem ação.',
   ```

2. Fazer um POST para `/api/ylada/links/{slug}/diagnosis` com qualquer `visitor_answers` de RISK (ex.: teste 1 ou 2).
3. Na resposta: `fallbackUsed` deve ser `true`; o objeto `diagnosis` deve vir preenchido (fallback seguro) e passar na validação (resumo, consequence, growth_potential, CTA imperativo).
4. No banco, a linha em `ylada_diagnosis_metrics` deve ter `fallback_used` = true.
5. Reverter a alteração em `diagnosis-templates.ts` (deixar a `consequence` original).

---

### TESTE 4 — Clique duplo no CTA

1. Gerar um diagnóstico (POST diagnosis) e guardar `metrics_id`.
2. Chamar POST `/api/ylada/links/events` duas vezes seguidas com o mesmo `slug`, `event_type: 'cta_click'` e `metrics_id`.
3. Validar no banco: uma única linha para esse `metrics_id`; `clicked_whatsapp` = true; `time_to_click_ms` e `clicked_at` devem refletir o **primeiro** clique (o segundo não deve alterar).

---

## 3. Confirmação: UPDATE só quando clicked_whatsapp = false

No código (`src/app/api/ylada/links/events/route.ts`):

- Antes do UPDATE, é feita leitura da linha com `select('created_at, clicked_whatsapp')`.
- O UPDATE só é executado se `metric.clicked_whatsapp === false`.
- O próprio UPDATE inclui `.eq('clicked_whatsapp', false)`, para não alterar linhas já clicadas (idempotente e seguro em concorrência).

Assim, apenas o primeiro clique registra `clicked_whatsapp`, `clicked_at` e `time_to_click_ms`.

---

## 4. Roteiro ponta a ponta (6 passos)

1. **Migrations:** Rodar 225, 226 e 227 no Supabase (ou seu fluxo de migração).
2. **Link de teste:** Ter um link ativo com `slug` conhecido e `config_json.meta` com `architecture: 'RISK_DIAGNOSIS'` (e theme_raw, objective, etc.).
3. **POST diagnosis:** Enviar POST para `/api/ylada/links/{slug}/diagnosis` com body do TESTE 1. Conferir resposta: `diagnosis` completo e `metrics_id` (UUID).
4. **Banco (INSERT):** Na tabela `ylada_diagnosis_metrics`, localizar a linha pelo `metrics_id`. Conferir: `link_id`, `architecture`, `level` = 'alto', `main_blocker` = 'Risco alto ignorado', `fallback_used` = false, `cta_variant` preenchido, `clicked_whatsapp` = false.
5. **POST events (CTA click):** Enviar POST para `/api/ylada/links/events` com `slug`, `event_type: 'cta_click'`, `metrics_id` (o mesmo do passo 3).
6. **Banco (UPDATE):** Na mesma linha de `ylada_diagnosis_metrics`, conferir: `clicked_whatsapp` = true, `clicked_at` preenchido, `time_to_click_ms` ≥ 0.

Depois: repetir com TESTE 4 (dois cta_click) e conferir que a linha não é alterada na segunda chamada.

---

## 5. Query de integridade (métricas no banco)

No Supabase (ou cliente SQL), após alguns testes:

```sql
SELECT main_blocker,
       count(*) AS total,
       sum(CASE WHEN clicked_whatsapp THEN 1 ELSE 0 END) AS clicks
FROM ylada_diagnosis_metrics
GROUP BY main_blocker
ORDER BY total DESC;
```

Conferir se totais e cliques estão coerentes com os testes feitos.

---

## 5.5 Testes da Camada 0 + Single Card + StrategicIntro (como testar agora)

Checklist manual para validar: tema sensível → 1 card + safe_theme + disclaimer; tema não sensível → 2 cards; StrategicIntro antes do formulário; persistência intacta.

**Pré-requisito:** app rodando (`npm run dev`), usuário logado em área que acessa Links (ex.: `/pt/links`). Migrations 225–228 (e 230 se usar template diagnostico) aplicadas.

### Teste A — Tema sensível + captar (1 card, safe_theme, sem “risco em medicamento”)

| # | Ação | Conferir |
|---|------|----------|
| A1 | Na tela de Links, digitar: **"Sou médico, quero captar pacientes para tizerpatide"** (ou "semaglutida", "ozempic"). Clicar em **Avançar**. | Aparece **1 card** (não dois). Headline: *"Para o seu objetivo, esta é a estratégia mais eficaz."* Badge: *"Recomendado"*. Botão: *"Usar esta estratégia"*. |
| A2 | Clicar em **Usar esta estratégia**. Na tela de detalhe, clicar **Gerar meu link** (ou ir direto para prévia) e **Confirmar e gerar link**. | Link é criado. Título do link deve ser algo como **"Raio-X de Estratégia — controle de peso"** (ou "emagrecimento assistido" / safe_theme do contexto), **nunca** "tizerpatide" no título. |
| A3 | Abrir a **URL do link** (ex.: `https://seu-dominio/l/XXXXXX`) em aba anônima ou outro navegador. | Primeira tela: **StrategicIntro** — *"Estratégia recomendada ativada."* + subtítulo + *"Leva menos de 2 minutos."* + botão **Começar**. |
| A4 | Clicar **Começar**. Preencher as perguntas do formulário e enviar. | Tela de resultado: texto do diagnóstico **não** contém "tizerpatide", "semaglutida" nem nome de medicamento. Deve usar tema genérico (ex.: "controle de peso"). |
| A5 | No final do texto do resultado, verificar rodapé. | Frase de **disclaimer**: *"Isto não é orientação médica. A avaliação individual é feita em consulta."* |
| A6 | (Opcional) No Supabase: `ylada_links` → link criado → `config_json.meta`. | Existe `safety_mode: true`, `theme_display` (ex.: "controle de peso"), `intent`, `sensitivity_tags`, `copy_policy`. |

### Teste B — Tema não sensível + captar (2 cards, fluxo normal)

| # | Ação | Conferir |
|---|------|----------|
| B1 | **Alterar objetivo/tema.** Digitar: **"Quero captar pessoas para melhorar energia e hábitos"**. Clicar **Avançar**. | Aparecem **2 cards** (Qualidade e Volume): ex. "Raio-X de Saúde" e "Raio-X de Estratégia". Texto: *"Identificamos duas estratégias. Escolha uma:"*. |
| B2 | Escolher um dos dois (ex.: Raio-X de Saúde). Gerar o link e abrir a URL pública. | StrategicIntro com texto de **duas estratégias** (ex.: *"Vamos estruturar sua estratégia."*). Após **Começar**, formulário com perguntas do fluxo (ex.: sinais, histórico, impacto). |
| B3 | Preencher e enviar. | Resultado **pode** mencionar o tema (ex.: "energia", "hábitos"); **não** há disclaimer de orientação médica (safety_mode não ativo). |

### Teste C — StrategicIntro em todos os fluxos

| # | Ação | Conferir |
|---|------|----------|
| C1 | Abrir **qualquer** link ativo que use flow (config com `meta.architecture` e `form.fields`). | **Sempre** a primeira tela é o bloco StrategicIntro (título + subtítulo + micro + **Começar**). Nunca aparece pergunta direto. |
| C2 | Clicar **Começar**. | Segunda tela = primeira pergunta do formulário. Preenchimento e submit seguem iguais ao que já existia. |
| C3 | Gerar um link com tema sensível (Teste A) e um com tema não sensível (Teste B). Abrir cada um. | Intro do tema sensível: *"Estratégia recomendada ativada."* Intro do tema não sensível: *"Vamos estruturar sua estratégia."* (ou equivalente por objective/area). |

### Teste D — Persistência e métricas (nada quebrou)

| # | Ação | Conferir |
|---|------|----------|
| D1 | Após preencher e ver resultado em qualquer link, clicar no CTA (WhatsApp). | Navegação/WhatsApp abre; nenhum erro no console. |
| D2 | No Supabase: `ylada_diagnosis_metrics` — última linha do link usado. | Campos preenchidos como antes: `level`, `main_blocker`, `clicked_whatsapp`, `theme`, etc. |
| D3 | Conferir que o **formulário** envia os mesmos campos e que o **diagnosis** retorna a mesma estrutura. | Nenhuma alteração no contrato da API de diagnosis; `visitor_answers` e `diagnosis` iguais aos já documentados. |

### Ordem sugerida para rodar

1. **Teste C** (rápido): abrir um link existente → intro → Começar → form. Garante que o intro não quebrou o fluxo.
2. **Teste B**: tema não sensível → 2 cards → gerar → abrir link → intro + form + resultado.
3. **Teste A**: tema sensível → 1 card → gerar → abrir link → intro + form + resultado sem medicamento + disclaimer.
4. **Teste D**: conferir métricas e persistência após um ou dois fluxos completos.

Se algum item falhar, anotar: qual teste, qual passo, o que apareceu vs. o esperado. Isso basta para corrigir e re-testar.

---

## 6. Resumo

| Check | Onde |
|-------|------|
| IP = primeiro de x-forwarded-for | `diagnosis/route.ts` — getClientIp |
| time_to_click_ms ≥ 0 | `events/route.ts` — Math.max(0, …) |
| Só primeiro clique atualiza métrica | `events/route.ts` — if clicked_whatsapp === false + .eq('clicked_whatsapp', false) |
| Dados de teste RISK alto/médio | Este doc — TESTE 1 e 2 |
| Forçar fallback | Este doc — TESTE 3 (alterar template, chamar API, reverter) |
| Clique duplo | Este doc — TESTE 4 |

Após validar esses pontos em desenvolvimento, pode seguir para produção controlada.

---

## 7. Depois dos testes manuais — primeiro teste real

- **Não ir direto para tráfego pago.** Primeiro: ~10 pessoas reais da base (preencher → observar se clicam → perguntar como se sentiram lendo).
- **Decisão estratégica:** o primeiro teste real pode ser **silencioso** (só medir comportamento) ou **com pergunta** para quem clicou: *"O que mais te chamou atenção no diagnóstico?"* — isso muda a profundidade da leitura.
