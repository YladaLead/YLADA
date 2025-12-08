# 🔧 Solução: Érika Cremmer - Assinatura não está sendo reconhecida

**Email:** evsnutrivibe@gmail.com  
**Problema:** Aparece mensagem "Assinatura Necessária" mesmo após criar assinatura paga

---

## 🔍 PROBLEMA IDENTIFICADO

O script SQL anterior estava inserindo o valor como **574.80** (decimal), mas a coluna `amount` na tabela `subscriptions` é do tipo **INTEGER** e espera o valor em **CENTAVOS**.

**Valor correto:** `57480` (centavos) = R$ 574,80

---

## ✅ SOLUÇÃO: Executar SQL Corrigido

Execute este SQL no **Supabase SQL Editor**:

```sql
-- =====================================================
-- CORRIGIR ASSINATURA DA ÉRIKA CREMMER - DEFINITIVO
-- =====================================================

-- Passo 1: Cancelar TODAS as assinaturas antigas
UPDATE subscriptions
SET 
  status = 'canceled',
  canceled_at = NOW(),
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER('evsnutrivibe@gmail.com')
)
AND area = 'wellness';

-- Passo 2: Criar assinatura ANUAL PAGA com valor CORRETO em CENTAVOS
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'wellness',
  'annual',
  'active', -- ✅ Status ATIVO
  NOW(),
  NOW() + INTERVAL '12 months', -- ✅ Válida por 12 meses
  'br',
  'mp_annual_' || u.id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'mp_customer_' || u.id::text,
  'wellness_annual',
  57480, -- ✅ R$ 574,80 em CENTAVOS (574.80 * 100)
  'brl',
  NOW(),
  NOW()
FROM auth.users u
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
ON CONFLICT (user_id, area) 
DO UPDATE SET
  plan_type = 'annual',
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '12 months',
  amount = 57480, -- ✅ CORRIGIDO: em centavos
  currency = 'brl',
  updated_at = NOW();

-- Passo 3: Verificar resultado
SELECT 
  u.email,
  up.nome_completo,
  s.id as subscription_id,
  s.plan_type,
  s.status,
  s.amount,
  s.amount / 100.0 as valor_reais,
  s.current_period_end,
  s.current_period_end > NOW() as nao_expirada,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ASSINATURA VÁLIDA'
    ELSE '❌ PROBLEMA'
  END as resultado
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
JOIN subscriptions s ON u.id = s.user_id
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
  AND s.status = 'active'
ORDER BY s.created_at DESC
LIMIT 1;
```

---

## 📋 O QUE O SQL FAZ

1. **Cancela assinaturas antigas** (se houver)
2. **Cria/Atualiza assinatura** com:
   - Status: `active` ✅
   - Valor: `57480` centavos (R$ 574,80) ✅
   - Válida por: 12 meses ✅
   - Plan Type: `annual` ✅
3. **Verifica resultado** mostrando se está correta

---

## 🧪 APÓS EXECUTAR

1. Aguarde alguns segundos
2. Peça para a Érika **fazer logout e login novamente**
3. Ou **limpar cache do navegador** e recarregar a página

---

## ⚠️ IMPORTANTE

**A coluna `amount` é INTEGER e espera CENTAVOS:**
- ❌ Errado: `574.80` (decimal)
- ✅ Correto: `57480` (integer - centavos)

**Critérios para assinatura ser reconhecida:**
- ✅ `status = 'active'`
- ✅ `current_period_end > NOW()` (não expirada)
- ✅ `amount > 0` (tem valor)

---

**Arquivo do script:** `scripts/corrigir-assinatura-erika-cremmer-definitivo.sql`
