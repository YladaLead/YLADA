# 🏗️ GUIA CONSOLIDADO: Estrutura de Código

**Objetivo:** Documentar a estrutura completa do código e organização do projeto  
**Última atualização:** Hoje  
**Versão:** 1.0.0

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Organização por Área](#3-organização-por-área)
4. [Componentes](#4-componentes)
5. [Hooks](#5-hooks)
6. [Bibliotecas (lib)](#6-bibliotecas-lib)
7. [Tipos e Interfaces](#7-tipos-e-interfaces)
8. [Roteamento](#8-roteamento)
9. [Padrões de Código](#9-padrões-de-código)

---

## 1. VISÃO GERAL

### **1.1. Tecnologias Principais**

- **Framework:** Next.js 15.5.3 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Deploy:** Vercel

### **1.2. Arquitetura**

- **Multi-área:** Wellness, Nutri, Nutra, Coach
- **Multi-idioma:** Português (pt), Inglês (en), Espanhol (es)
- **Templates Reutilizáveis:** Sistema de templates compartilhados
- **Pagamento Unificado:** Mercado Pago (BR) + Stripe (Internacional)

---

## 2. ESTRUTURA DE PASTAS

### **2.1. Estrutura Raiz**

```
ylada-app/
├── src/                          # Código fonte
│   ├── app/                      # Next.js App Router
│   ├── components/               # Componentes React
│   ├── lib/                      # Bibliotecas e utilitários
│   ├── hooks/                    # React Hooks customizados
│   ├── types/                    # TypeScript types
│   └── styles/                   # Estilos globais
├── docs/                         # Documentação
├── scripts/                      # Scripts SQL e utilitários
├── public/                       # Arquivos estáticos
├── .env.local                    # Variáveis de ambiente (local)
├── package.json                  # Dependências
└── tsconfig.json                 # Configuração TypeScript
```

### **2.2. Estrutura Detalhada**

```
src/
├── app/
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Landing page principal
│   ├── pt/                       # Roteamento em Português
│   │   ├── wellness/             # Área Wellness
│   │   ├── nutri/                # Área Nutri
│   │   ├── nutra/                # Área Nutra
│   │   └── coach/                # Área Coach
│   └── api/                      # API Routes
│       ├── [area]/               # APIs por área
│       ├── webhooks/             # Webhooks de pagamento
│       ├── auth/                 # Autenticação
│       └── email/                # E-mails
├── components/
│   ├── auth/                     # Componentes de autenticação
│   ├── wellness/                 # Componentes Wellness
│   ├── nutri/                    # Componentes Nutri
│   └── shared/                   # Componentes compartilhados
├── lib/
│   ├── supabase.ts               # Cliente Supabase
│   ├── mercado-pago.ts           # Cliente Mercado Pago
│   ├── stripe-helpers.ts         # Helpers Stripe
│   ├── email-templates.ts        # Templates de e-mail
│   ├── diagnostics/              # Diagnósticos por área
│   └── template-benefits.ts      # Benefícios de templates
├── hooks/
│   ├── useAuth.ts                # Hook de autenticação
│   └── useWellnessConfig.ts      # Hook de configuração Wellness
└── types/
    ├── wellness.ts               # Types Wellness
    └── global.ts                 # Types globais
```

---

## 3. ORGANIZAÇÃO POR ÁREA

### **3.1. Estrutura de Área (Exemplo: Wellness)**

```
src/app/pt/wellness/
├── page.tsx                      # Landing page Wellness
├── dashboard/
│   └── page.tsx                 # Dashboard principal
├── ferramentas/
│   ├── page.tsx                 # Lista de ferramentas
│   ├── nova/
│   │   └── page.tsx             # Criar nova ferramenta
│   └── [id]/
│       └── editar/
│           └── page.tsx         # Editar ferramenta
├── templates/
│   ├── page.tsx                 # Página de templates + preview
│   ├── imc/
│   │   └── page.tsx             # Template IMC
│   └── [outros-templates]/
└── configuracao/
    └── page.tsx                 # Configurações
```

### **3.2. APIs por Área**

```
src/app/api/wellness/
├── checkout/
│   └── route.ts                 # Checkout de pagamento
├── subscription/
│   ├── route.ts                 # Verificar assinatura
│   └── check/
│       └── route.ts             # Verificar status
├── templates/
│   └── route.ts                 # Listar templates
└── dashboard/
    └── route.ts                 # Dados do dashboard
```

### **3.3. Componentes por Área**

```
src/components/wellness/
├── WellnessHeader.tsx           # Header específico
├── WellnessLanding.tsx          # Landing page reutilizável
├── WellnessCTAButton.tsx        # Botão CTA personalizado
└── WellnessDashboard.tsx        # Dashboard
```

---

## 4. COMPONENTES

### **4.1. Componentes de Autenticação**

**Localização:** `src/components/auth/`

**Componentes:**
- `ProtectedRoute.tsx` - Rota protegida por autenticação
- `RequireSubscription.tsx` - Requer assinatura ativa
- `SubscriptionExpiryBanner.tsx` - Banner de expiração

**Uso:**
```typescript
<ProtectedRoute area="wellness">
  <RequireSubscription area="wellness">
    <WellnessDashboard />
  </RequireSubscription>
</ProtectedRoute>
```

---

### **4.2. Componentes Compartilhados**

**Localização:** `src/components/shared/`

**Componentes:**
- `NavBar.tsx` - Barra de navegação
- `Footer.tsx` - Rodapé
- `LoadingSpinner.tsx` - Spinner de carregamento
- `ErrorBoundary.tsx` - Tratamento de erros

---

### **4.3. Componentes de Templates**

**Localização:** `src/components/templates/`

**Componentes:**
- `DynamicTemplatePreview.tsx` - Preview dinâmico de templates
- `TemplateCard.tsx` - Card de template
- `TemplateList.tsx` - Lista de templates

---

## 5. HOOKS

### **5.1. useAuth**

**Localização:** `src/hooks/useAuth.ts`

**Funcionalidade:**
- Gerencia estado de autenticação
- Busca sessão do Supabase
- Carrega perfil do usuário
- Gerencia loading states

**Uso:**
```typescript
const { user, userProfile, loading, error } = useAuth()
```

---

### **5.2. useWellnessConfig**

**Localização:** `src/hooks/useWellnessConfig.ts`

**Funcionalidade:**
- Gerencia configurações de templates Wellness
- Salva configurações no localStorage
- Carrega configurações padrão

**Uso:**
```typescript
const { config, updateConfig } = useWellnessConfig()
```

---

## 6. BIBLIOTECAS (LIB)

### **6.1. Supabase**

**Localização:** `src/lib/supabase.ts`

**Exports:**
- `supabase` - Cliente Supabase (browser)
- `supabaseAdmin` - Cliente Supabase Admin (server)

**Uso:**
```typescript
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'
```

---

### **6.2. Pagamentos**

**Mercado Pago:**
- `src/lib/mercado-pago.ts` - Cliente Mercado Pago
- `src/lib/mercado-pago-subscriptions.ts` - Assinaturas

**Stripe:**
- `src/lib/stripe-helpers.ts` - Helpers Stripe
- `src/lib/payment-gateway.ts` - Factory de gateways

**Uso:**
```typescript
import { createCheckout } from '@/lib/payment-gateway'

const checkout = await createCheckout({
  area: 'wellness',
  planType: 'monthly',
  user,
  countryCode: 'BR'
})
```

---

### **6.3. E-mail**

**Localização:** `src/lib/email-templates.ts`

**Funções:**
- `sendWelcomeEmail()` - E-mail de boas-vindas
- `sendAccessLinkEmail()` - Link de acesso

**Uso:**
```typescript
import { sendWelcomeEmail } from '@/lib/email-templates'

await sendWelcomeEmail({
  to: 'usuario@email.com',
  area: 'wellness'
})
```

---

### **6.4. Diagnósticos**

**Localização:** `src/lib/diagnostics/`

**Estrutura:**
```
diagnostics/
├── wellness/
│   ├── quiz-interativo.ts
│   └── [outros-quizzes].ts
├── nutri/
│   └── [diagnosticos-nutri].ts
└── index.ts                     # Export centralizado
```

**Uso:**
```typescript
import { getDiagnostico } from '@/lib/diagnostics'

const diagnostico = getDiagnostico('quiz-interativo', 'wellness')
```

---

### **6.5. Benefícios de Templates**

**Localização:** `src/lib/template-benefits.ts`

**Função:**
```typescript
getTemplateBenefits(templateSlug: string): {
  discover: string[],
  whyUse: string[]
}
```

**Uso:**
```typescript
import { getTemplateBenefits } from '@/lib/template-benefits'

const benefits = getTemplateBenefits('calc-imc')
```

---

## 7. TIPOS E INTERFACES

### **7.1. Types Globais**

**Localização:** `src/types/global.ts`

**Types:**
```typescript
export type Area = 'wellness' | 'nutri' | 'nutra' | 'coach'
export type Language = 'pt' | 'en' | 'es'
export type PlanType = 'monthly' | 'annual'
```

---

### **7.2. Types por Área**

**Localização:** `src/types/wellness.ts`

**Types:**
```typescript
export interface ToolConfig {
  emoji: string
  title: string
  description: string
  cta: {
    text: string
    url: string
  }
}
```

---

## 8. ROTEAMENTO

### **8.1. Estrutura de Rotas**

**Next.js App Router:**
- `app/[lang]/[area]/[page]` - Páginas dinâmicas
- `app/api/[route]` - API Routes

**Exemplos:**
- `/pt/wellness/dashboard` → `app/pt/wellness/dashboard/page.tsx`
- `/api/wellness/checkout` → `app/api/wellness/checkout/route.ts`

---

### **8.2. Rotas Dinâmicas**

**Templates:**
- `/pt/wellness/templates/[slug]` → `app/pt/wellness/templates/[slug]/page.tsx`

**Ferramentas:**
- `/pt/wellness/ferramentas/[id]/editar` → `app/pt/wellness/ferramentas/[id]/editar/page.tsx`

---

## 9. PADRÕES DE CÓDIGO

### **9.1. Convenções de Nomenclatura**

**Arquivos:**
- Componentes: `PascalCase.tsx` (ex: `WellnessHeader.tsx`)
- Hooks: `camelCase.ts` com prefixo `use` (ex: `useAuth.ts`)
- Utilitários: `camelCase.ts` (ex: `payment-gateway.ts`)
- Types: `camelCase.ts` (ex: `wellness.ts`)

**Variáveis e Funções:**
- `camelCase` para variáveis e funções
- `PascalCase` para componentes e classes
- `UPPER_SNAKE_CASE` para constantes

---

### **9.2. Estrutura de Componentes**

```typescript
'use client' // Se for componente cliente

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  // Props do componente
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks
  const { user } = useAuth()
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Lógica
  }, [])
  
  // Handlers
  const handleClick = () => {
    // Lógica
  }
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

---

### **9.3. Estrutura de API Routes**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    // Validação
    const body = await request.json()
    
    // Autenticação (se necessário)
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    // Lógica
    const result = await processRequest(body)
    
    // Resposta
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

### **9.4. Logs e Debug**

**Padrão de Logs:**
```typescript
console.log('📥 Operação iniciada:', { param1, param2 })
console.log('✅ Operação concluída:', { result })
console.error('❌ Erro:', { error: error.message })
console.warn('⚠️ Aviso:', { message })
```

**Emojis para Categorização:**
- 📥 Entrada/Recebimento
- ✅ Sucesso
- ❌ Erro
- ⚠️ Aviso
- 🔄 Processamento
- 📋 Informação

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `ESTRUTURA-COMPLETA-SISTEMA.md` ⭐
- `ESTRUTURA-PAGINAS.md` ⭐
- `docs/wellness-template-structure.md` ⭐
- `REFACTOR-ESTRUTURA.md`
- `PROPOSTA-REESTRUTURACAO-CLEAN.md`

### **Arquivos Importantes:**
- `package.json` - Dependências
- `tsconfig.json` - Configuração TypeScript
- `tailwind.config.js` - Configuração Tailwind
- `.env.local.example` - Template de variáveis

---

## ✅ CONCLUSÃO

Este guia consolida a estrutura completa do código. Use como referência ao:
- Navegar pelo código
- Adicionar novas funcionalidades
- Manter consistência
- Onboardar novos desenvolvedores

**Lembre-se:**
- ⚠️ Seguir convenções de nomenclatura
- ⚠️ Manter estrutura organizada por área
- ⚠️ Usar componentes compartilhados quando possível
- ⚠️ Documentar código complexo

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

