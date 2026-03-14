# Dados de Intenção YLADA

**Objetivo:** Documentar como os dados de intenção são modelados, armazenados e usados na plataforma. Esses dados são um dos ativos mais valiosos do YLADA no longo prazo.

---

## 1. O que são dados de intenção

Dados de intenção são sinais do que uma pessoa **quer**, **precisa** ou está **tentando resolver** no momento em que responde a um diagnóstico.

Exemplos reais no YLADA:

- "Tenho dificuldade para emagrecer depois dos 40"
- "Quero melhorar minha pele"
- "Minha clínica está com agenda vazia"
- "Tenho problema de intestino preso"

Essas respostas indicam **intenção real**, não apenas interesse genérico — e mostram demanda concreta.

---

## 2. Por que esses dados valem muito

- **Necessidades reais do mercado** — problemas recorrentes
- **Comportamento de decisão** — o que leva à ação
- **Vantagem competitiva** — difícil de copiar

Plataformas como Google (buscas) e Amazon (histórico de compra) usam dados de intenção para orientar produtos. O YLADA coleta intenção **estruturada** através de perguntas e respostas classificadas.

---

## 3. Estrutura no sistema

### Tabela: `ylada_diagnosis_answers`

| Campo | Descrição |
|-------|-----------|
| `metrics_id` | Referência ao diagnóstico (ylada_diagnosis_metrics) |
| `link_id` | Link onde o diagnóstico foi respondido |
| `segment` | Segmento (emagrecimento, perfumaria, estética, etc.) |
| `question_id` | ID da pergunta (q1, q2, symptoms, barriers, etc.) |
| `answer_text` | Texto da opção escolhida (ex.: ansiedade, dor) |
| `answer_value` | Valor bruto (número, string ou array) |
| `intent_category` | Tipo de intenção (dificuldade, objetivo, sintoma, etc.) |
| `theme` | Tema do link |
| `objective` | Objetivo do link |
| `created_at` | Timestamp |

### Categorias de intenção (`intent_category`)

| Categoria | Descrição | Exemplo de question_id |
|-----------|-----------|------------------------|
| `dificuldade` | Maior dificuldade relatada | q1 |
| `objetivo` | O que a pessoa quer alcançar | q4, objetivo |
| `sintoma` | Sintomas relatados | symptoms, sintomas |
| `barreira` | Barreiras/obstáculos | barriers, barreiras |
| `tentativa` | O que já tentou | q2, ja_tentei |
| `causa` | Causa provável | q3, causa |
| `contexto` | Contexto (idade, etc.) | idade, age |
| `preferencia` | Preferências (ex.: perfume) | perfume_*, uso_principal |
| `historico` | Histórico de tratamentos | history_flags, historico |
| `outro` | Demais perguntas | — |

O mapeamento está em `src/config/intent-category-map.ts`.

---

## 4. Views para analytics

As views abaixo facilitam consultas de padrões de intenção:

### `v_intent_answers_by_segment`

Respostas mais frequentes por segmento e categoria de intenção.

### `v_intent_combinations`

Combinações mais comuns de respostas (ex.: dificuldade=ansiedade + objetivo=perder 10kg).

### `v_intent_trends`

Evolução temporal de intenções por segmento.

---

## 5. Como o Noel usa esses dados

O Noel pode consumir dados de intenção para:

- **Sugerir perguntas** que geram mais respostas
- **Sugerir diagnósticos** que convertem mais
- **Adaptar estratégias** para cada perfil
- **Enriquecer respostas** com insights reais (ex.: "60% das pessoas que querem emagrecer relatam ansiedade como principal dificuldade")

A integração é feita via `getIntentInsightsContext()` quando a mensagem menciona diagnóstico ou resultado.

---

## 6. Cuidados (LGPD e privacidade)

- **Anonimizar** — não armazenar dados pessoais sensíveis
- **Estruturar** — dados estruturados para análise
- **Minimizar** — só o necessário para o propósito

---

## 7. Impacto no valuation

Quando a plataforma tem:

1. Receita recorrente (SaaS)
2. Rede de usuários
3. **Dados proprietários estruturados** (incluindo intenção)

ela ganha um ativo adicional: **inteligência de mercado baseada em dados reais**. Investidores valorizam isso por criar vantagem competitiva difícil de copiar.
