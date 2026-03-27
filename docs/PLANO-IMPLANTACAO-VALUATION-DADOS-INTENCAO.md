# Plano de implantação — valuation via dados de intenção (YLADA)

**Objetivo:** fortalecer o ativo de dados proprietários (intenção estruturada + conversão) para produto, Noel, reporting e narrativa de valuation, com governança e padrões reprodutíveis.

**Documentos relacionados:** [DADOS-INTENCAO-YLADA.md](./DADOS-INTENCAO-YLADA.md), [ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md](./ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md) (se existir).

---

## 1. Estado atual (baseline)

| Peça | Onde | Função |
|------|------|--------|
| Respostas por pergunta | Tabela `ylada_diagnosis_answers` | Uma linha por pergunta; `intent_category` via `inferIntentCategory` em `src/config/intent-category-map.ts` |
| Métricas de sessão | Tabela `ylada_diagnosis_metrics` | Arquitetura, bloqueio, `clicked_whatsapp`, tempos, tema, objetivo; ligada por `metrics_id` |
| Gravação | `storeDiagnosisAnswers` em `src/lib/ylada/diagnosis-answers-store.ts` | Chamada a partir de `POST /api/ylada/links/[slug]/diagnosis` |
| Views analíticas | `278`, `281`, `282` | Top, tendências mensais, conversão WhatsApp, combinações por diagnóstico |
| Admin Valuation | `GET /api/admin/ylada/valuation`, `/admin/ylada/valuation` | Intenção, conversão, combinações, top, tendências |
| Admin operacional | `GET /api/admin/ylada/behavioral-data` | Eventos + volume de respostas |
| Noel | `src/lib/noel-wellness/intent-insights-context.ts` | Contexto de intenção nas respostas |

**Views:** `278` (top + tendências), `281` (conversão), `282` (combinações).

---

## 2. Princípios de estruturação

1. **Contrato de intenção:** todo `question_id` novo deve ter mapeamento em `intent-category-map.ts` ou justificativa explícita para `outro` (e revisão periódica de `outro`).
2. **Ligação resposta ↔ conversão:** análises de “o que responderam” devem cruzar com `ylada_diagnosis_metrics` (ex.: view agregada intenção × `clicked_whatsapp`).
3. **Labels legíveis:** persistir `question_label` quando o config do link tiver `label` (relatórios e exportações sem depender só de `q1`, `q2`).
4. **Governança:** sem PII em `ylada_diagnosis_answers`; IP apenas como hash em métricas; política de retenção documentada (fase posterior).

---

## 3. Fases de implementação

### Fase 1 — Padrão e inventário (contínuo, ~1–2 sprints)

- [ ] Checklist para novos links/templates (seção 4 abaixo) no fluxo de review (biblioteca / generate).
- [ ] Auditoria SQL: % de linhas com `intent_category = 'outro'` por `question_id`; top `question_id` sem mapeamento.
- [ ] Alinhar `DADOS-INTENCAO-YLADA.md` com nomes reais das views ou criar views com os nomes do doc.

**Iniciado neste repo:** preenchimento de `question_label` a partir de `form.fields[].label` / `questions[].label`; view `v_intent_answer_conversion` (intenção × taxa de clique WhatsApp).

### Fase 2 — Camada analítica (2–4 semanas)

- [x] View `v_intent_combinations` (`282-ylada-intent-combinations-view.sql`).
- [ ] Opcional: materialized views + refresh agendado se volume crescer.
- [x] API e UI dedicadas: `GET /api/admin/ylada/valuation` e `/admin/ylada/valuation` (amostra mín. 10 nas views).

### Fase 3 — Produto e Noel (paralelo à Fase 2)

- [x] Área admin **Valuation** separada de Analytics e de dados comportamentais operacionais.
- [ ] Enriquecer `getIntentInsightsContext` com fatos de conversão (quando amostra mínima).
- [ ] UX do profissional: “insights do link” (top dores + conversão) onde fizer sentido.

### Fase 4 — Compliance e escala (contínuo)

- [ ] Retenção / anonimização documentada; RBAC em consultas admin; monitoramento de qualidade (alertas se `outro` dispara).

---

## 4. Checklist — novo diagnóstico / template

1. Cada campo de pergunta tem `id` estável e, se possível, `label` humano.
2. `question_id` segue convenções já mapeadas (`q1`–`q4`, `symptoms`, `barriers`, …) **ou** entrou nova regra em `intent-category-map.ts`.
3. Opções em array fixo quando for múltipla escolha (para `answer_text` / índice corretos).
4. Teste manual: uma submissão gera linhas em `ylada_diagnosis_answers` com `intent_category` esperado e `question_label` quando aplicável.
5. Se o template for estratégico para valuation, registrar no changelog interno do time (para storytelling de dataset).

---

## 5. Entregáveis por fase (resumo)

| Fase | Entregável |
|------|------------|
| 1 | Checklist + auditorias + labels + view conversão |
| 2 | Combinações + (opcional) MVs + API admin |
| 3 | Noel + UI insights |
| 4 | LGPD / retenção / ops |

---

## 6. Próximos passos

1. Aplicar migração `282-ylada-intent-combinations-view.sql` no Supabase (se ainda não aplicada).
2. Rodar auditoria de `outro` e atualizar `intent-category-map.ts` com os `question_id` mais frequentes.
3. Fase 3: enriquecer `getIntentInsightsContext` com fatos de conversão (amostra mínima).
