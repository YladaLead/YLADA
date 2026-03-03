# Fluxo Mínimo YLADA — Plano de Execução

**Objetivo:** Fazer funcionar de ponta a ponta o fluxo:

> Profissional diz "quero captar para emagrecimento" → Noel conversa e sugere → gera "Quiz Pronto para Emagrecer" → visitante preenche → recebe diagnóstico → CTA WhatsApp

---

## O fluxo (7 etapas)

```
1. Profissional entra no Noel (/pt/home)
2. Profissional digita: "quero captar pacientes para emagrecimento"
3. Noel detecta intenção de criar link
4. Noel chama interpret → interpret retorna flow_id + tema + perguntas + interpretacao
5. Noel chama generate com flow_id + interpretacao → link criado
6. Noel devolve o link na resposta
7. Profissional compartilha → visitante acessa /l/[slug] → preenche → diagnóstico → CTA
```

---

## O que existe hoje vs o que está quebrado

| Etapa | O que existe | O que está quebrado |
|-------|--------------|---------------------|
| 1 | Noel em /pt/home, chat funciona | — |
| 2 | Profissional digita | — |
| 3 | `isIntencaoCriarLink()` detecta termos | Pode não pegar "quero captar para emagrecimento" (falta "quero um link") |
| 4 | Interpret retorna flow_id, interpretacao, questions | Noel ignora — usa só `recommendedTemplateId` |
| 5 | Generate aceita flow_id+interpretacao OU template_id | Noel envia template_id (legado) → gera link com schema antigo, sem motor de diagnóstico |
| 6 | Noel injeta link na resposta | Link gerado é do tipo antigo (quiz com minScore), não diagnóstico |
| 7 | PublicLinkView, ConfigDrivenLinkView, diagnosis API | Form envia q1,q2,q3 — motor espera symptoms, barriers, etc. Diagnóstico genérico. |

---

## Estrutura de execução (6 blocos)

### Bloco 1 — Noel usa flow_id + interpretacao ✅
**Objetivo:** Noel chamar generate com flow_id e interpretacao em vez de template_id.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 1.1 | Ampliar `isIntencaoCriarLink` para "captar", "emagrecimento", "atrair pacientes" | ✅ |
| 1.2 | Noel: usar flow_id, interpretacao, questions do interpret (não recommendedTemplateId) | ✅ |
| 1.3 | Noel: chamar generate com `{ flow_id, interpretacao, questions }` | ✅ |

**Critério de sucesso:** Profissional digita "quero captar para emagrecimento" → Noel gera link com config flow-driven (meta.architecture, form.fields).

---

### Bloco 2 — Mapeamento form → motor de diagnóstico ✅
**Objetivo:** Respostas do visitante (q1, q2...) chegarem ao motor nas chaves esperadas.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 2.1 | Definir mapeamento por arquitetura (q1→symptoms, etc.) | ✅ |
| 2.2 | Aplicar normalização antes de `generateDiagnosis()` | ✅ |

**Mapeamentos por arquitetura:**
- RISK_DIAGNOSIS: q1→symptoms (split por vírgula), q2→history_flags, q3→impact_level, q4→attempts_count
- BLOCKER_DIAGNOSIS: q1→barriers, q2→routine_consistency, q3→process_clarity, q4→goal_realism
- PROJECTION_CALCULATOR: q1→current_value, q2→target_value, q3→days, q4→consistency_level
- PROFILE_TYPE: q1→consistency, q2→planning_style, q3→emotion_level, q4→decision_speed, q5→follow_through
- READINESS_CHECKLIST: q1..qn → checklist (array de {label, value})

**Critério de sucesso:** Visitante preenche formulário → diagnóstico reflete as respostas (ex.: mais sintomas = risco mais alto).

---

### Bloco 3 — Ferramenta "Quiz Pronto para Emagrecer" alinhada ✅
**Objetivo:** A ferramenta emagrecimento → quiz-pronto-emagrecer use perguntas que mapeiem corretamente para RISK_DIAGNOSIS.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 3.1 | Revisar question_labels em `quiz-pronto-emagrecer` (FERRAMENTAS_BY_TEMA.emagrecimento) | ✅ |
| 3.2 | Garantir que labels gerem campos q1..q4 compatíveis com mapeamento RISK | ✅ |

**Critério de sucesso:** Quiz "Pronto para Emagrecer" tem 4 perguntas que, ao mapear, alimentam symptoms, history, impact, attempts.

---

### Bloco 4 — Noel: sugestão antes de gerar ✅
**Objetivo:** Noel sugerir o quiz (ex.: "Criei o Quiz Pronto para Emagrecer para você") antes de entregar o link.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 4.1 | Incluir no linkGeradoBlock: nome da ferramenta, tema, tipo (quiz/calculadora) | ✅ |
| 4.2 | System prompt: Noel descrever o que criou antes de mostrar o link | ✅ |

**Critério de sucesso:** Resposta do Noel: "Criei o Quiz Pronto para Emagrecer para você. O visitante responde 4 perguntas e recebe um diagnóstico + botão para falar no WhatsApp. Aqui está o link: [título](url)".

---

### Bloco 5 — Teste de ponta a ponta
**Objetivo:** Garantir que o fluxo completo funcione.

| Tarefa | Descrição | Arquivo(s) |
|--------|-----------|------------|
| 5.1 | Perfil simulado "Médico emagrecimento" ativo | `data/perfis-simulados.ts` |
| 5.2 | Documentar passos manuais de teste | Este doc ou `docs/TESTE-FLUXO-MINIMO.md` |
| 5.3 | (Opcional) Botão "Rodar teste" no Lab que simula o fluxo | `ylada-lab/page.tsx` |

**Critério de sucesso:** Com perfil "Médico emagrecimento" ativo, digitar "quero captar para emagrecimento" no Noel → link gerado → abrir link → preencher → diagnóstico coerente → CTA.

---

### Bloco 6 — WhatsApp no link
**Objetivo:** O CTA abrir WhatsApp com número correto.

| Tarefa | Descrição | Arquivo(s) |
|--------|-----------|------------|
| 6.1 | Generate: buscar cta_whatsapp do perfil (ylada_noel_profile ou user) se não informado | `api/ylada/links/generate/route.ts` |
| 6.2 | Ou: Configuração com WhatsApp padrão | Tela Configuração (fase posterior) |

**Critério de sucesso:** Botão CTA abre WhatsApp com número do profissional (ou placeholder se não configurado).

---

## Ordem de execução

| Ordem | Bloco | Depende de |
|-------|-------|------------|
| 1 | Bloco 1 — Noel flow_id | — |
| 2 | Bloco 2 — Mapeamento form→motor | — |
| 3 | Bloco 3 — Ferramenta alinhada | 2 |
| 4 | Bloco 4 — Noel sugestão | 1 |
| 5 | Bloco 5 — Teste E2E | 1, 2, 3, 4 |
| 6 | Bloco 6 — WhatsApp | — (paralelo) |

**Recomendação:** Executar Bloco 1 e Bloco 2 em paralelo (ou 1 primeiro, depois 2). Bloco 3 depende de 2. Bloco 4 depende de 1. Bloco 5 após 1–4. Bloco 6 pode ser feito em paralelo.

---

## Checklist de conclusão

- [ ] Bloco 1: Noel gera link com flow_id + interpretacao
- [ ] Bloco 2: Mapeamento q1..qn → chaves do motor
- [ ] Bloco 3: Quiz Pronto para Emagrecer com perguntas compatíveis
- [ ] Bloco 4: Noel descreve o que criou antes do link
- [ ] Bloco 5: Teste manual E2E passa
- [ ] Bloco 6: CTA abre WhatsApp (ou aviso se não configurado)

---

*Documento criado em 28/02/2025. Atualizar conforme execução.*
