# 🔍 Guia Técnico: Verificar Acesso da Monica Após Pagamento

## 📋 Informações Necessárias da Monica

Antes de verificar, peça à Monica:
1. **E-mail usado no pagamento**
2. **Data e hora aproximada do pagamento**
3. **Valor pago**
4. **Área comprada** (Nutri/Coach/Wellness)
5. **Comprovante do Mercado Pago** (se possível)

---

## 🔍 VERIFICAÇÃO 1: Usuário Foi Criado?

Execute no **Supabase SQL Editor**:

```sql
-- Substitua 'email@exemplo.com' pelo e-mail da Monica
SELECT 
  u.id as user_id,
  u.email,
  u.created_at as user_created_at,
  u.email_confirmed_at,
  up.id as profile_id,
  up.nome_completo,
  up.perfil,
  up.created_at as profile_created_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE LOWER(u.email) = LOWER('email@exemplo.com')  -- ⚠️ SUBSTITUIR
ORDER BY u.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `user_id` existe? → Usuário foi criado
- ✅ `email` está correto? → E-mail correto
- ✅ `profile_id` existe? → Perfil foi criado
- ✅ `created_at` é recente? → Foi criado após o pagamento

**Se não encontrar:**
- O webhook pode não ter processado o pagamento
- O e-mail usado no pagamento pode ser diferente
- Verificar logs do webhook no Vercel

---

## 🔍 VERIFICAÇÃO 2: Subscription Foi Criada?

```sql
-- Substitua 'email@exemplo.com' pelo e-mail da Monica
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.amount,
  s.currency,
  s.current_period_start,
  s.current_period_end,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.created_at,
  up.email,
  up.nome_completo
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('email@exemplo.com')  -- ⚠️ SUBSTITUIR
ORDER BY s.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `subscription_id` existe? → Subscription foi criada
- ✅ `status` é `'active'`? → Pagamento foi processado
- ✅ `welcome_email_sent` é `true`? → E-mail foi enviado
- ✅ `amount` está correto? → Valor do pagamento

**Se `status` não for `'active'`:**
- Pagamento pode estar pendente
- Verificar status no Mercado Pago

---

## 🔍 VERIFICAÇÃO 3: Pagamento Foi Registrado?

```sql
-- Substitua 'email@exemplo.com' pelo e-mail da Monica
SELECT 
  p.id as payment_id,
  p.subscription_id,
  p.user_id,
  p.amount,
  p.currency,
  p.status,
  p.mercado_pago_payment_id,
  p.created_at,
  up.email
FROM payments p
JOIN user_profiles up ON p.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('email@exemplo.com')  -- ⚠️ SUBSTITUIR
ORDER BY p.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `payment_id` existe? → Pagamento foi registrado
- ✅ `status` é `'succeeded'`? → Pagamento foi aprovado
- ✅ `mercado_pago_payment_id` existe? → ID do Mercado Pago

---

## 🔍 VERIFICAÇÃO 4: E-mail Foi Enviado?

### Verificar no Resend:
1. Acesse: https://resend.com/emails
2. Procure por e-mails enviados para o e-mail da Monica
3. Verifique se há e-mails de boas-vindas

### Verificar no Banco:
```sql
-- Verificar se welcome_email_sent está marcado
SELECT 
  s.id,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.user_email,
  up.email as profile_email
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('email@exemplo.com')  -- ⚠️ SUBSTITUIR
ORDER BY s.created_at DESC
LIMIT 1;
```

---

## 🛠️ SOLUÇÕES COMUNS

### **Problema 1: Usuário não foi criado**

**Solução:**
1. Verificar logs do webhook no Vercel
2. Verificar se o pagamento foi aprovado no Mercado Pago
3. Criar usuário manualmente se necessário:

```sql
-- Criar usuário manualmente (via Supabase Dashboard é mais seguro)
-- Ou usar API: POST /api/admin/create-support-user
```

### **Problema 2: Subscription não foi criada**

**Solução:**
1. Verificar se o webhook foi chamado
2. Verificar logs do webhook
3. Criar subscription manualmente:

```sql
-- Primeiro, obter o user_id
SELECT id FROM auth.users WHERE email = 'email@exemplo.com';

-- Depois, criar subscription (substitua os valores)
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  amount,
  currency,
  current_period_start,
  current_period_end,
  mercado_pago_payment_id
) VALUES (
  'user_id_aqui',  -- ⚠️ SUBSTITUIR
  'nutri',  -- ou 'coach' ou 'wellness'
  'monthly',  -- ou 'annual'
  'active',
  9700,  -- valor em centavos (R$ 97,00 = 9700)
  'BRL',
  NOW(),
  NOW() + INTERVAL '1 month',  -- ou '12 months' para anual
  'payment_id_do_mercado_pago'  -- se tiver
);
```

### **Problema 3: E-mail não foi enviado**

**Solução:**
1. Verificar se `RESEND_API_KEY` está configurada
2. Reenviar e-mail manualmente:

```sql
-- Marcar como não enviado
UPDATE subscriptions
SET welcome_email_sent = false,
    welcome_email_sent_at = NULL
WHERE user_id = 'user_id_aqui';  -- ⚠️ SUBSTITUIR

-- Depois, chamar a API para reenviar
-- POST /api/email/send-welcome?userId=user_id_aqui
```

Ou usar o script de reenvio de e-mail.

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Execute as queries acima
2. ✅ Identifique qual é o problema
3. ✅ Aplique a solução correspondente
4. ✅ Informe à Monica que o acesso foi liberado
5. ✅ Envie instruções de login para ela

---

**Última atualização:** 2025-01-XX


