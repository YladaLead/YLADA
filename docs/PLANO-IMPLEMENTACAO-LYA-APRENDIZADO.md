# 🧠 PLANO DE IMPLEMENTAÇÃO - LYA com Aprendizado e Redução de Custo OpenAI

**Baseado na conversa com ChatGPT sobre Responses API + Conversations + Sistema de Aprendizado**

---

## 🎯 DECISÃO TÉCNICA TOMADA

### **NÃO usar Assistants API** (será deprecada em 26/08/2026)
### **USAR Responses API + Prompts + Conversations** (padrão novo da OpenAI)

**Por quê:**
- Assistants API será desligada em 2026
- Responses API é o futuro
- Evita retrabalho depois

---

## 🧠 VISÃO-MÃE

**A LYA não vai "aprender" ajustando prompt toda hora.**
**Ela vai aprender porque o SaaS passa a pensar antes de chamar a OpenAI.**

**Regra de ouro:**
- O sistema aprende
- A IA só decide quando realmente precisa

---

## 📋 FASE 1 - FUNDAÇÃO (SEM OPENAI)

**Objetivo:** Criar base de memória e aprendizado do sistema, sem ainda integrar OpenAI.

### **1.1. Tabelas no Supabase**

#### **Tabela: ai_state_user**
Estado vivo da usuária (perfil, preferências, restrições)

```sql
CREATE TABLE IF NOT EXISTS ai_state_user (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil JSONB,           -- Exemplo: { "nicho": "nutrição", "objetivos": "emagrecimento" }
  preferencias JSONB,     -- Exemplo: { "metas": ["aumentar clientes", "gestão de redes sociais"] }
  restricoes JSONB,       -- Exemplo: { "dietas": ["low-carb", "sem-glúten"] }
  ultima_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_state_user_user_id ON ai_state_user(user_id);
```

#### **Tabela: ai_memory_events**
Memória de ações, resultados e feedbacks (aprendizado real)

```sql
CREATE TABLE IF NOT EXISTS ai_memory_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT,              -- 'acao', 'resultado', 'feedback'
  conteudo JSONB,         -- Exemplo: { "acao": "realizou post", "resultado": "10 novos seguidores" }
  util BOOLEAN,           -- Indica se a ação foi útil
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_events_user_id ON ai_memory_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_events_tipo ON ai_memory_events(tipo);
CREATE INDEX IF NOT EXISTS idx_ai_memory_events_created_at ON ai_memory_events(created_at DESC);
```

#### **Tabela: ai_knowledge_chunks**
Cérebro institucional (scripts, fluxos, regras do YLADA)

```sql
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT,         -- 'fluxo', 'script', 'metodologia', 'regra'
  titulo TEXT,            -- Título do conteúdo (ex: "fluxo de vendas", "script de follow-up")
  conteudo TEXT,          -- Conteúdo completo
  embedding VECTOR(1536), -- Vetor de embeddings para busca semântica
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_categoria ON ai_knowledge_chunks(categoria);
```

**Nota:** A coluna `embedding` requer extensão `vector` do pgvector. Se não estiver instalada, pode ser adicionada depois.

### **1.2. APIs Backend (Fase 1)**

#### **API: Salvar/Atualizar Estado da Usuária**
`POST /api/nutri/ai/state`

```typescript
// Salvar ou atualizar estado da usuária
// Body: { perfil, preferencias, restricoes }
```

#### **API: Registrar Evento de Memória**
`POST /api/nutri/ai/memory/event`

```typescript
// Registrar ação, resultado ou feedback
// Body: { tipo: 'acao' | 'resultado' | 'feedback', conteudo: {}, util: boolean }
```

#### **API: Buscar Estado da Usuária**
`GET /api/nutri/ai/state`

#### **API: Buscar Memória Recente**
`GET /api/nutri/ai/memory/recent?limit=5`

---

## 📋 FASE 2 - INTEGRAÇÃO RESPONSES API (DEPOIS DA FASE 1)

**Objetivo:** Integrar Responses API com RAG (busca em memória antes de chamar OpenAI).

### **2.1. Handler com Responses API + RAG**

**Fluxo:**
1. Buscar estado da usuária (ai_state_user)
2. Buscar memória recente (ai_memory_events - últimos 5)
3. Buscar conhecimento relevante (ai_knowledge_chunks - por categoria)
4. Montar contexto pequeno
5. Chamar Responses API com Prompt object
6. Salvar resposta na memória

### **2.2. Formato Fixo de Resposta da LYA**

A LYA **sempre** responde neste formato (sem exceção):

```
ANÁLISE DA LYA — HOJE

1) FOCO PRIORITÁRIO
(frase única, objetiva)

2) AÇÃO RECOMENDADA
(checklist 1–3 itens)

3) ONDE APLICAR
(módulo, fluxo, link ou sistema)

4) MÉTRICA DE SUCESSO
(como validar em 24–72h)
```

**Validação:** Qualquer resposta fora disso é descartada e roda fallback.

### **2.3. Prompt Object na OpenAI Platform**

- Criar Prompt object no Dashboard
- Usar Prompt-Mestre da LYA como base
- Versionar prompts
- Ativar Prompt Caching automaticamente

### **2.4. Conversation por Usuária**

- Criar 1 conversation por usuária no onboarding
- Salvar `conversation_id` no Supabase (tabela `nutri_ai_state` ou similar)
- Reutilizar sempre o mesmo `conversation_id` para memória persistente

---

## 📋 FASE 3 - FEEDBACK E APRENDIZADO

**Objetivo:** Sistema aprender com uso real.

### **3.1. Botões de Feedback no App**

Adicionar no componente `LyaAnaliseHoje`:
- 👍 **Útil**
- 👎 **Não útil** (com 3 motivos fixos)

### **3.2. Lógica de Aprendizado**

**Regra crítica:**
- A LYA só aprende com o que foi marcado como **útil** ou **executado**
- Feedback negativo vira contraexemplo (para melhorar depois)

### **3.3. Logs de Interação**

Registrar sempre:
- Input (diagnóstico, perfil, sistema)
- Output (resposta da LYA)
- Modelo usado
- Tokens consumidos
- Custo
- Latência
- user_id

---

## 📋 FASE 4 - OTIMIZAÇÃO DE CUSTO

**Objetivo:** Reduzir gasto com OpenAI sem perder qualidade.

### **4.1. Roteador de Modelos**

**Lógica:**
- Tarefas repetitivas (formatar, resumir, classificar): **modelo menor** (gpt-4o-mini)
- Estratégia (decisão, plano, mentoria): **modelo melhor** (gpt-4o)
- Fallback: se falhar validação, roda segunda vez no modelo melhor

### **4.2. Prompt Caching**

- Manter "miolo repetido" (instruções fixas) estável
- Variáveis entram só no final (estado da usuária)
- Prompt Caching reduz custo/latência automaticamente

---

## 📋 FASE 5 - FINE-TUNING (DEPOIS DE 200+ EXEMPLOS)

**Objetivo:** LYA ficar cada vez melhor com menos contexto.

### **5.1. Quando Fazer Fine-Tuning**

- Após coletar 200-500 exemplos aprovados
- Apenas respostas marcadas como "útil" ou executadas
- Dataset com inputs + outputs "perfeitos"

### **5.2. Processo**

1. Gerar versão "padrão ouro" (teacher)
2. Reduzir tamanho do prompt
3. Padronizar formato
4. Melhorar consistência
5. Fine-tuning supervisionado (SFT)

---

## 🗺️ ROADMAP DE EXECUÇÃO

### **🔥 AGORA (Fase 1)**
- [ ] Criar 3 tabelas no Supabase
- [ ] Criar APIs de estado e memória
- [ ] Validar insert/select funcionando
- [ ] **NÃO integrar OpenAI ainda**

### **🚀 DEPOIS (Fase 2)**
- [ ] Criar Prompt object na OpenAI Platform
- [ ] Implementar handler Responses API + RAG
- [ ] Validar formato fixo de resposta
- [ ] Ativar Conversation por usuária

### **⚖️ DEPOIS (Fase 3)**
- [ ] Adicionar botões de feedback
- [ ] Implementar logs de interação
- [ ] Validar aprendizado funcionando

### **💰 DEPOIS (Fase 4)**
- [ ] Indexar scripts/fluxos no vetor
- [ ] Criar roteador de modelos
- [ ] Ativar Prompt Caching

### **🧬 DEPOIS (Fase 5)**
- [ ] Coletar 200+ exemplos
- [ ] Preparar dataset para fine-tuning
- [ ] Executar fine-tuning (se fizer sentido)

---

## 📝 NOTAS IMPORTANTES

1. **Ordem é crítica:** Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
2. **Não pular etapas:** Cada fase valida a anterior
3. **Memória antes de IA:** Sistema pensa antes de chamar OpenAI
4. **Formato fixo:** LYA sempre responde no mesmo formato
5. **Feedback é ouro:** Sem feedback, não existe aprendizado

---

## ✅ PRÓXIMO PASSO IMEDIATO

**Implementar FASE 1:**
- Criar tabelas no Supabase
- Criar APIs de estado e memória
- Validar funcionamento
- **NÃO integrar OpenAI ainda**

Quando Fase 1 estiver pronta, avançamos para Fase 2.

