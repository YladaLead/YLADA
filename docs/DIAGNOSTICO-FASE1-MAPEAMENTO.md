# Fase 1 — Mapeamento do Motor de Diagnóstico YLADA

**Data:** 2026-02-28  
**Objetivo:** Documentar como o diagnóstico é gerado hoje para preparar a implementação da nova estrutura (5 blocos, variação por score).

---

## 1. Fluxo geral

```
Visitante responde quiz (PublicLinkView)
    → POST /api/ylada/links/[slug]/diagnosis { visitor_answers: { q1: "0", q2: "1", ... } }
    → normalizeVisitorAnswers() — mapeia q1..qn para chaves do motor
    → generateDiagnosis() — calcula score/nível e monta saída
    → Retorna { diagnosis, metrics_id }
    → PublicLinkView exibe resultado
```

---

## 2. Arquivos principais

| Arquivo | Função |
|---------|--------|
| `src/app/api/ylada/links/[slug]/diagnosis/route.ts` | API pública; recebe `visitor_answers`, chama motor, grava métricas |
| `src/lib/ylada/diagnosis-engine.ts` | Motor principal: calcula nível/bloqueio/perfil e monta saída |
| `src/lib/ylada/diagnosis-templates.ts` | Templates por arquitetura (explanation, consequence, possibility, CTA) |
| `src/lib/ylada/diagnosis-normalize.ts` | Mapeia q1..qn → symptoms, barriers, impact_level, etc. |
| `src/lib/ylada/adaptive-diagnosis.ts` | Tom adaptativo (intro + CTA) para links B2B (agenda, posicionamento) |
| `src/components/ylada/PublicLinkView.tsx` | Formulário do quiz + exibição do resultado |

---

## 3. Arquiteturas suportadas

| Arquitetura | Flow ID | Score/Nível | Uso típico |
|-------------|---------|-------------|------------|
| RISK_DIAGNOSIS | diagnostico_risco | level: baixo/médio/alto | Emagrecimento, intestino, saúde |
| BLOCKER_DIAGNOSIS | diagnostico_bloqueio | blocker_type: rotina, emocional, processo, habitos, expectativa | Profissional liberal |
| PROFILE_TYPE | perfil_comportamental | profile_type: consistente, analitico, ansioso, etc. | Perfil comportamental |
| READINESS_CHECKLIST | checklist_prontidao | score: 0–100 | Checklist de prontidão |
| PROJECTION_CALCULATOR | calculadora_projecao | projection + warning | Calculadora de projeção |

**Para quiz de paciente (intestino, emagrecimento):** usa **RISK_DIAGNOSIS**.

---

## 4. Score atual — RISK_DIAGNOSIS

**Função:** `calcRiskLevel()` em `diagnosis-engine.ts`

**Entradas normalizadas (via diagnosis-normalize):**
- `symptoms` / `sintomas` — de q1 (índice 0–3 → array de "relatado")
- `history_flags` / `attempts_count` — de q2 (índice → 0, 1, 3 ou 5 tentativas)
- `impact_level` — de q4 ou q3 (baixo, medio, alto)
- `target_kg_range` — de q3 (emagrecimento)

**Cálculo:**
```
symptomCap (máx 6) × 1 + historyCap (máx 6) × 2 + impactPoints (0/2/4) + attemptPoints (0/1/2) + agePoints (0/1/2)
```

**Faixas:**
- 0–5: **baixo**
- 6–10: **médio**
- 11+: **alto**

**Problema para quiz genérico (intestino, etc.):** O normalize espera q1–q4 no formato emagrecimento. Quiz de intestino pode ter 4 ou 5 perguntas com estrutura diferente. O mapeamento em `diagnosis-normalize.ts` é específico para RISK_DIAGNOSIS com perguntas de emagrecimento.

---

## 5. Estrutura atual da saída (DiagnosisDecisionOutput)

```typescript
{
  profile_title: string      // Ex.: "Seu resultado em saúde intestinal"
  profile_summary: string    // explanation do template (até 280 chars)
  main_blocker: string      // Ex.: "Algo importante pede atenção" / "Vale dar uma olhada"
  consequence: string       // Ex.: "Se nada mudar, tende a continuar igual ou piorar."
  growth_potential: string  // Ex.: "Vale conversar com quem entende pra ver o próximo passo."
  cta_text: string          // Ex.: "Fale comigo sobre isso"
  whatsapp_prefill: string  // Mensagem pré-preenchida para WhatsApp
}
```

**Exibição no PublicLinkView:**
1. Badge "Seu resultado"
2. `profile_title` (h1)
3. `profile_summary` (parágrafo)
4. `main_blocker` (destaque com borda azul)
5. `consequence` + `growth_potential` (parágrafo)
6. Botão com `cta_text`

---

## 6. Templates atuais (diagnosis-templates.ts)

**RISK_DIAGNOSIS:**
- title: "Seu resultado em {THEME}" / "O que apareceu em {THEME}"
- explanation: "Pelos sinais que você relatou, algo está pesando em {THEME} e vale atenção."
- consequence: "Se nada mudar, tende a continuar igual ou piorar."
- possibility: "Vale conversar com quem entende pra ver o próximo passo."
- cta_imperative: "Fale comigo sobre isso"
- whatsapp_prefill: "Oi {NAME}, fiz a análise de {THEME} e apareceu risco {LEVEL}..."

**Slots disponíveis:** THEME, NAME, LEVEL, BLOCKER, PROFILE, SCORE, DAYS

---

## 7. Normalização — quiz genérico vs emagrecimento

**diagnosis-normalize.ts** para RISK_DIAGNOSIS:
- q1 (índice 0–3) → symptoms = array de tamanho índice
- q2 (índice 0–3) → attempts_count (0, 1, 3, 5) + history_flags
- q3 ou q4 → impact_level (baixo, medio, alto)
- q3 + q4 → target_kg_range (emagrecimento)

**Quiz de intestino (4 ou 5 perguntas):** As perguntas podem ser diferentes (condição diagnosticada, frequência, dieta, informação). O mapeamento atual pode não refletir bem a estrutura. Ex.: q1 "condição diagnosticada" (Sim/Não/Não sei) não mapeia para symptoms da mesma forma.

**Conclusão:** O normalize precisa ser flexível ou ter mapeamento por tema. Para Fase 2, considerar um mapeamento genérico baseado em "índice da opção = intensidade" (0=leve, 1=moderado, 2=alto, 3=muito alto) quando as perguntas não seguem o padrão emagrecimento.

---

## 8. Camada adaptativa (adaptive-diagnosis.ts)

**Usada quando:** `isProfessionalTheme` (agenda, captação, posicionamento) E `strategic_profile` existe.

**Funções:**
- `getAdaptiveDiagnosisIntro()` — substitui/aumenta o profile_summary com tom adaptado ao perfil do profissional
- `getAdvancedCta()` — CTA adaptada por dominantPain, urgencyLevel, mindset

**Para quiz de paciente (intestino, emagrecimento):** NÃO usa. O theme_raw não contém "agenda|captação|posicionamento", então `strategicProfile` é null e a camada adaptativa não é aplicada.

---

## 9. Gaps identificados

1. **Normalize rígido:** Mapeamento q1–q4 assume estrutura de emagrecimento. Quiz de intestino (e outros temas) podem ter perguntas diferentes.
2. **Sem variação por nível na copy:** Os templates são únicos. Não há variação de tom (leve=educativo, alto=direcionador) nos textos.
3. **CTA fixo:** "Fale comigo sobre isso" — não varia por nível. O plano é CTA consultivo e proporcional.
4. **Estrutura diferente do plano:** Hoje: title + summary + blocker + consequence+growth + CTA. Plano: 5 blocos (Nome, Leitura, Consequência, Direção, CTA).
5. **main_blocker genérico:** "Algo importante pede atenção" / "Vale dar uma olhada" / "Sinais que se repetem" — poderia ser mais específico por tema.

---

## 10. Fase 2 — Implementado (2026-02-28)

1. **Score genérico** — Para temas não-emagrecimento (intestino, energia, etc.): soma dos índices (0–3) das opções. Faixas: 0–33% = leve, 34–66% = moderado, 67–100% = alto.
2. **diagnosis-normalize** — Aceita `options.themeRaw`; quando tema ≠ emagrecimento, usa `calcGenericScoreAndLevel()` e define `generic_score` + `generic_level`.
3. **diagnosis-engine** — `calcRiskLevel()` verifica `generic_level` primeiro; quando presente, retorna esse nível diretamente.

---

## 11. Fase 3 — Implementado (2026-02-28)

1. **5 blocos com variação por nível** — `RISK_LEVEL_VARIANTS` em diagnosis-templates: explanation, consequence, possibility, cta_imperative por nível (baixo, medio, alto).
2. **Tom por nível** — Leve: educativo. Moderado: direcionador. Alto: mais firme.
3. **CTA consultivo** — "Clique para entender melhor seu caso" / "Clique para eu te explicar os próximos passos" / "Clique para entender qual ajuste faz sentido no seu caso".
4. **Integração** — diagnosis-engine usa `getRiskLevelVariants(level)` para RISK_DIAGNOSIS.

---

## 11. Diagrama de fluxo

```
[Visitante] → [PublicLinkView] → values { q1: "0", q2: "1", q3: "2", q4: "3" }
                                      ↓
                    POST /api/ylada/links/[slug]/diagnosis
                                      ↓
                    [diagnosis/route.ts]
                    - Carrega link + config
                    - normalizeVisitorAnswers(visitor_answers, architecture)
                    - generateDiagnosis(input)
                    - getAdaptiveDiagnosisIntro (se B2B)
                    - getAdvancedCta (se B2B)
                    - Grava ylada_diagnosis_metrics
                    - Retorna diagnosis + metrics_id
                                      ↓
                    [PublicLinkView] exibe resultado
```
