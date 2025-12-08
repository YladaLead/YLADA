# 🎯 NOEL - Sistema de Onboarding e Perfil Inicial

## 📋 Objetivo

Implementar o sistema de perguntas iniciais do NOEL que coleta:
1. Objetivo principal no wellness
2. Tempo disponível por dia
3. Experiência com vendas
4. Canal preferido de trabalho
5. Lista de contatos disponível

E usa essas respostas para personalizar todas as recomendações futuras.

---

## 🗄️ Estrutura do Banco de Dados

### **1. Criar Tabela de Perfil NOEL**

```sql
-- Tabela para armazenar perfil do NOEL (diferente do perfil do usuário)
CREATE TABLE IF NOT EXISTS wellness_noel_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Respostas do questionário inicial
  objetivo_principal TEXT CHECK (objetivo_principal IN (
    'vender_mais',
    'construir_carteira',
    'melhorar_rotina',
    'voltar_ritmo',
    'aprender_divulgar'
  )),
  
  tempo_disponivel TEXT CHECK (tempo_disponivel IN (
    '15_minutos',
    '30_minutos',
    '1_hora',
    'mais_1_hora'
  )),
  
  experiencia_vendas TEXT CHECK (experiencia_vendas IN (
    'sim_regularmente',
    'ja_vendi_tempo',
    'nunca_vendi'
  )),
  
  canal_preferido TEXT[] DEFAULT '{}', -- Array: ['whatsapp', 'instagram', 'presencial', 'grupos', 'misto']
  
  tem_lista_contatos TEXT CHECK (tem_lista_contatos IN ('sim', 'nao', 'parcialmente')),
  
  -- Status do onboarding
  onboarding_completo BOOLEAN DEFAULT false,
  onboarding_iniciado_at TIMESTAMPTZ,
  onboarding_completado_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_noel_profile_user ON wellness_noel_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_profile_onboarding ON wellness_noel_profile(onboarding_completo);

-- Comentários
COMMENT ON TABLE wellness_noel_profile IS 'Perfil do NOEL - Respostas do questionário inicial de onboarding';
```

---

## 🔧 Implementação no Backend

### **1. API para Verificar Status do Onboarding**

**Arquivo:** `src/app/api/wellness/noel/onboarding/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Verifica se o usuário já completou o onboarding
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
      console.error('❌ Erro ao buscar perfil NOEL:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasProfile: !!data,
      onboardingComplete: data?.onboarding_completo || false,
      profile: data || null,
    })
  } catch (error: any) {
    console.error('❌ Erro no onboarding check:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar onboarding' },
      { status: 500 }
    )
  }
}

/**
 * POST - Salva respostas do onboarding
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const {
      objetivo_principal,
      tempo_disponivel,
      experiencia_vendas,
      canal_preferido,
      tem_lista_contatos,
    } = body

    // Validações
    if (!objetivo_principal || !tempo_disponivel || !experiencia_vendas || !canal_preferido || !tem_lista_contatos) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar ou atualizar perfil
    const { data, error } = await supabaseAdmin
      .from('wellness_noel_profile')
      .upsert({
        user_id: user.id,
        objetivo_principal,
        tempo_disponivel,
        experiencia_vendas,
        canal_preferido: Array.isArray(canal_preferido) ? canal_preferido : [canal_preferido],
        tem_lista_contatos,
        onboarding_completo: true,
        onboarding_completado_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar perfil NOEL:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: data,
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar onboarding:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar onboarding' },
      { status: 500 }
    )
  }
}
```

### **2. Modificar API Principal do NOEL**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

Adicionar no início da função `POST`:

```typescript
// Verificar se precisa fazer onboarding
const { data: noelProfile } = await supabaseAdmin
  .from('wellness_noel_profile')
  .select('onboarding_completo')
  .eq('user_id', user.id)
  .maybeSingle()

// Se não completou onboarding e não está respondendo as perguntas
if (!noelProfile?.onboarding_completo && !message.toLowerCase().includes('objetivo') && !message.toLowerCase().includes('tempo')) {
  return NextResponse.json({
    response: `Olá! 👋 Bem-vindo ao NOEL!\n\nAntes de começarmos, preciso conhecer você melhor para personalizar minhas respostas.\n\n🧭 Vamos começar?\n\n**1. Qual é o seu objetivo principal no wellness?**\n\n( ) Vender mais\n( ) Construir carteira de clientes\n( ) Melhorar minha rotina\n( ) Voltar ao ritmo depois de uma pausa\n( ) Só aprender a divulgar\n\nDigite o número ou a opção que mais combina com você! 😊`,
    module: 'mentor' as const,
    source: 'onboarding' as const,
    requiresOnboarding: true,
  })
}
```

---

## 🎨 Implementação no Frontend

### **1. Componente de Onboarding**

**Arquivo:** `src/components/wellness/NoelOnboarding.tsx`

```typescript
'use client'

import { useState } from 'react'

interface NoelOnboardingProps {
  onComplete: (answers: OnboardingAnswers) => void
}

interface OnboardingAnswers {
  objetivo_principal: string
  tempo_disponivel: string
  experiencia_vendas: string
  canal_preferido: string[]
  tem_lista_contatos: string
}

export default function NoelOnboarding({ onComplete }: NoelOnboardingProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})

  const handleAnswer = (field: keyof OnboardingAnswers, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Completar onboarding
      onComplete(answers as OnboardingAnswers)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎯</span>
          <h2 className="text-xl font-bold text-gray-900">
            Vamos conhecer você melhor!
          </h2>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Pergunta {step} de 5
        </p>
      </div>

      {/* Pergunta 1: Objetivo */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            1. Qual é o seu objetivo principal no wellness?
          </h3>
          <div className="space-y-2">
            {[
              { value: 'vender_mais', label: 'Vender mais' },
              { value: 'construir_carteira', label: 'Construir carteira de clientes' },
              { value: 'melhorar_rotina', label: 'Melhorar minha rotina' },
              { value: 'voltar_ritmo', label: 'Voltar ao ritmo depois de uma pausa' },
              { value: 'aprender_divulgar', label: 'Só aprender a divulgar' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer('objetivo_principal', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers.objetivo_principal === option.value
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pergunta 2: Tempo */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            2. Quanto tempo por dia você tem disponível?
          </h3>
          <div className="space-y-2">
            {[
              { value: '15_minutos', label: '15 minutos' },
              { value: '30_minutos', label: '30 minutos' },
              { value: '1_hora', label: '1 hora' },
              { value: 'mais_1_hora', label: 'Mais de 1 hora' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer('tempo_disponivel', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers.tempo_disponivel === option.value
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pergunta 3: Experiência */}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            3. Você já vendeu bebidas funcionais antes?
          </h3>
          <div className="space-y-2">
            {[
              { value: 'sim_regularmente', label: 'Sim, regularmente' },
              { value: 'ja_vendi_tempo', label: 'Já vendi, mas faz tempo' },
              { value: 'nunca_vendi', label: 'Nunca vendi' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer('experiencia_vendas', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers.experiencia_vendas === option.value
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pergunta 4: Canal */}
      {step === 4 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            4. Como você prefere trabalhar? (Pode escolher mais de uma)
          </h3>
          <div className="space-y-2">
            {[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'presencial', label: 'Rua / Presencial' },
              { value: 'grupos', label: 'Grupos' },
              { value: 'misto', label: 'Misto' },
            ].map(option => {
              const isSelected = (answers.canal_preferido || []).includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = answers.canal_preferido || []
                    const newValue = isSelected
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value]
                    handleAnswer('canal_preferido', newValue)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isSelected && '✓ '}
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Pergunta 5: Lista de contatos */}
      {step === 5 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            5. Você já tem lista de contatos para começar hoje?
          </h3>
          <div className="space-y-2">
            {[
              { value: 'sim', label: 'Sim' },
              { value: 'nao', label: 'Não' },
              { value: 'parcialmente', label: 'Parcialmente' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer('tem_lista_contatos', option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers.tem_lista_contatos === option.value
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
        >
          ← Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !answers.objetivo_principal) ||
            (step === 2 && !answers.tempo_disponivel) ||
            (step === 3 && !answers.experiencia_vendas) ||
            (step === 4 && (!answers.canal_preferido || answers.canal_preferido.length === 0)) ||
            (step === 5 && !answers.tem_lista_contatos)
          }
          className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
        >
          {step === 5 ? 'Finalizar ✓' : 'Próximo →'}
        </button>
      </div>
    </div>
  )
}
```

### **2. Modificar Página do NOEL**

**Arquivo:** `src/app/pt/wellness/noel/page.tsx`

Adicionar no início do componente:

```typescript
const [showOnboarding, setShowOnboarding] = useState(false)
const [onboardingComplete, setOnboardingComplete] = useState(false)

// Verificar onboarding ao carregar
useEffect(() => {
  const checkOnboarding = async () => {
    try {
      const response = await authenticatedFetch('/api/wellness/noel/onboarding')
      const data = await response.json()
      
      if (!data.onboardingComplete) {
        setShowOnboarding(true)
      } else {
        setOnboardingComplete(true)
      }
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error)
    }
  }
  
  checkOnboarding()
}, [])

const handleOnboardingComplete = async (answers: OnboardingAnswers) => {
  try {
    const response = await authenticatedFetch('/api/wellness/noel/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    
    if (response.ok) {
      setShowOnboarding(false)
      setOnboardingComplete(true)
      // Mostrar mensagem de boas-vindas personalizada
      setMensagens([{
        id: '1',
        texto: `Perfeito! Agora que te conheço melhor, posso te ajudar de forma personalizada! 🎯\n\nBaseado no seu perfil, vou te dar recomendações específicas para você.\n\n**Como posso te ajudar hoje?**`,
        tipo: 'noel',
        timestamp: new Date()
      }])
    }
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error)
  }
}

// No return, adicionar:
{showOnboarding && !onboardingComplete && (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <NoelOnboarding onComplete={handleOnboardingComplete} />
  </div>
)}

{!showOnboarding && onboardingComplete && (
  // ... resto do chat normal
)}
```

---

## 🎯 Como Usar o Perfil nas Respostas

### **Modificar `buildSystemPrompt`**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

```typescript
// Buscar perfil NOEL
const { data: noelProfile } = await supabaseAdmin
  .from('wellness_noel_profile')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle()

// Adicionar contexto do perfil NOEL
const noelProfileContext = noelProfile ? `
Perfil do Consultor (coletado no onboarding):
- Objetivo: ${noelProfile.objetivo_principal}
- Tempo disponível: ${noelProfile.tempo_disponivel}
- Experiência: ${noelProfile.experiencia_vendas}
- Canais preferidos: ${noelProfile.canal_preferido.join(', ')}
- Tem lista de contatos: ${noelProfile.tem_lista_contatos}

Use este perfil para:
- Personalizar recomendações
- Ajustar scripts aos canais preferidos
- Adaptar ações ao tempo disponível
- Direcionar fluxos adequados
` : ''

// Incluir no system prompt
const systemPrompt = buildSystemPrompt(module, knowledgeContext, consultantContext, noelProfileContext)
```

---

## ✅ Resumo da Implementação

1. **Banco de Dados:** Tabela `wellness_noel_profile` para armazenar respostas
2. **Backend:** API `/api/wellness/noel/onboarding` para verificar e salvar
3. **Frontend:** Componente `NoelOnboarding` com 5 perguntas interativas
4. **Integração:** Perfil usado para personalizar todas as respostas do NOEL

---

**Status:** ✅ Pronto para implementar





