# 🧪 CRIAR CONTA DE TESTE PARA CANCELAMENTO

## 🎯 Objetivo
Criar uma conta nova com assinatura ativa para testar o sistema de retenção de cancelamento.

---

## 📋 OPÇÃO 1: Criar via Admin (Mais Rápido)

### Passos:
1. Acesse: `/admin/usuarios` (ou `/admin/subscriptions`)
2. Crie um usuário novo ou use um existente
3. Crie uma assinatura ativa para esse usuário
4. Faça login com essa conta
5. Teste o cancelamento

---

## 📋 OPÇÃO 2: Criar Manualmente no Banco (SQL)

### 1. Criar usuário de teste

```sql
-- Criar usuário de teste (ajuste email e senha)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste-cancelamento@ylada.com', -- ⚠️ Mude este email
  crypt('senha123', gen_salt('bf')), -- ⚠️ Mude esta senha
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  ''
)
RETURNING id, email;
```

### 2. Criar perfil do usuário

```sql
-- Substitua USER_ID pelo ID retornado acima
INSERT INTO user_profiles (
  user_id,
  email,
  nome_completo,
  area_preferida
)
VALUES (
  'USER_ID_AQUI', -- ⚠️ Cole o ID do passo 1
  'teste-cancelamento@ylada.com',
  'Usuário Teste Cancelamento',
  'nutri'
);
```

### 3. Criar assinatura ativa

```sql
-- Criar assinatura ativa para teste
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  gateway,
  gateway_subscription_id,
  gateway_customer_id,
  amount,
  currency,
  status,
  current_period_start,
  current_period_end
)
VALUES (
  'USER_ID_AQUI', -- ⚠️ Mesmo ID do passo 1
  'nutri',
  'monthly',
  'mercadopago', -- ou 'stripe'
  'test-subscription-' || gen_random_uuid()::text,
  'test-customer-' || gen_random_uuid()::text,
  5990, -- R$ 59,90 em centavos
  'brl',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days' -- Válida por 30 dias
)
RETURNING id, user_id, status;
```

---

## 📋 OPÇÃO 3: Usar Conta Existente (Mais Fácil)

Se você já tem uma conta com assinatura:
1. Faça login
2. Vá em **Configurações** → **Minha Assinatura**
3. Teste o cancelamento
4. **Importante:** Se aceitar a retenção, a assinatura continua ativa
5. Se cancelar, pode recriar depois se precisar

---

## ✅ VERIFICAR SE FUNCIONOU

```sql
-- Verificar usuário criado
SELECT id, email FROM auth.users 
WHERE email = 'teste-cancelamento@ylada.com';

-- Verificar assinatura criada
SELECT id, user_id, status, current_period_end 
FROM subscriptions 
WHERE user_id = 'USER_ID_AQUI';
```

---

## 🧪 TESTAR CANCELAMENTO

1. **Login** com a conta criada
2. Vá em **Configurações** → **Minha Assinatura**
3. Clique em **"Cancelar Assinatura"**
4. Selecione um motivo
5. Veja a oferta de retenção
6. Teste aceitar ou rejeitar

---

## 🗑️ LIMPAR DEPOIS DO TESTE (Opcional)

```sql
-- Deletar assinatura de teste
DELETE FROM subscriptions WHERE user_id = 'USER_ID_AQUI';

-- Deletar perfil
DELETE FROM user_profiles WHERE user_id = 'USER_ID_AQUI';

-- Deletar usuário (cuidado!)
DELETE FROM auth.users WHERE id = 'USER_ID_AQUI';
```

---

**Dica:** Use a **Opção 3** (conta existente) se possível - é mais rápido! 😊

