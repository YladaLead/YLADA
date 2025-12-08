# 🔧 Criar Conta Érika Cremmer - Passo a Passo

**Email:** evsnutrivibe@gmail.com  
**Nome:** Érika Cremmer  
**Plano:** Anual PAGO (12x de R$ 47,90 = R$ 574,80 total)

---

## ✅ SOLUÇÃO EM 2 ETAPAS

### ETAPA 1: Criar a Conta (Escolha UMA opção)

#### **OPÇÃO A: Via Interface Admin (MAIS FÁCIL - 2 minutos)**

1. Acesse: `/admin/subscriptions`
2. Na seção **"Criar Plano Gratuito"** (card azul):
   - **Email:** `evsnutrivibe@gmail.com`
   - **Nome:** `Érika Cremmer`
   - **Área:** `wellness`
   - **Dias de validade:** `365` (temporário, vamos mudar depois)
3. Clique em **"Criar Plano Gratuito"**

✅ Isso cria a conta e perfil dela automaticamente.

---

#### **OPÇÃO B: Via Supabase Dashboard (Alternativa)**

1. Acesse: https://supabase.com/dashboard
2. Vá em: **Authentication** > **Users**
3. Clique em **"Add User"**
4. Preencha:
   - **Email:** `evsnutrivibe@gmail.com`
   - **Password:** [Defina uma senha temporária]
   - **Auto Confirm User:** ✅ **MARCAR**
5. Clique em **"Create User"**

Depois, execute este SQL para criar o perfil:

```sql
-- Criar perfil para Érika
INSERT INTO user_profiles (
  user_id,
  nome_completo,
  email,
  perfil,
  created_at,
  updated_at
)
SELECT 
  id,
  'Érika Cremmer',
  'evsnutrivibe@gmail.com',
  'wellness',
  NOW(),
  NOW()
FROM auth.users
WHERE LOWER(email) = LOWER('evsnutrivibe@gmail.com')
ON CONFLICT (user_id) DO UPDATE
SET 
  nome_completo = 'Érika Cremmer',
  perfil = 'wellness',
  updated_at = NOW();
```

---

### ETAPA 2: Converter para Assinatura PAGA (SQL)

**Após criar a conta na Etapa 1**, execute este SQL no **Supabase SQL Editor**:

```sql
-- =====================================================
-- CONVERTER ASSINATURA PARA PAGA - ÉRIKA CREMMER
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
  v_email TEXT := 'evsnutrivibe@gmail.com';
  v_area TEXT := 'wellness';
  v_plan_type TEXT := 'annual';
  v_amount DECIMAL := 574.80; -- Total anual (12x de R$ 47,90)
  v_period_start TIMESTAMP WITH TIME ZONE := NOW();
  v_period_end TIMESTAMP WITH TIME ZONE := NOW() + INTERVAL '12 months';
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado. Execute a Etapa 1 primeiro!';
  END IF;

  -- Cancelar assinatura gratuita (se houver)
  UPDATE subscriptions
  SET 
    status = 'canceled',
    canceled_at = NOW(),
    updated_at = NOW()
  WHERE user_id = v_user_id
    AND area = v_area
    AND status = 'active';

  -- Criar assinatura ANUAL PAGA
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
  ) VALUES (
    v_user_id,
    v_area,
    v_plan_type,
    'active',
    v_period_start,
    v_period_end,
    'br',
    'mp_annual_' || v_user_id::text || '_' || EXTRACT(EPOCH FROM NOW())::bigint,
    'mp_customer_' || v_user_id::text,
    'wellness_annual',
    v_amount,
    'brl',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_subscription_id;

  RAISE NOTICE '✅ Assinatura ANUAL PAGA criada: %', v_subscription_id;
  RAISE NOTICE '✅ Valor: R$ %', v_amount;
  RAISE NOTICE '✅ Válida até: %', v_period_end;
END $$;

-- Verificar resultado
SELECT 
  u.email,
  up.nome_completo,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.current_period_end
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

## 📋 RESUMO RÁPIDO

1. ✅ **Criar conta:** `/admin/subscriptions` → Preencher → "Criar Plano Gratuito"
2. ✅ **Executar SQL:** Copiar SQL acima → Supabase SQL Editor → Executar
3. ✅ **Verificar:** A query final mostra o resultado

---

## ✅ RESULTADO ESPERADO

Após executar, você deve ver:
- `plan_type: annual`
- `amount: 574.80`
- `status: active`
- `current_period_end: [data 12 meses no futuro]`

---

## 🔐 LOGIN

Após criar:
- **Email:** `evsnutrivibe@gmail.com`
- **Senha:** Ela vai receber por email ou pode usar recuperação de senha

---

## 💰 SOBRE O PAGAMENTO

O pagamento que ela fez no Mercado Pago (R$ 574,80) será registrado quando:
- O webhook do Mercado Pago processar
- Ou você pode vincular manualmente depois

A assinatura criada pelo SQL já dá acesso completo por 12 meses, independente do webhook.
