# Relatório de Qualidade — Diagnósticos Pacotados Pró Líderes
**Data:** 19/05/2026  
**Escopo:** 42 fluxos × 3 arquétipos (leve / moderado / urgente) = 126 diagnósticos  
**Arquivos avaliados:** migrations 387–400  

---

## Resumo Executivo

| Status | Qtd | % |
|--------|-----|---|
| ✅ Bom | ~82 | 65% |
| ⚠️ Regular | ~16 | 13% |
| ❌ Problema | ~28 | 22% |

**Principais achados:**
1. **Prioridade 1 (crítico):** Todos os fluxos de recrutamento (397–400) escritos em português europeu (PT-PT) — impacto em 66 diagnósticos.
2. **Prioridade 2:** Erros pontuais em wellness (typos, tua/teu, gramática).
3. **Prioridade 3 (oportunidade):** `main_blocker` longo em alguns fluxos (>80 chars ideal).

---

## Bug de Código Corrigido (pré-avaliação)

**Arquivo:** `src/app/api/ylada/links/[slug]/diagnosis/route.ts`  
**Problema:** Lógica `isGeneric` substituía o `whatsapp_prefill` customizado de diagnósticos pacotados por uma mensagem genérica fria (copiava o `main_blocker`).  
**Causa raiz:** O check testava se o prefill continha os primeiros 15 chars do `main_blocker`. Prefills pacotados usam outra linguagem intencionalmente → `isGeneric = true` → substituição errada.  
**Correção:**
- Adicionado flag `fromPackaged = true` quando diagnóstico vem de `linkContent` ou `fetchPackagedDiagnosisOutcome`
- `isGeneric` override protegido por `if (!fromPackaged)`
- `TEMPLATE_VERSION` bumped 27 → 29 para invalidar cache contaminado (capilar/corporal ficaram em 28)

---

## Problemas por Categoria

### 🔴 Prioridade 1 — PT-PT em todo o bloco de Recrutamento (RESOLVIDO)

**Arquivos:** 397, 398, 399, 400  
**Fluxos afetados:** 22 fluxos × 3 arquétipos = **66 diagnósticos**  
**Marcadores encontrados:**
- `a nossa equipa` / `equipa` → deve ser `equipe`
- `perceber` (no sentido de entender) → `entender`
- `podes` → `pode`; `queres` → `quer`; `tens` → `tem`; `estás` → `está`
- `te identificas` → `se identifica`; `te revês` → `se vê`
- `partilhou` → `compartilhou`
- `miúdos` → `crianças` / `filhos`
- `demasiado` → `demais`
- `para ti` → `para você`
- `a tua / o teu` → `a sua / o seu`
- `ao pormenor` → `em detalhes`
- Imperativo 2ª pessoa (tu): `Anota` → `Anote`, `Define` → `Defina`, etc.
- Inglês no meio do texto: `"Pressing need de melhorar rendimento"` → `"Necessidade urgente de melhorar a renda"`

**Ação:** Reescrita completa dos 4 arquivos em PT-BR. ✅

---

### 🟡 Prioridade 2 — Erros Pontuais em Wellness (RESOLVIDO)

| Arquivo | Fluxo | Campo | Erro → Correção |
|---------|-------|-------|-----------------|
| 387 | `rotina-puxada` moderado | `whatsapp_prefill` | `afoca` → `afeta` |
| 388 | `foco-concentracao` moderado | `profile_title` | `na tua produtividade` → `na sua produtividade` |
| 388 | `barriga-pesada` moderado | `consequence` | `encerar` → `encerrar` |
| 388 | `barriga-pesada` moderado | `dica_rapida` | `o teu dia` → `o seu dia` |
| 388 | `barriga-pesada` urgente | `dica_rapida` | frase incompleta `importam mais volume` → `importam mais do que volume` |
| 388 | `metabolismo-lento` moderado | `profile_title` | `no teu dia` → `no seu dia` |
| 388 | `retencao-inchaço` vários | `growth_potential` | `à tua rotina real` → `à sua rotina real` |
| 395 | `calc-imc` urgente | `cta_text` | `serio` → `sério` |
| 387-396 (global) | vários | vários | `parece dá` → `parece dar` (10 ocorrências) |
| 387-396 (global) | vários | vários | `tua/teu` → `sua/seu` (europeísmos isolados) |

---

### 🟡 Prioridade 3 — Oportunidade (não bloqueante)

**`main_blocker` longo (>80 chars):** Alguns fluxos têm main_blocker de 120-160 chars, o que pode truncar em telas menores. Ideal manter ≤80 chars. Afeta principalmente `renda-extra-imediata moderado`, `quiz-recrut-potencial-crescimento leve`, `quiz-recrut-ganhos-prosperidade urgente`.

---

## Destaques Positivos (bloco wellness 387-396)

- **`rotina-puxada`:** Tom consistente, sem promessas médicas, CTA natural.
- **`metabolismo-lento`:** Linguagem bem-estar correta, não diagnóstica.
- **`barriga-pesada`:** Progressão leve/moderado/urgente bem calibrada.
- **`motoristas`:** Fluxo nicho excelente — especificidade real.
- **`foco-concentracao` urgente:** Ótimo equilíbrio entre urgência e respeito.
- **`maes-ocupadas`:** Tom muito alinhado ao público-alvo.
- Todos os `whatsapp_prefill` do bloco wellness são calorosos e naturais.

---

## Status Final das Correções

| Tarefa | Status |
|--------|--------|
| Bug `isGeneric` na API | ✅ Corrigido |
| Cache invalidado (v27→v29) | ✅ Corrigido |
| Reescrita PT-PT→PT-BR (397-400) | ✅ Concluído |
| Typos wellness (387-396) | ✅ Corrigido |
| `parece dá` global | ✅ Corrigido |
| `tua/teu` global wellness | ✅ Corrigido |

---

*Relatório gerado após avaliação automatizada de 126 diagnósticos com análise de: tom, linguagem PT-BR, completude de campos obrigatórios, whatsapp_prefill, ausência de promessas médicas e consistência leve/moderado/urgente.*
