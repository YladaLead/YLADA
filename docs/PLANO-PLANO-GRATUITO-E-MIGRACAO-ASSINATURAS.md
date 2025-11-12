# 📋 PLANO: PLANO GRATUITO E MIGRAÇÃO DE ASSINATURAS

## 🎯 OBJETIVOS

1. **Adicionar suporte a plano gratuito** para incluir pessoas sem custo
2. **Migrar assinaturas de outro app** com prazo de validade preservado
3. **Gerenciar renovação manual** para assinaturas migradas (sem dados de cartão)

---

## 📊 SITUAÇÃO ATUAL

### Estrutura de Assinaturas
- Tabela `subscriptions` existe e funciona
- Suporta apenas planos pagos (`monthly`, `annual`)
- Status: `active`, `canceled`, `past_due`, `unpaid`, `trialing`, `incomplete`
- Verificação via `hasActiveSubscription()` e `RequireSubscription` component

### Limitações Atuais
- ❌ Não há suporte para plano `free`
- ❌ Não há campo para marcar assinaturas como "migradas"
- ❌ Não há campo para indicar que renovação é manual
- ❌ Não há sistema para gerenciar renovações manuais

---

## 🚀 PLANO DE IMPLEMENTAÇÃO

### FASE 1: ESTRUTURA DE BANCO DE DADOS

#### 1.1 Adicionar campos na tabela `subscriptions`

```sql
-- Adicionar suporte a plano gratuito
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) CHECK (plan_type IN ('monthly', 'annual', 'free'));

-- Adicionar campos para migração
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS is_migrated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS migrated_from VARCHAR(255), -- Nome do app anterior
ADD COLUMN IF NOT EXISTS migrated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS requires_manual_renewal BOOLEAN DEFAULT false, -- Se true, renovação manual
ADD COLUMN IF NOT EXISTS original_expiry_date TIMESTAMP WITH TIME ZONE; -- Data original do outro app

-- Atualizar constraint de plan_type se necessário
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('monthly', 'annual', 'free'));
```

#### 1.2 Criar tabela para gerenciar renovações manuais (opcional)

```sql
CREATE TABLE IF NOT EXISTS manual_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL,
  renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manual_renewals_subscription_id ON manual_renewals(subscription_id);
CREATE INDEX IF NOT EXISTS idx_manual_renewals_user_id ON manual_renewals(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_renewals_status ON manual_renewals(status);
```

---

### FASE 2: ATUALIZAR FUNÇÕES E HELPERS

#### 2.1 Atualizar `hasActiveSubscription()` para incluir plano gratuito

```typescript
// src/lib/subscription-helpers.ts

export async function hasActiveSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status, current_period_end, plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .in('status', ['active', 'trialing']) // Incluir 'trialing' se necessário
      .gt('current_period_end', new Date().toISOString())
      .limit(1)

    if (error) {
      console.error('❌ Erro ao verificar assinatura:', error)
      return false
    }

    // Se tem assinatura ativa (paga ou gratuita), retornar true
    return (data?.length || 0) > 0
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error)
    return false
  }
}

// Nova função: Verificar se tem plano gratuito
export async function hasFreePlan(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('plan_type', 'free')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .limit(1)

    if (error) {
      console.error('❌ Erro ao verificar plano gratuito:', error)
      return false
    }

    return (data?.length || 0) > 0
  } catch (error) {
    console.error('❌ Erro ao verificar plano gratuito:', error)
    return false
  }
}
```

#### 2.2 Atualizar função SQL `has_active_subscription()`

```sql
-- Atualizar função para incluir plano gratuito
CREATE OR REPLACE FUNCTION has_active_subscription(
  p_user_id UUID,
  p_area VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM subscriptions
  WHERE user_id = p_user_id
    AND area = p_area
    AND status = 'active'
    AND current_period_end > NOW();
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### FASE 3: CRIAR API PARA GERENCIAR PLANOS GRATUITOS E MIGRAÇÕES

#### 3.1 API para criar plano gratuito

```typescript
// src/app/api/admin/subscriptions/free/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/subscriptions/free
 * Cria assinatura gratuita para um usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, area, expires_at } = body

    // Validar campos obrigatórios
    if (!user_id || !area) {
      return NextResponse.json(
        { error: 'user_id e area são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida' },
        { status: 400 }
      )
    }

    // Calcular datas (se não fornecidas, 1 ano a partir de agora)
    const now = new Date()
    const periodStart = now.toISOString()
    const periodEnd = expires_at 
      ? new Date(expires_at).toISOString()
      : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()

    // Criar assinatura gratuita
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id,
        area,
        plan_type: 'free',
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        // Campos Stripe vazios para plano gratuito
        stripe_account: 'br', // Placeholder
        stripe_subscription_id: `free_${user_id}_${area}_${Date.now()}`,
        stripe_customer_id: `free_${user_id}`,
        stripe_price_id: 'free',
        amount: 0,
        currency: 'brl',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar plano gratuito:', error)
      return NextResponse.json(
        { error: 'Erro ao criar plano gratuito' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar plano gratuito:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar plano gratuito' },
      { status: 500 }
    )
  }
}
```

#### 3.2 API para migrar assinaturas de outro app

```typescript
// src/app/api/admin/subscriptions/migrate/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/subscriptions/migrate
 * Migra assinatura de outro app para YLADA
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      area, 
      plan_type, // 'monthly' ou 'annual'
      expires_at, // Data de vencimento do outro app
      migrated_from, // Nome do app anterior
      requires_manual_renewal = true // Por padrão, renovação manual
    } = body

    // Validar campos
    if (!user_id || !area || !expires_at || !migrated_from) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: user_id, area, expires_at, migrated_from' },
        { status: 400 }
      )
    }

    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida' },
        { status: 400 }
      )
    }

    // Validar plan_type
    if (!['monthly', 'annual'].includes(plan_type)) {
      return NextResponse.json(
        { error: 'plan_type deve ser monthly ou annual' },
        { status: 400 }
      )
    }

    const now = new Date()
    const periodStart = now.toISOString()
    const periodEnd = new Date(expires_at).toISOString()

    // Verificar se já existe assinatura ativa
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user_id)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', now.toISOString())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Usuário já tem assinatura ativa para esta área' },
        { status: 400 }
      )
    }

    // Criar assinatura migrada
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id,
        area,
        plan_type,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        original_expiry_date: periodEnd, // Guardar data original
        is_migrated: true,
        migrated_from,
        migrated_at: now.toISOString(),
        requires_manual_renewal,
        // Campos Stripe vazios (não tem gateway)
        stripe_account: 'br',
        stripe_subscription_id: `migrated_${user_id}_${area}_${Date.now()}`,
        stripe_customer_id: `migrated_${user_id}`,
        stripe_price_id: 'migrated',
        amount: 0, // Valor não aplicável para migrados
        currency: 'brl',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao migrar assinatura:', error)
      return NextResponse.json(
        { error: 'Erro ao migrar assinatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: 'Assinatura migrada com sucesso. Renovação será manual.'
    })
  } catch (error: any) {
    console.error('❌ Erro ao migrar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao migrar assinatura' },
      { status: 500 }
    )
  }
}
```

#### 3.3 API para renovação manual

```typescript
// src/app/api/admin/subscriptions/renew/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/subscriptions/renew
 * Renova assinatura manualmente (para assinaturas migradas)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription_id, new_expires_at, plan_type } = body

    if (!subscription_id || !new_expires_at) {
      return NextResponse.json(
        { error: 'subscription_id e new_expires_at são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar assinatura
    const { data: subscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', subscription_id)
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'Assinatura não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar assinatura
    const updateData: any = {
      current_period_end: new_expires_at,
      updated_at: new Date().toISOString()
    }

    if (plan_type) {
      updateData.plan_type = plan_type
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscription_id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Erro ao renovar assinatura:', updateError)
      return NextResponse.json(
        { error: 'Erro ao renovar assinatura' },
        { status: 500 }
      )
    }

    // Registrar renovação manual (se tabela existir)
    if (subscription.requires_manual_renewal) {
      await supabaseAdmin
        .from('manual_renewals')
        .insert({
          subscription_id,
          user_id: subscription.user_id,
          area: subscription.area,
          renewal_date: new_expires_at,
          status: 'completed',
          notes: 'Renovação manual via admin'
        })
    }

    return NextResponse.json({
      success: true,
      subscription: updated,
      message: 'Assinatura renovada com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao renovar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao renovar assinatura' },
      { status: 500 }
    )
  }
}
```

---

### FASE 4: INTERFACE ADMINISTRATIVA

#### 4.1 Página para gerenciar planos gratuitos e migrações

Criar página em `src/app/admin/subscriptions/page.tsx` com:
- Lista de assinaturas (pagos, gratuitos, migrados)
- Formulário para criar plano gratuito
- Formulário para migrar assinatura
- Lista de assinaturas que precisam renovação manual
- Formulário para renovar manualmente

---

### FASE 5: ATUALIZAR COMPONENTES DE VERIFICAÇÃO

#### 5.1 Atualizar `RequireSubscription` para aceitar plano gratuito

O componente já deve funcionar, mas podemos adicionar indicador visual:

```typescript
// Mostrar badge "Plano Gratuito" ou "Migrado" se aplicável
{subscriptionData?.plan_type === 'free' && (
  <Badge>Plano Gratuito</Badge>
)}
{subscriptionData?.is_migrated && (
  <Badge variant="warning">Migrado - Renovação Manual</Badge>
)}
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Banco de Dados
- [ ] Executar script SQL para adicionar campos na tabela `subscriptions`
- [ ] Criar tabela `manual_renewals` (opcional)
- [ ] Atualizar função SQL `has_active_subscription()`
- [ ] Testar queries com plano gratuito

### Backend (APIs)
- [ ] Criar API `/api/admin/subscriptions/free` (POST)
- [ ] Criar API `/api/admin/subscriptions/migrate` (POST)
- [ ] Criar API `/api/admin/subscriptions/renew` (POST)
- [ ] Atualizar `subscription-helpers.ts` com `hasFreePlan()`
- [ ] Testar todas as APIs

### Frontend
- [ ] Criar página admin `/admin/subscriptions`
- [ ] Formulário para criar plano gratuito
- [ ] Formulário para migrar assinatura
- [ ] Lista de assinaturas que precisam renovação
- [ ] Formulário para renovação manual
- [ ] Atualizar `RequireSubscription` com badges

### Testes
- [ ] Testar criação de plano gratuito
- [ ] Testar migração de assinatura
- [ ] Testar renovação manual
- [ ] Testar verificação de acesso com plano gratuito
- [ ] Testar verificação de acesso com assinatura migrada

---

## 🔄 FLUXO DE MIGRAÇÃO

### Passo a Passo para Migrar Assinaturas

1. **Coletar dados do outro app:**
   - Lista de usuários com email
   - Área (wellness, nutri, coach, nutra)
   - Tipo de plano (monthly, annual)
   - Data de vencimento
   - Nome do app anterior

2. **Preparar CSV/JSON:**
   ```json
   [
     {
       "email": "usuario@example.com",
       "area": "wellness",
       "plan_type": "monthly",
       "expires_at": "2025-12-31T23:59:59Z",
       "migrated_from": "App Anterior"
     }
   ]
   ```

3. **Usar API de migração:**
   - Para cada registro, buscar `user_id` pelo email
   - Chamar `/api/admin/subscriptions/migrate`
   - Verificar sucesso

4. **Verificar migração:**
   - Listar assinaturas migradas
   - Confirmar datas de vencimento
   - Testar acesso do usuário

---

## ⚠️ CONSIDERAÇÕES IMPORTANTES

### Renovação Manual
- Assinaturas migradas **não renovam automaticamente**
- Admin precisa renovar manualmente antes do vencimento
- Criar alerta/notificação para assinaturas próximas do vencimento
- Considerar criar sistema de lembretes automáticos

### Plano Gratuito
- Plano gratuito pode ter data de expiração ou ser permanente
- Se permanente, usar data muito futura (ex: 2099-12-31)
- Considerar limites de uso para plano gratuito (se necessário)

### Segurança
- APIs de admin devem verificar se usuário é admin
- Validar todos os inputs
- Logar todas as ações de migração e renovação

---

## 📊 PRÓXIMOS PASSOS

1. **Revisar e aprovar este plano**
2. **Executar Fase 1 (Banco de Dados)**
3. **Implementar Fase 2 (APIs)**
4. **Criar interface admin (Fase 4)**
5. **Testar tudo**
6. **Migrar assinaturas do outro app**
7. **Criar planos gratuitos para pessoas selecionadas**

---

## 🆘 DÚVIDAS A RESOLVER

1. **Plano gratuito tem data de expiração?** (Sugestão: 1 ano ou permanente)
2. **Quais limites o plano gratuito tem?** (Acesso completo ou limitado?)
3. **Como notificar sobre renovação manual?** (Email, dashboard admin, etc)
4. **Quantas pessoas serão incluídas no plano gratuito?** (Para planejar)
5. **Quantas assinaturas precisam ser migradas?** (Para planejar)

