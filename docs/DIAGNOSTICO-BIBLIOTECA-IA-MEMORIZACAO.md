# Diagnóstico: Biblioteca + IA + Memorização

**Objetivo:** Primeiro diagnóstico vem da biblioteca (qualidade). Quando o profissional edita o link, a IA gera novos padrões e memoriza para não chamar IA de novo.

---

## Fluxo

1. **Link criado da biblioteca (sem edição):**
   - Diagnóstico usa archetypes globais (`ylada_diagnosis_archetypes`) ou templates em código
   - Conteúdo da biblioteca = o que vendemos

2. **Profissional edita o link** (perguntas, título, tema):
   - Ao salvar, dispara `POST /api/ylada/links/[id]/generate-diagnosis`
   - IA gera conteúdo específico para tema + perguntas
   - Armazena em `ylada_link_diagnosis_content`

3. **Entrega do diagnóstico:**
   - **Prioridade 1:** Conteúdo memorizado por link (`ylada_link_diagnosis_content`)
   - **Prioridade 2:** Archetypes globais (`ylada_diagnosis_archetypes`)
   - **Prioridade 3:** Templates em código (`generateDiagnosis`)

---

## Tabela `ylada_link_diagnosis_content`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| link_id | UUID | Link do profissional |
| architecture | TEXT | RISK_DIAGNOSIS ou BLOCKER_DIAGNOSIS |
| archetype_code | TEXT | leve, moderado, urgente, bloqueio_pratico, bloqueio_emocional |
| content_json | JSONB | Conteúdo gerado pela IA (profile_title, main_blocker, etc.) |

---

## API

**POST /api/ylada/links/[id]/generate-diagnosis**
- Gera conteúdo via IA e memoriza
- Se já existir: retorna sucesso sem regenerar
- `?force=true`: força regeneração

**POST /api/admin/ylada/links/bulk-generate-diagnosis** (apenas admin)
- Gera diagnóstico em blocos para todos os links elegíveis (RISK_DIAGNOSIS, BLOCKER_DIAGNOSIS)
- `?force=true` — regenerar mesmo os que já têm conteúdo
- `?limit=50` — máximo de links (default 50)
- Processa 1 por vez com delay de 3s entre cada (evita rate limit da OpenAI)

---

## Gatilhos

- **Criação de link** (`POST /api/ylada/links/generate`): ao criar link com RISK_DIAGNOSIS ou BLOCKER_DIAGNOSIS, dispara geração em background
- **Edição de link** (`/pt/.../links/editar/[id]`): ao salvar com sucesso, dispara geração com `force=true`

---

## Arquiteturas suportadas (geração por IA)

- RISK_DIAGNOSIS (leve, moderado, urgente)
- BLOCKER_DIAGNOSIS (bloqueio_pratico, bloqueio_emocional)

PERFUME_PROFILE continua usando archetypes do banco (8 perfis).
