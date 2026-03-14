# Arquitetura de Dados Comportamentais YLADA

**Objetivo:** Transformar o YLADA em uma das maiores plataformas de dados comportamentais, aumentando valuation através de três ativos: SaaS, rede e dataset proprietário.

**Referência:** Estrutura sugerida em 5 camadas para plataformas de alto valor.

---

## 1. Camada 1 — Dados de Uso da Plataforma (Product Data)

Mostra como os profissionais usam o YLADA. Essencial para tração e valuation.

### Tabelas existentes que alimentam

| Dado | Fonte atual |
|------|-------------|
| user_id | `auth.users`, `user_profiles` |
| segmento_profissional | `user_profiles.perfil`, `ylada_links.segment` |
| data_criacao_conta | `auth.users.created_at` |
| plano (free/pro) | `subscriptions`, `hasYladaProPlan()` |
| diagnosticos_criados | `ylada_links` (count) + `ylada_diagnosis_metrics` |
| respostas_recebidas | `ylada_diagnosis_metrics` (count) |
| analises_noel_usadas | `ylada_noel_monthly_usage` |
| ultimo_acesso | `auth.users.last_sign_in_at` |

### Métricas derivadas

- Taxa de conversão free → pro
- Retenção de usuários
- Diagnósticos criados por usuário
- Crescimento mensal da base

---

## 2. Camada 2 — Dados de Comportamento dos Leads (Diagnosis Data)

**O ouro do YLADA.** Cada diagnóstico gera dados estruturados sobre comportamento humano.

### Tabela: `ylada_diagnosis_answers`

Armazena cada resposta por pergunta, com classificação semântica de intenção.

| Campo | Descrição |
|-------|-----------|
| metrics_id | FK para ylada_diagnosis_metrics |
| link_id | FK para ylada_links |
| segment | Segmento do link (emagrecimento, perfumaria, etc.) |
| question_id | ID da pergunta (q1, q2, symptoms, etc.) |
| answer_text | Texto da opção escolhida |
| answer_value | Valor bruto (número, string ou array) |
| intent_category | Tipo de intenção: dificuldade, objetivo, sintoma, barreira, etc. |

Ver: `docs/DADOS-INTENCAO-YLADA.md` e migration 275/277.

### Exemplo real

```
segmento: emagrecimento
pergunta: qual sua maior dificuldade?
resposta: ansiedade
```

Com escala: dores mais comuns, respostas mais frequentes, perfis comportamentais → **dataset estratégico**.

---

## 3. Camada 3 — Dados de Conversão (Market Intelligence)

Mostra o que gera clientes para os profissionais.

### Tabelas existentes

| Dado | Fonte |
|------|-------|
| diagnosis_id | `ylada_diagnosis_metrics.id` |
| respostas_totais | Count em `ylada_diagnosis_metrics` por link |
| cliques_whatsapp | `ylada_diagnosis_metrics.clicked_whatsapp` |
| conversas_iniciadas | `ylada_link_events` (cta_click) |
| conversoes | `leads` (quando integrado) |

### Insights possíveis

- Quais diagnósticos convertem mais
- Quais perguntas geram mais interesse
- Quais nichos têm mais demanda

---

## 4. Camada 4 — Dados Estratégicos do Noel (Strategy Data)

Inteligência da plataforma sobre o que funciona.

### Tabelas existentes

| Dado | Fonte |
|------|-------|
| perfil_detectado | `ylada_noel_memory.professional_profile` |
| estrategia_recomendada | `ylada_noel_conversation_diagnosis.estrategia` |
| resultado_gerado | `ylada_noel_conversation_diagnosis.exemplo` |
| sucesso_da_estrategia | `ylada_noel_conversation_diagnosis` + métricas de link |

### Tabela: `ylada_noel_strategy_outcomes` (futura)

Para registrar explicitamente: perfil → estratégia → resultado (ex.: 42 respostas).

---

## 5. Camada 5 — Dataset Global da Plataforma

Com tempo: milhões de respostas, milhares de profissionais, centenas de nichos.

### Permite criar

- Benchmarks de mercado
- Relatórios de tendências
- Recomendações automáticas

**Exemplo de insight:** "Diagnósticos com 4 perguntas convertem 37% mais que diagnósticos com 8 perguntas."

---

## 6. Eventos Principais (Event Sourcing)

Tabela unificada para construir análises no futuro.

### Eventos a registrar

| Evento | Quando | Fonte |
|--------|--------|-------|
| `user_created` | Criação de conta | Trigger ou API signup |
| `diagnosis_created` | Link de diagnóstico criado | `ylada_links` INSERT |
| `diagnosis_answered` | Lead respondeu diagnóstico | POST diagnosis (já em metrics) |
| `noel_analysis_used` | Profissional usou Noel | `incrementNoelUsage` |
| `diagnosis_shared` | Link compartilhado | `ylada_link_events` (view) |
| `lead_contact_clicked` | Clique no WhatsApp | `cta_click` → `clicked_whatsapp` |
| `upgrade_to_pro` | Upgrade de plano | Webhook Mercado Pago |

### Tabela: `ylada_behavioral_events`

Eventos genéricos para analytics e valuation.

---

## 7. Princípios para Valor dos Dados

1. **Anonimização:** Nunca armazenar dados pessoais sensíveis (LGPD).
2. **Estrutura:** Dados estruturados para análise (não apenas JSON solto).
3. **Escalabilidade:** Índices e particionamento para volume.

---

## 8. Como o Noel Aprende

Com o tempo, o Noel pode usar dados reais:

- Melhores perguntas por nicho
- Melhores diagnósticos
- Melhores estratégias de conversão

Isso cria **vantagem competitiva** e **IA proprietária**.

---

## 9. Resultado Final

O YLADA passa a ser:

1. **SaaS** de geração de leads
2. **Plataforma** de diagnóstico comportamental
3. **Sistema** de inteligência de mercado

→ Aumento significativo de valuation.
