# Biblioteca Inteligente: Blocos de Diagnóstico (Sugestão GPT)

**Objetivo:** Transformar a biblioteca em **fábrica de diagnósticos** — em vez de cadastrar quiz por quiz, o Noel combina blocos para gerar centenas de diagnósticos automaticamente.

---

## 1. O problema atual

| Modelo | Capacidade | Escala |
|--------|------------|--------|
| Biblioteca manual | Cada diagnóstico criado à mão | ~50 diagnósticos |
| YLADA hoje | Config + IA por link | Escala por link, mas tema vem livre |

**Hoje no YLADA:**
- `ylada-diagnosticos.ts` → diagnósticos fixos por slug (comunicacao, agenda, etc.)
- Links inteligentes → `interpretacao.tema` (texto livre) + `generateLinkDiagnosisContent(theme, architecture, questions)` → IA gera do zero
- `noel_strategy_library` → estratégias para o **profissional** (o que fazer), não para **gerar diagnósticos**

O tema é livre. A IA inventa. Não há reuso estruturado de blocos.

---

## 2. A proposta: blocos combináveis

Em vez de salvar diagnósticos prontos, salvar **blocos** que o Noel combina:

| Bloco | Exemplos |
|-------|----------|
| **theme** (situação) | emagrecimento, pele, energia, digestão, sono, performance |
| **problem** (problema) | travando resultados, metabolismo lento, inflamação, retenção, falta de constância |
| **audience** (público) | mulheres 40+, homens sedentários, rotina corrida, quem já tentou dieta |
| **promise** (promessa) | descubra o que pode estar travando, identifique o bloqueio, entenda o que seu corpo está pedindo |

**Combinação automática:**
- "Descubra o que pode estar travando seu **emagrecimento**"
- "Descubra se seu **metabolismo** pode estar lento"
- "Entenda o que pode estar bloqueando sua **energia**"
- "Sua **pele** pode estar inflamada?"

---

## 3. Mapeamento para a arquitetura YLADA

### 3.1 O que já existe

| Componente | Onde | Papel |
|------------|------|-------|
| `noel_strategy_library` | migration 263 | Estratégias para o **profissional** (topic, problem, strategy, example) |
| `ylada_link_diagnosis_content` | migration existente | Conteúdo memorizado **por link** (gerado por IA) |
| `ylada_diagnosis_archetypes` | migration existente | Archetypes globais por segmento (fallback) |
| `generateLinkDiagnosisContent` | `generate-link-diagnosis.ts` | IA gera do zero com theme + architecture + questions |

### 3.2 O que falta (proposta GPT)

| Componente | Proposta | Papel |
|------------|---------|-------|
| `diagnosis_blocks` | Nova tabela | Blocos reutilizáveis (theme, problem, audience, promise) |
| Noel ao criar link | Fluxo novo | Identifica segmento → consulta blocos → sugere/gera diagnóstico |
| `generateLinkDiagnosisContent` | Enriquecido | Recebe blocos como contexto/constraints (opcional) |

---

## 4. Arquitetura técnica proposta

### 4.1 Nova tabela: `diagnosis_blocks`

```sql
CREATE TABLE IF NOT EXISTS diagnosis_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL,  -- 'theme' | 'problem' | 'audience' | 'promise'
  content TEXT NOT NULL,
  segment_code TEXT,        -- nutra, estetica, odonto, etc. (opcional: bloco por segmento)
  tags TEXT[],              -- para busca: ['emagrecimento','metabolismo','pele']
  usage_count INT DEFAULT 0, -- aprendizado: priorizar blocos mais usados
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_diagnosis_blocks_type ON diagnosis_blocks(block_type);
CREATE INDEX idx_diagnosis_blocks_segment ON diagnosis_blocks(segment_code);
CREATE INDEX idx_diagnosis_blocks_tags ON diagnosis_blocks USING GIN(tags);
```

### 4.2 Seed inicial (exemplos)

```sql
-- theme (situação)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('theme', 'emagrecimento', ARRAY['emagrecimento','peso']),
('theme', 'pele', ARRAY['pele','estetica','facial']),
('theme', 'energia', ARRAY['energia','cansaco']),
('theme', 'digestão', ARRAY['digestao','intestino']),
('theme', 'sono', ARRAY['sono','descanso']),
('theme', 'performance', ARRAY['performance','treino']);

-- problem (problema)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('problem', 'travando resultados', ARRAY['resultados','bloqueio']),
('problem', 'metabolismo lento', ARRAY['metabolismo','emagrecimento']),
('problem', 'inflamação', ARRAY['inflamacao','pele','saude']),
('problem', 'retenção de líquido', ARRAY['retencao','inchaço']),
('problem', 'falta de constância', ARRAY['constancia','habitos']);

-- promise (promessa)
INSERT INTO diagnosis_blocks (block_type, content, tags) VALUES
('promise', 'descubra o que pode estar travando', ARRAY['bloqueio','identificar']),
('promise', 'identifique o bloqueio', ARRAY['bloqueio']),
('promise', 'entenda o que seu corpo está pedindo', ARRAY['corpo','sinais']),
('promise', 'descubra o que pode estar impedindo melhores resultados', ARRAY['resultados','pele']);
```

### 4.3 Fluxo do Noel ao criar link

```
Profissional: "Quero gerar clientes para minha clínica estética"
    ↓
Noel identifica: segment=estetica, objetivo=gerar_clientes
    ↓
Consulta diagnosis_blocks WHERE segment_code = 'estetica' OR segment_code IS NULL
    ↓
Combina: theme=pele + problem=resultados + promise=descubra o que pode estar impedindo
    ↓
Título gerado: "Descubra o que pode estar impedindo sua pele de ter melhores resultados"
    ↓
Perguntas geradas automaticamente (IA com blocos como contexto)
```

---

## 5. Integração com o código existente

### 5.1 Onde injetar

| Ponto | Arquivo | Alteração |
|-------|---------|-----------|
| Criação de link via Noel | `POST /api/ylada/links/generate` | Se `interpretacao` vier da conversa com Noel, usar blocos para enriquecer `theme_raw` e sugerir título |
| Geração de conteúdo | `generate-link-diagnosis.ts` | Opcional: aceitar `blocks?: { theme, problem, audience, promise }` e injetar no prompt como constraints |
| Sugestão de diagnóstico no Noel | `POST /api/ylada/noel` | Novo bloco: quando profissional pede "criar diagnóstico para X", Noel consulta blocos e sugere combinação |

### 5.2 Função de busca de blocos

```ts
// src/lib/ylada/diagnosis-blocks.ts (a criar)
export async function getDiagnosisBlocksForSegment(
  segmentCode: string,
  supabase: SupabaseClient
): Promise<{ theme: string[]; problem: string[]; audience: string[]; promise: string[] }> {
  const { data } = await supabase
    .from('diagnosis_blocks')
    .select('block_type, content')
    .or(`segment_code.eq.${segmentCode},segment_code.is.null`)
    .order('usage_count', { ascending: false })
  // Agrupar por block_type, retornar arrays
}
```

### 5.3 Combinação no prompt

O `generateLinkDiagnosisContent` pode receber blocos e usar no prompt:

```
Contexto: tema=pele, problema=resultados da pele, promessa=descubra o que pode estar impedindo
Gere conteúdo para os archetypes usando esse contexto. O main_blocker deve refletir o problema.
```

---

## 6. Aprendizado (uso real)

Quando um link usa blocos e gera conversões:
- Incrementar `usage_count` nos blocos usados
- Noel passa a priorizar blocos com maior `usage_count` na próxima sugestão

```sql
UPDATE diagnosis_blocks
SET usage_count = usage_count + 1
WHERE id IN (...)
```

---

## 7. Escala

| Modelo | Capacidade |
|--------|------------|
| Biblioteca manual | 50 diagnósticos |
| **Biblioteca com blocos** | 20 blocos → 500+ combinações |
| Com aprendizado | Priorização automática dos melhores |

---

## 8. Próximos passos (ordem sugerida)

1. ~~**Migration**~~ — ✅ `273-diagnosis-blocks.sql` + `274-diagnosis-blocks-seed.sql`
2. ~~**`getDiagnosisBlocksForSegment`**~~ — ✅ `src/lib/ylada/diagnosis-blocks.ts`
3. **Noel ao sugerir link** — Quando profissional pede "criar diagnóstico para estética", Noel consulta blocos e monta sugestão
4. ~~**`generateLinkDiagnosisContent`**~~ — ✅ Aceita blocos opcionais e injeta no prompt (`generate-diagnosis-for-link.ts` busca blocos por segmento + tags do tema)
5. **`usage_count`** — Incrementar quando link usa blocos e converte (pode ser fase 2)

---

## 9. Referências

| Doc | Conteúdo |
|-----|----------|
| `docs/NOEL-MAPA-COMPLETO-BIBLIOTECA.md` | 5 bibliotecas atuais do Noel |
| `docs/DIAGNOSTICO-BIBLIOTECA-IA-MEMORIZACAO.md` | Fluxo atual: biblioteca → IA → memorização |
| `migrations/263-noel-knowledge-layer-tables.sql` | noel_strategy_library, noel_conversation_library |
| `src/lib/ylada/generate-link-diagnosis.ts` | Geração de conteúdo por IA |
