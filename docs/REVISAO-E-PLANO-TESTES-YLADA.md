# Revisão e Plano de Testes — YLADA (Profissionais de Saúde + Perfumaria)

**Data:** 10/03/2026  
**Objetivo:** Validar o fluxo completo desde a chegada do visitante até o CTA, para todos os profissionais de saúde e área de perfumaria.

---

## 1. Onde estamos — Visão geral

### 1.1 Fluxo do link público (visitante)

```
1. Chegada     → /l/[slug] carrega → trackEvent('view')
2. Abertura    → Intro (StrategicIntro) → botão "Começar"
3. Formulário  → Perguntas q1..q5 → trackEvent('start') ao responder primeira
4. Submissão   → trackEvent('complete') → POST /api/ylada/links/[slug]/diagnosis
5. Diagnóstico → Motor calcula (RISK, BLOCKER, PERFUME_PROFILE, etc.) → retorna resultado
6. Resultado   → Exibe na tela → trackEvent('result_view', { metrics_id })
7. CTA         → Clique no botão → trackEvent('cta_click', { metrics_id }) → abre WhatsApp
```

### 1.2 Arquiteturas de diagnóstico suportadas

| Arquitetura | Área típica | Saída principal |
|-------------|-------------|------------------|
| RISK_DIAGNOSIS | Saúde (emagrecimento, intestino) | level: baixo/médio/alto |
| BLOCKER_DIAGNOSIS | Profissional liberal | blocker_type: rotina, emocional, etc. |
| PERFUME_PROFILE | Perfumaria | profile_code + perfume_usage |
| PROFILE_TYPE | Perfil comportamental | profile_type |
| READINESS_CHECKLIST | Checklist prontidão | score 0–100 |
| PROJECTION_CALCULATOR | Calculadora | projection + warning |

### 1.3 Componentes principais

| Componente | Arquivo | Função |
|------------|---------|--------|
| Página pública | `src/app/l/[slug]/page.tsx` | Busca link, monta payload |
| View do link | `src/components/ylada/PublicLinkView.tsx` | Intro, form, resultado, CTA |
| API diagnóstico | `src/app/api/ylada/links/[slug]/diagnosis/route.ts` | Normaliza respostas, chama motor, grava métricas |
| Motor | `src/lib/ylada/diagnosis-engine.ts` | Calcula score/bloqueio/perfil |
| Eventos | `src/app/api/ylada/links/events/route.ts` | view, start, complete, result_view, cta_click |
| Leads | `src/components/ylada/LeadsPageContent.tsx` | Lista métricas, filtro perfume_usage |

---

## 2. Estado por área

### 2.1 Profissionais de saúde (médico, psi, odonto, nutri, coach)

- **Interpret:** `/api/ylada/interpret` — detecta tema, flow_id, objetivo
- **Strategies:** `diagnostico_risco` ou `diagnostico_bloqueio` para captar
- **Archetypes:** `ylada_diagnosis_archetypes` com segment_code (geral, medicina, etc.)
- **Tom adaptativo:** `getAdaptiveDiagnosisIntro` e `getAdvancedCta` para links B2B (agenda, posicionamento)
- **Crises:** Os 5 archetypes (Leve, Moderado, Urgente, Bloqueio prático, Bloqueio emocional) funcionam via RISK_DIAGNOSIS + BLOCKER_DIAGNOSIS

### 2.2 Perfumaria

- **Biblioteca:** `ylada_biblioteca_itens` com segmento perfumaria
- **Archetypes:** 8 perfis (Elegância Natural, Presença Magnética, Leveza Floral, etc.)
- **PERFUME_PROFILE:** q3 → perfume_usage (trabalho, dia_a_dia, encontros, eventos)
- **WhatsApp prefill:** Inclui perfil + uso principal
- **Leads:** Filtro por perfume_usage

### 2.3 Migrations perfumaria

| # | Arquivo | Status |
|---|---------|--------|
| 249 | ylada-perfumaria-archetypes.sql | ✅ (8 archetypes) |
| 250 | ylada-perfumaria-quizzes-virais.sql | ✅ (12 quizzes + biblioteca) |
| 251 | ylada-perfumaria-archetypes-cta-forte.sql | ✅ (CTA "Quero receber sugestões") |
| 252 | ylada-biblioteca-perfumaria-meta.sql | ✅ (meta PERFUME_PROFILE) |
| 253 | ylada-diagnosis-metrics-perfume-usage.sql | ✅ (coluna perfume_usage) |

*Nota: O checklist antigo citava 248; a 250 já cria templates + itens da biblioteca.*

---

## 3. Plano de testes

### 3.1 Teste 1 — Fluxo completo (chegada → CTA)

**Objetivo:** Garantir que todos os eventos são disparados e o diagnóstico é gerado.

1. **Pré-requisito:** Usuário com link ativo (ex.: quiz de emagrecimento ou perfumaria)
2. **Passos:**
   - Abrir `/l/[slug]` em aba anônima
   - Verificar: intro aparece, título correto
   - Clicar "Começar"
   - Responder todas as perguntas
   - Clicar "Ver resultado"
   - Verificar: diagnóstico exibido (perfil/bloqueio/nível)
   - Clicar no CTA (WhatsApp)
3. **Validação:**
   - `ylada_link_events`: view, start, complete, result_view, cta_click
   - `ylada_diagnosis_metrics`: 1 linha nova, `clicked_whatsapp = true`

### 3.2 Teste 2 — Saúde (RISK_DIAGNOSIS)

**Objetivo:** Quiz de emagrecimento/intestino retorna nível coerente.

1. Perfil "Médico emagrecimento" ativo em `/pt/perfis-simulados`
2. Noel: "quero captar para emagrecimento" → gerar link
3. Abrir link → responder quiz
4. **Esperado:** level = baixo/médio/alto conforme respostas
5. Archetype exibido (se existir para segment_code)

### 3.3 Teste 3 — Saúde (BLOCKER_DIAGNOSIS)

**Objetivo:** Quiz de bloqueio retorna blocker_type coerente.

1. Link com `meta.architecture: BLOCKER_DIAGNOSIS`
2. Responder q1 (rotina), q2 (emocional), q3 (processo), q4 (hábitos)
3. **Esperado:** blocker_type = rotina | emocional | processo | habitos | expectativa

### 3.4 Teste 4 — Perfumaria (PERFUME_PROFILE)

**Objetivo:** Quiz perfumaria retorna perfil + perfume_usage.

1. Ativar perfil "Vendedor de perfumes" em `/pt/perfis-simulados`
2. Biblioteca → segmento "Perfumaria e fragrâncias" → criar link de um quiz
3. Abrir link → responder 5 perguntas (q3 = "Onde você usa perfume?")
4. **Esperado:**
   - Perfil: um dos 8 (Elegância Natural, etc.)
   - perfume_usage: trabalho | dia_a_dia | encontros | eventos
   - CTA: "Quero receber sugestões de perfumes"
   - WhatsApp prefill: perfil + "Uso principal: [valor]"

### 3.5 Teste 5 — Métricas e Leads

**Objetivo:** perfume_usage gravado e exibido em Leads.

1. Após responder quiz perfumaria (q3 = "Dia a dia")
2. Verificar Supabase: `ylada_diagnosis_metrics` — coluna `perfume_usage = 'dia_a_dia'`
3. Acessar `/pt/leads` (ou rota equivalente da área)
4. **Esperado:** Tabela com Data, Link, Resultado, Uso perfume, WhatsApp
5. Filtro "Uso do perfume" → Dia a dia → lista filtrada

### 3.6 Teste 6 — CTA com modelo novo (tom adaptativo)

**Objetivo:** Links B2B (agenda, posicionamento) usam intro e CTA adaptativos.

1. Link com `meta.strategic_profile` e tema tipo "agenda" ou "posicionamento"
2. **Esperado:** `getAdaptiveDiagnosisIntro` e `getAdvancedCta` alteram texto
3. `ylada_diagnosis_metrics`: `intro_variant` e `cta_variant` preenchidos

### 3.7 Teste 7 — Cache e reutilização

**Objetivo:** Mesmas respostas retornam diagnóstico do cache.

1. Responder quiz com combinação específica (ex.: q1=A, q2=B, q3=C)
2. Anotar diagnóstico
3. Limpar cookies/localStorage, responder exatamente igual
4. **Esperado:** Mesmo resultado, resposta rápida (cache hit)

---

## 4. Checklist de validação rápida

| # | Item | Como verificar |
|---|------|----------------|
| 1 | Migration 253 rodada | `perfume_usage` existe em `ylada_diagnosis_metrics` |
| 2 | Eventos view/start/complete | `ylada_link_events` após fluxo completo |
| 3 | result_view com metrics_id | `diagnosis_shown_at` preenchido |
| 4 | cta_click atualiza métricas | `clicked_whatsapp`, `clicked_at`, `diagnosis_read_time_ms` |
| 5 | perfume_usage em PERFUME_PROFILE | Coluna preenchida em metrics |
| 6 | WhatsApp prefill com uso | Mensagem inclui "Uso principal: dia a dia" |
| 7 | Leads filtro perfume_usage | API `/api/ylada/links/metrics?perfume_usage=dia_a_dia` |

---

## 5. Pontos de atenção

1. **Perfis simulados:** Garantir que "Vendedor de perfumes" existe em `data/perfis-simulados.ts` ou equivalente.

2. **Rota Leads:** Por área: `/pt/leads` (matrix/ylada), `/pt/nutra/leads`, `/pt/psi/leads`, `/pt/odonto/leads`, `/pt/psicanalise/leads`, `/pt/coach/ylada-leads`.

3. **Crises (5 archetypes):** Confirmar que `ylada_diagnosis_archetypes` tem os códigos corretos para RISK_DIAGNOSIS (leve, moderado, urgente) e BLOCKER_DIAGNOSIS (bloqueio_pratico, bloqueio_emocional).

---

## 6. Ordem sugerida de execução

1. Rodar migration 253 (se ainda não rodou)
2. Teste 1 (fluxo completo) — smoke test
3. Teste 4 (perfumaria) — end-to-end perfumaria
4. Teste 5 (métricas e leads)
5. Testes 2 e 3 (saúde)

---

*Documento criado em 10/03/2026. Atualizar conforme execução dos testes.*
