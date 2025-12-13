# 📦 PACOTE DE IMPLEMENTAÇÃO - LYA MVP (Para Claude)
## Implementação Completa do MVP Funcional da LYA na Área Nutri

**Objetivo:** Implementar o MVP funcional da LYA com formulário obrigatório de diagnóstico, geração automática de perfil estratégico, primeira condução da LYA e bloco fixo de orientação diária.

**Foco:** Funcionalidade primeiro, sem redesign visual.

---

## 🎯 ESTRUTURA DO QUE SERÁ IMPLEMENTADO

### **1. FORMULÁRIO DE DIAGNÓSTICO OBRIGATÓRIO**
### **2. PERFIL ESTRATÉGICO AUTOMÁTICO**
### **3. PRIMEIRA RESPOSTA DA LYA**
### **4. BLOCO FIXO "ANÁLISE DA LYA HOJE"**
### **5. REGRA ÚNICA DE DECISÃO (MVP)**

---

## 📋 PARTE 1: ESTRUTURA DE DADOS (BACKEND)

### **1.1. Schema do Banco de Dados**

Criar nova tabela `nutri_diagnostico`:

```sql
-- Tabela para armazenar diagnóstico completo da nutricionista
CREATE TABLE IF NOT EXISTS nutri_diagnostico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- BLOCO 1: Perfil Profissional
  tipo_atuacao VARCHAR(50), -- 'clinica_fisica', 'online', 'hibrida', 'iniciante', 'outra'
  tempo_atuacao VARCHAR(50), -- 'menos_1_ano', '1_3_anos', '3_5_anos', 'mais_5_anos'
  autoavaliacao VARCHAR(50), -- 'tecnica_boa_negocio_fraco', 'tecnica_boa_negocio_razoavel', 'tecnica_boa_negocio_bom', 'mais_empreendedora'
  
  -- BLOCO 2: Momento Atual do Negócio
  situacao_atual VARCHAR(50), -- 'poucos_pacientes', 'agenda_instavel', 'agenda_cheia_desorganizada', 'agenda_cheia_organizada'
  processos_captacao BOOLEAN DEFAULT false,
  processos_avaliacao BOOLEAN DEFAULT false,
  processos_fechamento BOOLEAN DEFAULT false,
  processos_acompanhamento BOOLEAN DEFAULT false,
  
  -- BLOCO 3: Objetivo Principal (90 dias)
  objetivo_principal VARCHAR(50), -- 'lotar_agenda', 'organizar_rotina', 'vender_planos', 'aumentar_faturamento', 'estruturar_negocio', 'outro'
  meta_financeira VARCHAR(50), -- 'ate_5k', '5k_10k', '10k_20k', 'acima_20k'
  
  -- BLOCO 4: Travas e Dificuldades (array de até 3)
  travas TEXT[], -- ['falta_clientes', 'falta_constancia', 'dificuldade_vender', 'falta_organizacao', 'inseguranca', 'falta_tempo', 'medo_aparecer', 'nao_saber_comecar']
  
  -- BLOCO 5: Tempo, Energia e Disciplina
  tempo_disponivel VARCHAR(50), -- 'ate_30min', '30_60min', '1_2h', 'mais_2h'
  preferencia VARCHAR(50), -- 'guiado', 'autonomo'
  
  -- BLOCO 6: Campo Aberto (OBRIGATÓRIO)
  campo_aberto TEXT NOT NULL, -- Texto livre obrigatório (mínimo 50 caracteres)
  
  -- Metadados
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nutri_diagnostico_user_id ON nutri_diagnostico(user_id);

-- RLS Policies
ALTER TABLE nutri_diagnostico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagnostico"
ON nutri_diagnostico FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostico"
ON nutri_diagnostico FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnostico"
ON nutri_diagnostico FOR UPDATE
USING (auth.uid() = user_id);
```

### **1.2. Tabela de Perfil Estratégico**

Criar nova tabela `nutri_perfil_estrategico`:

```sql
-- Tabela para armazenar perfil estratégico gerado automaticamente
CREATE TABLE IF NOT EXISTS nutri_perfil_estrategico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Classificações automáticas
  tipo_nutri VARCHAR(50), -- 'iniciante', 'clinica_construcao', 'clinica_cheia', 'online_estrategica', 'hibrida'
  nivel_empresarial VARCHAR(50), -- 'baixo', 'medio', 'alto'
  foco_prioritario VARCHAR(50), -- 'captacao', 'organizacao', 'fechamento', 'acompanhamento'
  
  -- Configurações da LYA
  tom_lya VARCHAR(50), -- 'acolhedor', 'firme', 'estrategico', 'direto'
  ritmo_conducao VARCHAR(50), -- 'guiado', 'autonomo'
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nutri_perfil_estrategico_user_id ON nutri_perfil_estrategico(user_id);

-- RLS Policies
ALTER TABLE nutri_perfil_estrategico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own perfil estrategico"
ON nutri_perfil_estrategico FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own perfil estrategico"
ON nutri_perfil_estrategico FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own perfil estrategico"
ON nutri_perfil_estrategico FOR UPDATE
USING (auth.uid() = user_id);
```

### **1.3. Tabela de Análise da LYA**

Adicionar coluna em `user_profiles` ou criar tabela separada:

```sql
-- Opção 1: Adicionar coluna JSONB em user_profiles (mais simples)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS lya_analise_atual JSONB;

-- Opção 2: Tabela separada (mais organizado)
CREATE TABLE IF NOT EXISTS lya_analise_nutri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Análise atual
  foco_principal TEXT,
  acao_pratica TEXT,
  link_interno TEXT,
  metrica_simples TEXT,
  mensagem_completa TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar análise mais recente
CREATE INDEX IF NOT EXISTS idx_lya_analise_user_updated ON lya_analise_nutri(user_id, updated_at DESC);

-- RLS Policies
ALTER TABLE lya_analise_nutri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lya analise"
ON lya_analise_nutri FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lya analise"
ON lya_analise_nutri FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lya analise"
ON lya_analise_nutri FOR UPDATE
USING (auth.uid() = user_id);
```

### **1.4. Flag de Diagnóstico Completo**

Adicionar em `user_profiles`:

```sql
-- Adicionar flag para verificar se diagnóstico foi completado
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS diagnostico_completo BOOLEAN DEFAULT false;

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_user_profiles_diagnostico_completo ON user_profiles(diagnostico_completo) WHERE diagnostico_completo = true;
```

---

## 🔧 PARTE 2: FUNÇÕES E LÓGICA (BACKEND)

### **2.1. Função para Gerar Perfil Estratégico**

Criar arquivo: `src/lib/nutri/gerar-perfil-estrategico.ts`

```typescript
import type { NutriDiagnostico } from '@/types/nutri-diagnostico'

export interface PerfilEstrategico {
  tipo_nutri: 'iniciante' | 'clinica_construcao' | 'clinica_cheia' | 'online_estrategica' | 'hibrida'
  nivel_empresarial: 'baixo' | 'medio' | 'alto'
  foco_prioritario: 'captacao' | 'organizacao' | 'fechamento' | 'acompanhamento'
  tom_lya: 'acolhedor' | 'firme' | 'estrategico' | 'direto'
  ritmo_conducao: 'guiado' | 'autonomo'
}

export function gerarPerfilEstrategico(diagnostico: NutriDiagnostico): PerfilEstrategico {
  // CLASSIFICAÇÃO: Tipo de Nutri
  let tipo_nutri: PerfilEstrategico['tipo_nutri'] = 'iniciante'
  
  if (diagnostico.tempo_atuacao === 'menos_1_ano' || diagnostico.situacao_atual === 'poucos_pacientes') {
    tipo_nutri = 'iniciante'
  } else if (diagnostico.situacao_atual === 'agenda_instavel' || 
             !diagnostico.processos_captacao || !diagnostico.processos_avaliacao) {
    tipo_nutri = 'clinica_construcao'
  } else if (diagnostico.situacao_atual === 'agenda_cheia_desorganizada') {
    tipo_nutri = 'clinica_cheia'
  } else if (diagnostico.tipo_atuacao === 'online' && 
             diagnostico.processos_captacao && diagnostico.processos_avaliacao) {
    tipo_nutri = 'online_estrategica'
  } else if (diagnostico.tipo_atuacao === 'hibrida') {
    tipo_nutri = 'hibrida'
  }
  
  // CLASSIFICAÇÃO: Nível Empresarial
  let nivel_empresarial: PerfilEstrategico['nivel_empresarial'] = 'baixo'
  
  const processosCompletos = [
    diagnostico.processos_captacao,
    diagnostico.processos_avaliacao,
    diagnostico.processos_fechamento,
    diagnostico.processos_acompanhamento
  ].filter(Boolean).length
  
  if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_fraco' || processosCompletos < 2) {
    nivel_empresarial = 'baixo'
  } else if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_razoavel' || processosCompletos === 2 || processosCompletos === 3) {
    nivel_empresarial = 'medio'
  } else if (diagnostico.autoavaliacao === 'tecnica_boa_negocio_bom' || 
             diagnostico.autoavaliacao === 'mais_empreendedora' || 
             processosCompletos === 4) {
    nivel_empresarial = 'alto'
  }
  
  // CLASSIFICAÇÃO: Foco Prioritário
  let foco_prioritario: PerfilEstrategico['foco_prioritario'] = 'captacao'
  
  if (diagnostico.travas?.includes('falta_clientes') || diagnostico.objetivo_principal === 'lotar_agenda') {
    foco_prioritario = 'captacao'
  } else if (diagnostico.travas?.includes('falta_organizacao') || 
             diagnostico.situacao_atual === 'agenda_cheia_desorganizada') {
    foco_prioritario = 'organizacao'
  } else if (diagnostico.travas?.includes('dificuldade_vender') || 
             diagnostico.objetivo_principal === 'vender_planos') {
    foco_prioritario = 'fechamento'
  } else if (!diagnostico.processos_acompanhamento || 
             diagnostico.objetivo_principal === 'aumentar_faturamento') {
    foco_prioritario = 'acompanhamento'
  }
  
  // CLASSIFICAÇÃO: Tom da LYA (analisar campo aberto)
  let tom_lya: PerfilEstrategico['tom_lya'] = 'firme'
  
  const campoAbertoLower = diagnostico.campo_aberto.toLowerCase()
  
  if (campoAbertoLower.includes('insegur') || campoAbertoLower.includes('medo') || 
      campoAbertoLower.includes('ansied') || campoAbertoLower.includes('nervos')) {
    tom_lya = 'acolhedor'
  } else if (campoAbertoLower.includes('urgent') || campoAbertoLower.includes('preciso') || 
             campoAbertoLower.includes('rapid')) {
    tom_lya = 'firme'
  } else if (campoAbertoLower.includes('confus') || campoAbertoLower.includes('nao sei') || 
             campoAbertoLower.includes('perdid')) {
    tom_lya = 'direto'
  } else if (nivel_empresarial === 'alto' || tipo_nutri === 'online_estrategica') {
    tom_lya = 'estrategico'
  }
  
  // CLASSIFICAÇÃO: Ritmo de Condução
  const ritmo_conducao: PerfilEstrategico['ritmo_conducao'] = 
    diagnostico.preferencia === 'guiado' ? 'guiado' : 'autonomo'
  
  return {
    tipo_nutri,
    nivel_empresarial,
    foco_prioritario,
    tom_lya,
    ritmo_conducao
  }
}
```

### **2.2. Tipos TypeScript**

Criar arquivo: `src/types/nutri-diagnostico.ts`

```typescript
export interface NutriDiagnostico {
  id?: string
  user_id: string
  
  // BLOCO 1: Perfil Profissional
  tipo_atuacao: 'clinica_fisica' | 'online' | 'hibrida' | 'iniciante' | 'outra'
  tempo_atuacao: 'menos_1_ano' | '1_3_anos' | '3_5_anos' | 'mais_5_anos'
  autoavaliacao: 'tecnica_boa_negocio_fraco' | 'tecnica_boa_negocio_razoavel' | 'tecnica_boa_negocio_bom' | 'mais_empreendedora'
  
  // BLOCO 2: Momento Atual do Negócio
  situacao_atual: 'poucos_pacientes' | 'agenda_instavel' | 'agenda_cheia_desorganizada' | 'agenda_cheia_organizada'
  processos_captacao: boolean
  processos_avaliacao: boolean
  processos_fechamento: boolean
  processos_acompanhamento: boolean
  
  // BLOCO 3: Objetivo Principal (90 dias)
  objetivo_principal: 'lotar_agenda' | 'organizar_rotina' | 'vender_planos' | 'aumentar_faturamento' | 'estruturar_negocio' | 'outro'
  meta_financeira: 'ate_5k' | '5k_10k' | '10k_20k' | 'acima_20k'
  
  // BLOCO 4: Travas e Dificuldades
  travas: Array<'falta_clientes' | 'falta_constancia' | 'dificuldade_vender' | 'falta_organizacao' | 'inseguranca' | 'falta_tempo' | 'medo_aparecer' | 'nao_saber_comecar'>
  
  // BLOCO 5: Tempo, Energia e Disciplina
  tempo_disponivel: 'ate_30min' | '30_60min' | '1_2h' | 'mais_2h'
  preferencia: 'guiado' | 'autonomo'
  
  // BLOCO 6: Campo Aberto
  campo_aberto: string // Mínimo 50 caracteres
  
  // Metadados
  completed_at?: string
  created_at?: string
  updated_at?: string
}

export interface LyaAnalise {
  id?: string
  user_id: string
  foco_principal: string
  acao_pratica: string
  link_interno: string
  metrica_simples: string
  mensagem_completa: string
  created_at?: string
  updated_at?: string
}
```

---

## 🌐 PARTE 3: APIs (BACKEND)

### **3.1. API de Diagnóstico - POST**

Criar: `src/app/api/nutri/diagnostico/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { gerarPerfilEstrategico } from '@/lib/nutri/gerar-perfil-estrategico'
import type { NutriDiagnostico } from '@/types/nutri-diagnostico'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    
    // Validação: campo aberto obrigatório e mínimo 50 caracteres
    if (!body.campo_aberto || body.campo_aberto.trim().length < 50) {
      return NextResponse.json(
        { error: 'O campo aberto é obrigatório e deve ter no mínimo 50 caracteres.' },
        { status: 400 }
      )
    }
    
    // Validação: travas máximo 3
    if (body.travas && body.travas.length > 3) {
      return NextResponse.json(
        { error: 'Selecione no máximo 3 travas.' },
        { status: 400 }
      )
    }

    // Salvar diagnóstico
    const diagnosticoData: Omit<NutriDiagnostico, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      tipo_atuacao: body.tipo_atuacao,
      tempo_atuacao: body.tempo_atuacao,
      autoavaliacao: body.autoavaliacao,
      situacao_atual: body.situacao_atual,
      processos_captacao: body.processos_captacao || false,
      processos_avaliacao: body.processos_avaliacao || false,
      processos_fechamento: body.processos_fechamento || false,
      processos_acompanhamento: body.processos_acompanhamento || false,
      objetivo_principal: body.objetivo_principal,
      meta_financeira: body.meta_financeira,
      travas: body.travas || [],
      tempo_disponivel: body.tempo_disponivel,
      preferencia: body.preferencia,
      campo_aberto: body.campo_aberto.trim()
    }

    // Inserir ou atualizar diagnóstico
    const { data: diagnostico, error: diagnosticoError } = await supabaseAdmin
      .from('nutri_diagnostico')
      .upsert(diagnosticoData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (diagnosticoError) {
      console.error('❌ Erro ao salvar diagnóstico:', diagnosticoError)
      return NextResponse.json(
        { error: 'Erro ao salvar diagnóstico' },
        { status: 500 }
      )
    }

    // Gerar perfil estratégico automaticamente
    const perfilEstrategico = gerarPerfilEstrategico(diagnostico as NutriDiagnostico)

    // Salvar perfil estratégico
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('nutri_perfil_estrategico')
      .upsert({
        user_id: user.id,
        ...perfilEstrategico
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (perfilError) {
      console.error('❌ Erro ao salvar perfil estratégico:', perfilError)
      // Não bloquear - perfil pode ser gerado depois
    }

    // Marcar diagnóstico como completo em user_profiles
    await supabaseAdmin
      .from('user_profiles')
      .update({ diagnostico_completo: true })
      .eq('user_id', user.id)

    // Trigger: Gerar primeira resposta da LYA
    // Isso será feito em uma chamada separada para não bloquear a resposta

    return NextResponse.json({
      success: true,
      diagnostico,
      perfil_estrategico: perfil || perfilEstrategico,
      message: 'Diagnóstico salvo com sucesso. A LYA está analisando seus dados...'
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao processar diagnóstico', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Verificar se diagnóstico foi completado
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: diagnostico } = await supabaseAdmin
      .from('nutri_diagnostico')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      hasDiagnostico: !!diagnostico,
      diagnostico: diagnostico || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar diagnóstico' },
      { status: 500 }
    )
  }
}
```

### **3.2. API de Perfil Estratégico - GET**

Criar: `src/app/api/nutri/perfil-estrategico/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: perfil, error } = await supabaseAdmin
      .from('nutri_perfil_estrategico')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar perfil estratégico:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar perfil estratégico' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      perfil: perfil || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar perfil estratégico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil estratégico' },
      { status: 500 }
    )
  }
}
```

### **3.3. API da LYA - Gerar Análise**

Criar: `src/app/api/nutri/lya/analise/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// POST - Gerar análise da LYA
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar diagnóstico e perfil estratégico
    const [diagnosticoResult, perfilResult, jornadaResult] = await Promise.all([
      supabaseAdmin
        .from('nutri_diagnostico')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('nutri_perfil_estrategico')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('jornada_progress')
        .select('dia_atual')
        .eq('user_id', user.id)
        .maybeSingle()
    ])

    const diagnostico = diagnosticoResult.data
    const perfil = perfilResult.data
    const jornadaDiaAtual = jornadaResult.data?.dia_atual || null

    if (!diagnostico || !perfil) {
      return NextResponse.json(
        { error: 'Diagnóstico ou perfil estratégico não encontrado' },
        { status: 404 }
      )
    }

    // Construir contexto para a LYA
    const contexto = {
      diagnostico: {
        tipo_atuacao: diagnostico.tipo_atuacao,
        situacao_atual: diagnostico.situacao_atual,
        objetivo_principal: diagnostico.objetivo_principal,
        travas: diagnostico.travas,
        campo_aberto: diagnostico.campo_aberto
      },
      perfil_estrategico: perfil,
      jornada: {
        dia_atual: jornadaDiaAtual,
        iniciada: jornadaDiaAtual !== null
      }
    }

    // PROMPT-MESTRE DA LYA (será substituído pela Assistant depois)
    const systemPrompt = `Você é LYA, mentora estratégica oficial da plataforma Nutri YLADA.

Você não é uma nutricionista clínica. Você é uma mentora empresarial, especialista em:
- posicionamento
- rotina mínima
- captação de clientes
- conversão em planos
- acompanhamento profissional
- crescimento sustentável do negócio nutricional

Sua missão: Transformar cada nutricionista em uma Nutri-Empresária organizada, confiante e lucrativa, guiando sempre pelo próximo passo correto, nunca por excesso de informação.

REGRAS IMPORTANTES:
- Você nunca orienta tudo. Você orienta apenas o próximo passo certo.
- Você deve reconhecer explicitamente o campo aberto na sua resposta.
- Toda resposta deve conter:
  1. Reconhecimento do momento da Nutri
  2. Definição clara do foco atual
  3. Uma única ação prática
  4. Indicação exata de onde clicar no sistema
  5. Uma métrica simples de acompanhamento

Tom de voz: ${perfil.tom_lya}
Ritmo de condução: ${perfil.ritmo_conducao}

REGRA ÚNICA (MVP):
SE jornada não iniciada → sempre orientar: "Inicie o Dia 1 da Jornada" (link: /pt/nutri/metodo/jornada/dia/1)`

    const userMessage = `Dados da nutricionista:

Perfil Estratégico:
- Tipo: ${perfil.tipo_nutri}
- Nível Empresarial: ${perfil.nivel_empresarial}
- Foco Prioritário: ${perfil.foco_prioritario}

Diagnóstico:
- Situação Atual: ${diagnostico.situacao_atual}
- Objetivo: ${diagnostico.objetivo_principal}
- Travas: ${diagnostico.travas.join(', ')}
- Campo Aberto: "${diagnostico.campo_aberto}"

Jornada:
- Iniciada: ${jornadaDiaAtual !== null ? 'Sim' : 'Não'}
- Dia Atual: ${jornadaDiaAtual || 'Não iniciada'}

Gere a primeira análise da LYA seguindo o formato:
1. Reconhecimento do campo aberto
2. Foco principal
3. Uma ação prática única
4. Link interno exato
5. Métrica simples`

    // Chamar OpenAI (por enquanto, depois será Assistant)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Usar modelo mais barato para MVP
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const respostaLya = completion.choices[0]?.message?.content || ''

    // Extrair informações estruturadas da resposta (parsing simples)
    // Por enquanto, salvar resposta completa
    // Depois, quando tiver Assistant, pode retornar JSON estruturado

    // Salvar análise
    const { data: analise, error: analiseError } = await supabaseAdmin
      .from('lya_analise_nutri')
      .insert({
        user_id: user.id,
        mensagem_completa: respostaLya,
        foco_principal: perfil.foco_prioritario,
        acao_pratica: 'Verificar resposta da LYA', // Será extraído depois
        link_interno: jornadaDiaAtual === null ? '/pt/nutri/metodo/jornada/dia/1' : '/pt/nutri/home',
        metrica_simples: 'Executar ação sugerida'
      })
      .select()
      .single()

    if (analiseError) {
      console.error('❌ Erro ao salvar análise da LYA:', analiseError)
    }

    return NextResponse.json({
      success: true,
      analise: {
        mensagem_completa: respostaLya,
        foco_principal: perfil.foco_prioritario,
        acao_pratica: 'Verificar resposta da LYA',
        link_interno: jornadaDiaAtual === null ? '/pt/nutri/metodo/jornada/dia/1' : '/pt/nutri/home',
        metrica_simples: 'Executar ação sugerida'
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar análise da LYA:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar análise da LYA', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Buscar análise atual
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: analise, error } = await supabaseAdmin
      .from('lya_analise_nutri')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar análise da LYA:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar análise da LYA' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      analise: analise || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar análise da LYA:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar análise da LYA' },
      { status: 500 }
    )
  }
}
```

---

## 🎨 PARTE 4: FRONTEND

### **4.1. Página de Diagnóstico**

Criar: `src/app/pt/nutri/diagnostico/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

export default function NutriDiagnosticoPage() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NutriDiagnosticoContent />
    </ProtectedRoute>
  )
}

function NutriDiagnosticoContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    // BLOCO 1
    tipo_atuacao: '',
    tempo_atuacao: '',
    autoavaliacao: '',
    
    // BLOCO 2
    situacao_atual: '',
    processos_captacao: false,
    processos_avaliacao: false,
    processos_fechamento: false,
    processos_acompanhamento: false,
    
    // BLOCO 3
    objetivo_principal: '',
    meta_financeira: '',
    
    // BLOCO 4
    travas: [] as string[],
    
    // BLOCO 5
    tempo_disponivel: '',
    preferencia: '',
    
    // BLOCO 6
    campo_aberto: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validação
    if (!formData.campo_aberto || formData.campo_aberto.trim().length < 50) {
      setError('O campo aberto é obrigatório e deve ter no mínimo 50 caracteres.')
      setLoading(false)
      return
    }

    if (formData.travas.length > 3) {
      setError('Selecione no máximo 3 travas.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/nutri/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar diagnóstico')
      }

      // Gerar primeira análise da LYA
      try {
        await fetch('/api/nutri/lya/analise', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (lyaError) {
        console.warn('⚠️ Erro ao gerar análise da LYA (não crítico):', lyaError)
        // Não bloquear - análise pode ser gerada depois
      }

      // Redirecionar para home
      router.push('/pt/nutri/home')
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar diagnóstico')
      setLoading(false)
    }
  }

  const toggleTrava = (trava: string) => {
    setFormData(prev => {
      const travas = prev.travas.includes(trava)
        ? prev.travas.filter(t => t !== trava)
        : [...prev.travas, trava]
      
      if (travas.length > 3) {
        return prev // Não adicionar mais de 3
      }
      
      return { ...prev, travas }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar />
      
      <div className="flex-1 lg:ml-56">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Diagnóstico Inicial
            </h1>
            <p className="text-gray-600 mb-8">
              A LYA precisa conhecer você para te orientar da melhor forma possível.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BLOCO 1: Perfil Profissional */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  1. Perfil Profissional
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoje você atua principalmente como:
                    </label>
                    <select
                      value={formData.tipo_atuacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo_atuacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="clinica_fisica">Nutricionista clínica (consultório físico)</option>
                      <option value="online">Nutricionista online</option>
                      <option value="hibrida">Híbrida (online + presencial)</option>
                      <option value="iniciante">Recém-formada / iniciando</option>
                      <option value="outra">Outra</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Há quanto tempo você atua como nutricionista?
                    </label>
                    <select
                      value={formData.tempo_atuacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempo_atuacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="menos_1_ano">Menos de 1 ano</option>
                      <option value="1_3_anos">1 a 3 anos</option>
                      <option value="3_5_anos">3 a 5 anos</option>
                      <option value="mais_5_anos">Mais de 5 anos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoje você se considera:
                    </label>
                    <select
                      value={formData.autoavaliacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoavaliacao: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="tecnica_boa_negocio_fraco">Técnica muito boa, mas fraca em vendas/negócio</option>
                      <option value="tecnica_boa_negocio_razoavel">Boa técnica e razoável no negócio</option>
                      <option value="tecnica_boa_negocio_bom">Boa técnica e boa no negócio</option>
                      <option value="mais_empreendedora">Mais empreendedora do que técnica</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: Momento Atual do Negócio */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  2. Momento Atual do Negócio
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qual melhor descreve sua realidade hoje?
                    </label>
                    <select
                      value={formData.situacao_atual}
                      onChange={(e) => setFormData(prev => ({ ...prev, situacao_atual: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="poucos_pacientes">Poucos pacientes / agenda vazia</option>
                      <option value="agenda_instavel">Agenda instável</option>
                      <option value="agenda_cheia_desorganizada">Agenda cheia, mas desorganizada</option>
                      <option value="agenda_cheia_organizada">Agenda cheia e organizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Hoje você tem um processo claro de:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.processos_captacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_captacao: e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Captação de clientes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.processos_avaliacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_avaliacao: e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Avaliação estruturada</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.processos_fechamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_fechamento: e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Fechamento de planos</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.processos_acompanhamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, processos_acompanhamento: e.target.checked }))}
                          className="mr-2"
                        />
                        <span>Acompanhamento ativo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCO 3: Objetivo Principal */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  3. Objetivo Principal (90 dias)
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu principal objetivo nos próximos 90 dias é:
                    </label>
                    <select
                      value={formData.objetivo_principal}
                      onChange={(e) => setFormData(prev => ({ ...prev, objetivo_principal: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="lotar_agenda">Lotar agenda</option>
                      <option value="organizar_rotina">Organizar rotina e processos</option>
                      <option value="vender_planos">Vender planos de acompanhamento</option>
                      <option value="aumentar_faturamento">Aumentar faturamento</option>
                      <option value="estruturar_negocio">Estruturar negócio para crescer</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto você gostaria de faturar por mês?
                    </label>
                    <select
                      value={formData.meta_financeira}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_financeira: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="ate_5k">Até R$5.000</option>
                      <option value="5k_10k">R$5.000 a R$10.000</option>
                      <option value="10k_20k">R$10.000 a R$20.000</option>
                      <option value="acima_20k">Acima de R$20.000</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 4: Travas */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  4. Travas e Dificuldades
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que mais te trava hoje? (selecione até 3)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'falta_clientes', label: 'Falta de clientes' },
                      { value: 'falta_constancia', label: 'Falta de constância' },
                      { value: 'dificuldade_vender', label: 'Dificuldade em vender' },
                      { value: 'falta_organizacao', label: 'Falta de organização' },
                      { value: 'inseguranca', label: 'Insegurança' },
                      { value: 'falta_tempo', label: 'Falta de tempo' },
                      { value: 'medo_aparecer', label: 'Medo de aparecer' },
                      { value: 'nao_saber_comecar', label: 'Não saber por onde começar' }
                    ].map(trava => (
                      <label key={trava.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.travas.includes(trava.value)}
                          onChange={() => toggleTrava(trava.value)}
                          disabled={!formData.travas.includes(trava.value) && formData.travas.length >= 3}
                          className="mr-2"
                        />
                        <span>{trava.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData.travas.length >= 3 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Máximo de 3 travas selecionadas
                    </p>
                  )}
                </div>
              </div>

              {/* BLOCO 5: Tempo e Disciplina */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  5. Tempo, Energia e Disciplina
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto tempo real por dia você pode dedicar ao negócio?
                    </label>
                    <select
                      value={formData.tempo_disponivel}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempo_disponivel: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="ate_30min">Até 30 min</option>
                      <option value="30_60min">30 a 60 min</option>
                      <option value="1_2h">1 a 2 horas</option>
                      <option value="mais_2h">Mais de 2 horas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Você prefere:
                    </label>
                    <select
                      value={formData.preferencia}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferencia: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="guiado">Passo a passo bem guiado</option>
                      <option value="autonomo">Autonomia com orientação pontual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BLOCO 6: Campo Aberto (OBRIGATÓRIO) */}
              <div className="pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  6. O que ainda não te perguntamos
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existe algo importante sobre você, seu momento ou seu negócio que não perguntamos aqui e que a LYA deveria saber para te orientar melhor?
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData.campo_aberto}
                    onChange={(e) => setFormData(prev => ({ ...prev, campo_aberto: e.target.value }))}
                    required
                    minLength={50}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escreva livremente aqui. Mínimo 50 caracteres."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.campo_aberto.length}/50 caracteres (mínimo)
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || formData.campo_aberto.length < 50}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Finalizar Diagnóstico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### **4.2. Componente LyaAnaliseHoje**

Criar: `src/components/nutri/LyaAnaliseHoje.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LyaAnalise {
  foco_principal: string
  acao_pratica: string
  link_interno: string
  metrica_simples: string
  mensagem_completa: string
}

export default function LyaAnaliseHoje() {
  const [analise, setAnalise] = useState<LyaAnalise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarAnalise = async () => {
      try {
        const response = await fetch('/api/nutri/lya/analise', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.analise) {
            setAnalise(data.analise)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar análise da LYA:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarAnalise()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!analise) {
    return null // Não mostrar se não houver análise
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            LYA
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            💡 Análise da LYA para você hoje:
          </h3>
          <div className="text-gray-700 whitespace-pre-line mb-4">
            {analise.mensagem_completa}
          </div>
          {analise.link_interno && (
            <Link
              href={analise.link_interno}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir para ação →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
```

### **4.3. Adicionar Componente na Home**

Atualizar: `src/app/pt/nutri/home/page.tsx`

Adicionar após o vídeo de boas-vindas:

```typescript
import LyaAnaliseHoje from '@/components/nutri/LyaAnaliseHoje'

// Dentro do componente, após o vídeo:
{/* Análise da LYA Hoje */}
<div className="mb-8">
  <LyaAnaliseHoje />
</div>
```

### **4.4. Bloqueio de Acesso até Completar Diagnóstico**

Atualizar: `src/components/auth/ProtectedRoute.tsx` ou criar middleware

Adicionar verificação:

```typescript
// Verificar se diagnóstico foi completado
const { data: userProfile } = await supabaseAdmin
  .from('user_profiles')
  .select('diagnostico_completo')
  .eq('user_id', user.id)
  .maybeSingle()

if (userProfile && !userProfile.diagnostico_completo) {
  // Redirecionar para diagnóstico
  router.push('/pt/nutri/diagnostico')
  return null
}
```

---

## 🎯 PARTE 5: REGRA ÚNICA (MVP)

### **5.1. Lógica de Decisão**

No prompt da LYA, incluir:

```
REGRA ÚNICA (MVP):
SE jornada_nao_iniciada (jornada.dia_atual === null)
→ LYA sempre orienta: "Inicie o Dia 1 da Jornada"
→ Link: /pt/nutri/metodo/jornada/dia/1
→ Ação: Acessar Dia 1
→ Métrica: Completar Dia 1 até hoje
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Backend:**
- [ ] Executar SQL para criar tabelas
- [ ] Criar função `gerarPerfilEstrategico()`
- [ ] Criar tipos TypeScript
- [ ] API `/api/nutri/diagnostico` (POST, GET)
- [ ] API `/api/nutri/perfil-estrategico` (GET)
- [ ] API `/api/nutri/lya/analise` (POST, GET)
- [ ] Adicionar flag `diagnostico_completo` em `user_profiles`

### **Frontend:**
- [ ] Página `/pt/nutri/diagnostico` (formulário completo)
- [ ] Componente `LyaAnaliseHoje`
- [ ] Adicionar componente na home
- [ ] Bloqueio de acesso até completar diagnóstico
- [ ] Validações do formulário

### **Integração OpenAI:**
- [ ] Configurar OpenAI (já deve estar configurado)
- [ ] Usar prompt-mestre da LYA
- [ ] Gerar primeira resposta após diagnóstico
- [ ] Salvar análise no banco

### **Testes:**
- [ ] Testar formulário completo
- [ ] Testar geração de perfil estratégico
- [ ] Testar primeira resposta da LYA
- [ ] Testar bloqueio de acesso
- [ ] Testar exibição na home

---

## 📝 NOTAS IMPORTANTES

1. **Campo Aberto é Crítico:**
   - Obrigatório (mínimo 50 caracteres)
   - LYA deve reconhecer explicitamente
   - Influencia tom, ritmo e prioridade

2. **Visual Simples:**
   - Não refinar design agora
   - Focar em funcionalidade
   - Testar com usuários reais primeiro

3. **Uma Regra por Vez:**
   - MVP: apenas regra da Jornada
   - Não criar múltiplas automações ainda
   - Expandir depois de testes

4. **OpenAI por Enquanto:**
   - Usar chat completions (gpt-4o-mini)
   - Depois migrar para Assistant quando código estiver pronto

---

## 🚀 PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. Testar com você mesmo
2. Testar com 2-3 nutricionistas reais
3. Observar onde travam
4. Observar onde executam
5. Observar onde ignoram a LYA
6. Ajustar baseado em uso real
7. Depois: criar Assistant na OpenAI
8. Depois: expandir regras de decisão
9. Depois: refinar visual

---

**Status:** ✅ Pacote completo pronto para implementação  
**Próximo passo:** Claude implementa tudo acima

