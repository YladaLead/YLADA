# 🔧 GUIA: Resolver Problema de Login Após Pagamento

## 📋 SITUAÇÃO
Usuário fez pagamento mas não consegue fazer login ou acessar a plataforma.

---

## 🔍 PASSO 1: IDENTIFICAR O USUÁRIO

### 1.1 Executar Script de Verificação

Execute o script SQL criado para verificar o status completo do usuário:

```bash
# Arquivo: scripts/verificar-usuario-marcia-andreazzi-completo.sql
```

**O que verificar:**
- ✅ Usuário existe em `auth.users`?
- ✅ Email foi confirmado (`email_confirmed_at` não é NULL)?
- ✅ Perfil foi criado em `user_profiles`?
- ✅ Assinatura foi criada em `subscriptions`?
- ✅ Status da assinatura é `'active'`?
- ✅ Data de expiração (`current_period_end`) é futura?

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### ❌ PROBLEMA 1: Email Não Confirmado

**Sintoma:**
- Usuário existe em `auth.users`
- `email_confirmed_at` é NULL
- Usuário não consegue fazer login

**Solução:**
```sql
-- Confirmar email manualmente
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'email@exemplo.com';
```

---

### ❌ PROBLEMA 2: Perfil Não Criado

**Sintoma:**
- Usuário existe em `auth.users`
- Não existe registro em `user_profiles`
- Sistema não consegue verificar perfil

**Solução:**
```sql
-- Criar perfil manualmente
INSERT INTO user_profiles (user_id, email, nome_completo, perfil)
SELECT 
  id,
  email,
  'Nome Completo', -- ⚠️ SUBSTITUIR
  'nutri' -- ⚠️ SUBSTITUIR: 'nutri', 'wellness', 'coach', 'nutra'
FROM auth.users
WHERE email = 'email@exemplo.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
  );
```

---

### ❌ PROBLEMA 3: Assinatura Não Criada

**Sintoma:**
- Pagamento foi processado (`payments` tem registro)
- Mas não existe `subscription` correspondente
- Usuário não tem acesso

**Solução:**
```sql
-- 1. Verificar pagamento
SELECT * FROM payments
WHERE user_id = 'user-id-aqui'
ORDER BY created_at DESC
LIMIT 1;

-- 2. Criar assinatura manualmente
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
VALUES (
  'user-id-aqui', -- ⚠️ SUBSTITUIR
  'nutri', -- ⚠️ SUBSTITUIR: 'nutri', 'wellness', 'coach', 'nutra'
  'annual', -- ⚠️ SUBSTITUIR: 'monthly' ou 'annual'
  'br', -- ⚠️ SUBSTITUIR: 'br' ou 'us'
  'manual_' || gen_random_uuid()::text,
  'manual_customer_' || gen_random_uuid()::text,
  'manual_price',
  57000, -- ⚠️ SUBSTITUIR: valor em centavos (R$ 570,00 = 57000)
  'brl', -- ⚠️ SUBSTITUIR: 'brl' ou 'usd'
  'active',
  NOW(),
  NOW() + INTERVAL '12 months', -- ⚠️ Ajustar conforme necessário
  false
);
```

---

### ❌ PROBLEMA 4: Assinatura Inativa ou Expirada

**Sintoma:**
- Assinatura existe mas `status != 'active'`
- Ou `current_period_end < NOW()`

**Solução:**
```sql
-- Ativar assinatura
UPDATE subscriptions
SET 
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '12 months', -- ⚠️ Ajustar conforme necessário
  updated_at = NOW()
WHERE user_id = 'user-id-aqui'
  AND area = 'nutri'; -- ⚠️ SUBSTITUIR
```

---

### ❌ PROBLEMA 5: Webhook Não Foi Processado

**Sintoma:**
- Pagamento foi feito no gateway (Stripe/Mercado Pago)
- Mas webhook não foi recebido ou processado
- Assinatura não foi criada automaticamente

**Solução:**

1. **Verificar logs do webhook:**
   - Verificar logs do servidor para ver se webhook foi recebido
   - Verificar se houve erros no processamento

2. **Processar webhook manualmente (se necessário):**
   - Acessar painel do gateway (Stripe/Mercado Pago)
   - Reenviar webhook ou processar manualmente

3. **Criar assinatura manualmente** (usar solução do Problema 3)

---

### ❌ PROBLEMA 6: Usuário Deletado (Soft Delete)

**Sintoma:**
- Usuário existe mas `deleted_at IS NOT NULL`
- Usuário não consegue fazer login

**Solução:**
```sql
-- Restaurar usuário
UPDATE auth.users
SET deleted_at = NULL
WHERE email = 'email@exemplo.com'
  AND deleted_at IS NOT NULL;
```

---

## 🔄 FLUXO COMPLETO DE VERIFICAÇÃO

### Checklist de Diagnóstico:

1. ✅ **Usuário existe?**
   ```sql
   SELECT * FROM auth.users WHERE email = 'email@exemplo.com';
   ```

2. ✅ **Email confirmado?**
   ```sql
   SELECT email_confirmed_at FROM auth.users WHERE email = 'email@exemplo.com';
   ```

3. ✅ **Perfil criado?**
   ```sql
   SELECT * FROM user_profiles WHERE email = 'email@exemplo.com';
   ```

4. ✅ **Assinatura criada?**
   ```sql
   SELECT * FROM subscriptions s
   JOIN auth.users au ON au.id = s.user_id
   WHERE au.email = 'email@exemplo.com';
   ```

5. ✅ **Assinatura ativa?**
   ```sql
   SELECT status, current_period_end FROM subscriptions s
   JOIN auth.users au ON au.id = s.user_id
   WHERE au.email = 'email@exemplo.com'
     AND s.status = 'active'
     AND s.current_period_end > NOW();
   ```

6. ✅ **Pagamento registrado?**
   ```sql
   SELECT * FROM payments p
   JOIN auth.users au ON au.id = p.user_id
   WHERE au.email = 'email@exemplo.com'
   ORDER BY p.created_at DESC;
   ```

---

## 🚀 SCRIPT DE CORREÇÃO COMPLETA

Se o usuário fez pagamento mas não tem acesso, execute este script:

```sql
-- =====================================================
-- CORREÇÃO COMPLETA: Ativar Acesso Após Pagamento
-- =====================================================

-- 1. Confirmar email (se necessário)
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'email@exemplo.com'; -- ⚠️ SUBSTITUIR

-- 2. Criar perfil (se não existir)
INSERT INTO user_profiles (user_id, email, nome_completo, perfil)
SELECT 
  id,
  email,
  'Nome Completo', -- ⚠️ SUBSTITUIR
  'nutri' -- ⚠️ SUBSTITUIR
FROM auth.users
WHERE email = 'email@exemplo.com' -- ⚠️ SUBSTITUIR
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
  );

-- 3. Ativar ou criar assinatura
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
BEGIN
  -- Obter user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'email@exemplo.com'; -- ⚠️ SUBSTITUIR

  -- Verificar se já existe assinatura
  SELECT id INTO v_subscription_id
  FROM subscriptions
  WHERE user_id = v_user_id
    AND area = 'nutri' -- ⚠️ SUBSTITUIR
  LIMIT 1;

  IF v_subscription_id IS NULL THEN
    -- Criar nova assinatura
    INSERT INTO subscriptions (
      user_id,
      area,
      plan_type,
      stripe_account,
      stripe_subscription_id,
      stripe_customer_id,
      stripe_price_id,
      amount,
      currency,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end
    )
    VALUES (
      v_user_id,
      'nutri', -- ⚠️ SUBSTITUIR
      'annual', -- ⚠️ SUBSTITUIR
      'br', -- ⚠️ SUBSTITUIR
      'manual_' || gen_random_uuid()::text,
      'manual_customer_' || gen_random_uuid()::text,
      'manual_price',
      57000, -- ⚠️ SUBSTITUIR: valor em centavos
      'brl', -- ⚠️ SUBSTITUIR
      'active',
      NOW(),
      NOW() + INTERVAL '12 months',
      false
    );
  ELSE
    -- Ativar assinatura existente
    UPDATE subscriptions
    SET 
      status = 'active',
      current_period_start = NOW(),
      current_period_end = NOW() + INTERVAL '12 months',
      updated_at = NOW()
    WHERE id = v_subscription_id;
  END IF;
END $$;
```

---

## 📞 PRÓXIMOS PASSOS

Após aplicar as correções:

1. ✅ **Testar login do usuário**
2. ✅ **Verificar acesso ao dashboard**
3. ✅ **Confirmar que assinatura está ativa**
4. ✅ **Enviar email de boas-vindas** (se necessário)

---

## ⚠️ NOTAS IMPORTANTES

- **Sempre verificar** antes de fazer alterações
- **Fazer backup** antes de executar scripts de correção
- **Documentar** o que foi feito para referência futura
- **Comunicar** ao usuário após resolver o problema
