# 📋 FASE 1 - IMPLEMENTAÇÃO LYA: FUNDAÇÃO DE MEMÓRIA

**Esta é a FASE 1 - Apenas fundação, SEM integração OpenAI ainda**

---

## 🎯 OBJETIVO

Criar a base de memória e aprendizado do sistema, sem ainda integrar OpenAI.

**Por quê fazer isso primeiro:**
- Não depende de IA
- Dá pra validar rápido
- Evita gastar tokens
- Cria o "cérebro" do SaaS

---

## ✅ TAREFAS EXATAS

### **1. Criar Tabelas no Supabase**

Execute o SQL abaixo no Supabase SQL Editor:

```sql
-- ============================================
-- FASE 1: Tabelas de Memória e Aprendizado LYA
-- ============================================

-- Tabela: ai_state_user (Estado vivo da usuária)
CREATE TABLE IF NOT EXISTS ai_state_user (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil JSONB,           -- Exemplo: { "nicho": "nutrição", "objetivos": "emagrecimento" }
  preferencias JSONB,     -- Exemplo: { "metas": ["aumentar clientes", "gestão de redes sociais"] }
  restricoes JSONB,       -- Exemplo: { "dietas": ["low-carb", "sem-glúten"] }
  ultima_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_state_user_user_id ON ai_state_user(user_id);

-- Tabela: ai_memory_events (Memória de ações, resultados e feedbacks)
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

-- Tabela: ai_knowledge_chunks (Cérebro institucional - scripts, fluxos, regras)
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT,         -- 'fluxo', 'script', 'metodologia', 'regra'
  titulo TEXT,            -- Título do conteúdo (ex: "fluxo de vendas", "script de follow-up")
  conteudo TEXT,          -- Conteúdo completo
  embedding VECTOR(1536), -- Vetor de embeddings para busca semântica (pode ser NULL inicialmente)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_categoria ON ai_knowledge_chunks(categoria);

-- RLS Policies
ALTER TABLE ai_state_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_state_user
DROP POLICY IF EXISTS "Users can view own ai state" ON ai_state_user;
CREATE POLICY "Users can view own ai state"
ON ai_state_user FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai state" ON ai_state_user;
CREATE POLICY "Users can insert own ai state"
ON ai_state_user FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai state" ON ai_state_user;
CREATE POLICY "Users can update own ai state"
ON ai_state_user FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas para ai_memory_events
DROP POLICY IF EXISTS "Users can view own memory events" ON ai_memory_events;
CREATE POLICY "Users can view own memory events"
ON ai_memory_events FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own memory events" ON ai_memory_events;
CREATE POLICY "Users can insert own memory events"
ON ai_memory_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Políticas para ai_knowledge_chunks (público para leitura, admin para escrita)
DROP POLICY IF EXISTS "Users can view knowledge chunks" ON ai_knowledge_chunks;
CREATE POLICY "Users can view knowledge chunks"
ON ai_knowledge_chunks FOR SELECT
USING (true); -- Todos podem ler conhecimento institucional

DROP POLICY IF EXISTS "Admin can manage knowledge chunks" ON ai_knowledge_chunks;
CREATE POLICY "Admin can manage knowledge chunks"
ON ai_knowledge_chunks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND (user_profiles.is_admin = true OR user_profiles.is_support = true)
  )
);
```

**Nota sobre `embedding VECTOR(1536)`:**
- Se a extensão `pgvector` não estiver instalada no Supabase, essa coluna pode dar erro
- Solução: Remover a coluna `embedding` por enquanto e adicionar depois quando instalar pgvector
- Ou deixar como `TEXT` temporariamente

### **2. Criar APIs Backend**

#### **API 1: Salvar/Atualizar Estado da Usuária**
Criar: `src/app/api/nutri/ai/state/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Salvar ou atualizar estado da usuária
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { perfil, preferencias, restricoes } = body

    const { data, error } = await supabaseAdmin
      .from('ai_state_user')
      .upsert({
        user_id: user.id,
        perfil: perfil || {},
        preferencias: preferencias || {},
        restricoes: restricoes || {},
        ultima_atualizacao: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar estado da usuária:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar estado da usuária' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      state: data
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar estado:', error)
    return NextResponse.json(
      { error: 'Erro ao processar estado', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Buscar estado da usuária
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('ai_state_user')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar estado:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar estado' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      state: data || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar estado:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estado' },
      { status: 500 }
    )
  }
}
```

#### **API 2: Registrar Evento de Memória**
Criar: `src/app/api/nutri/ai/memory/event/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Registrar evento de memória
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { tipo, conteudo, util } = body

    if (!tipo || !['acao', 'resultado', 'feedback'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: acao, resultado ou feedback' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('ai_memory_events')
      .insert({
        user_id: user.id,
        tipo,
        conteudo: conteudo || {},
        util: util !== undefined ? util : null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao registrar evento:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      event: data
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar evento', details: error.message },
      { status: 500 }
    )
  }
}
```

#### **API 3: Buscar Memória Recente**
Criar: `src/app/api/nutri/ai/memory/recent/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar memória recente
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    const { data, error } = await supabaseAdmin
      .from('ai_memory_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Erro ao buscar memória:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar memória' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      events: data || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar memória:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar memória' },
      { status: 500 }
    )
  }
}
```

---

## ✅ VALIDAÇÃO (O QUE PRECISA FUNCIONAR)

Após implementar, testar:

1. **Insert na ai_state_user:**
   ```bash
   POST /api/nutri/ai/state
   Body: { "perfil": {"nicho": "nutrição"}, "preferencias": {}, "restricoes": {} }
   ```

2. **Select da ai_state_user:**
   ```bash
   GET /api/nutri/ai/state
   ```

3. **Insert na ai_memory_events:**
   ```bash
   POST /api/nutri/ai/memory/event
   Body: { "tipo": "acao", "conteudo": {"acao": "teste"}, "util": true }
   ```

4. **Select da ai_memory_events:**
   ```bash
   GET /api/nutri/ai/memory/recent?limit=5
   ```

---

## ⛔ O QUE NÃO FAZER NESTA FASE

- ❌ Não integrar OpenAI
- ❌ Não criar lógica de IA
- ❌ Não criar embeddings ainda
- ❌ Não criar fine-tuning

**Apenas persistência, leitura e escrita funcionando.**

---

## ✅ PRÓXIMO PASSO

Quando a Fase 1 estiver 100% funcional e validada, avançamos para **Fase 2: Integração Responses API**.

