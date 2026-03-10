# Sistema de Entrega de Diagnóstico — Eficiente e Eficaz

**Objetivo:** Diagnóstico é o core do produto. A entrega precisa ser eficiente (rápida, confiável) e eficaz (conteúdo certo para o visitante certo).

---

## 1. Arquitetura atual

```
Visitante responde quiz
  → POST /api/ylada/links/[slug]/diagnosis
  → Cache (answers_hash) → se hit → retorna
  → Normaliza respostas
  → Calcula nível (leve/moderado/urgente) ou bloqueio (prático/emocional)
  → Prioridade de conteúdo:
      1. ylada_link_diagnosis_content (IA por link)
      2. ylada_diagnosis_archetypes (segmento)
      3. generateDiagnosis (templates em código)
  → Preenche slots {THEME}, {NAME}
  → Grava métricas + cache
  → Retorna diagnóstico
```

---

## 2. Plano para ficar eficiente e eficaz

### Fase A — Garantir que o link tenha conteúdo (já feito)

- [x] Geração ao criar link (background)
- [x] Geração ao editar link (force=true)
- [x] Bulk para links antigos (admin)

### Fase B — Qualidade da IA (prompt + validação)

| Ação | O que fazer | Resultado |
|------|-------------|-----------|
| **B1. Refinar prompt** | [x] Enriquecer `generate-link-diagnosis.ts` com exemplos, tom, estrutura de cada bloco | Conteúdo mais assertivo e personalizado |
| **B2. Validar saída** | Checar campos obrigatórios antes de salvar; se falhar, retry ou fallback | Evita conteúdo quebrado |

### Fase C — Cadeia de fallback

| Ação | O que fazer | Resultado |
|------|-------------|-----------|
| **C1. Segmentação** | Garantir que `segment_code` seja sempre definido (meta do link) | Archetype certo por segmento (saúde, perfumaria, etc.) |
| **C2. Archetypes mínimos** | Ter pelo menos 1 archetype por (archetype_code, segment_code) para fallback | Nunca cair em template genérico |

### Fase D — Observabilidade

| Ação | O que fazer | Resultado |
|------|-------------|-----------|
| **D1. Métrica de origem** | Gravar em `ylada_diagnosis_metrics` se veio de link_content, archetype ou template | Saber se fallbacks estão sendo usados demais |
| **D2. Links sem conteúdo** | Dashboard ou query: links RISK/BLOCKER sem `ylada_link_diagnosis_content` | Identificar links que precisam de geração |

### Fase E — Performance

| Ação | O que fazer | Resultado |
|------|-------------|-----------|
| **E1. Cache** | Já existe; garantir invalidação ao gerar novo conteúdo | Resposta rápida para visitantes repetidos |
| **E2. Queries** | Índices em link_id, answers_hash, archetype_code | Entrega rápida |

---

## 3. Ordem sugerida

1. **B1** — Refinar prompt (maior impacto na qualidade)
2. **D1** — Métrica de origem (visibilidade)
3. **B2** — Validação da saída (confiabilidade)
4. **C1** — Segmentação consistente
5. **C2** — Archetypes mínimos por segmento

---

## 4. Arquivos principais

| Arquivo | Função |
|---------|--------|
| `src/app/api/ylada/links/[slug]/diagnosis/route.ts` | API de entrega |
| `src/lib/ylada/generate-link-diagnosis.ts` | Prompt e chamada à IA |
| `src/lib/ylada/generate-diagnosis-for-link.ts` | Orquestração (gerar + salvar) |
| `src/lib/ylada/diagnosis-archetypes.ts` | fillArchetypeSlots, getArchetypeCode |
| `ylada_diagnosis_archetypes` (banco) | Conteúdo por segmento |
