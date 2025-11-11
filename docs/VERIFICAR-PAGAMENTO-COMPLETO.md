# 🔍 Verificação Completa Após Pagamento

## 📋 O QUE VERIFICAR

Após um pagamento, precisamos verificar:
1. ✅ Se o webhook foi chamado pelo Mercado Pago
2. ✅ Se o usuário foi criado no Supabase
3. ✅ Se a subscription foi criada
4. ✅ Se o e-mail foi enviado
5. ✅ Se o e-mail foi marcado como enviado

---

## 1️⃣ VERIFICAR NO SUPABASE

### **Query 1: Verificar Usuário Criado**

Execute no **Supabase SQL Editor**:

```sql
-- Verificar usuário pelo e-mail
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
WHERE u.email = 'meuportalfitbr@gmail.com'  -- ⚠️ SUBSTITUA PELO E-MAIL DO PAGAMENTO
ORDER BY u.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `user_id` existe? (usuário foi criado)
- ✅ `email` está correto?
- ✅ `profile_id` existe? (perfil foi criado)
- ✅ `created_at` é recente? (foi criado hoje)

---

### **Query 2: Verificar Subscription Criada**

```sql
-- Verificar subscription pelo e-mail do usuário
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
WHERE up.email = 'meuportalfitbr@gmail.com'  -- ⚠️ SUBSTITUA PELO E-MAIL DO PAGAMENTO
ORDER BY s.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `subscription_id` existe? (subscription foi criada)
- ✅ `status` é `'active'`? (pagamento foi processado)
- ✅ `welcome_email_sent` é `true`? (e-mail foi enviado)
- ✅ `welcome_email_sent_at` tem data? (quando foi enviado)
- ✅ `amount` está correto? (valor do pagamento)

---

### **Query 3: Verificar Pagamento Registrado**

```sql
-- Verificar pagamento registrado
SELECT 
  p.id as payment_id,
  p.subscription_id,
  p.user_id,
  p.amount,
  p.currency,
  p.status,
  p.payment_method,
  p.created_at,
  s.area,
  s.plan_type,
  up.email
FROM payments p
JOIN subscriptions s ON p.subscription_id = s.id
JOIN user_profiles up ON p.user_id = up.user_id
WHERE up.email = 'meuportalfitbr@gmail.com'  -- ⚠️ SUBSTITUA PELO E-MAIL DO PAGAMENTO
ORDER BY p.created_at DESC
LIMIT 5;
```

**O que verificar:**
- ✅ `payment_id` existe? (pagamento foi registrado)
- ✅ `status` é `'succeeded'`? (pagamento foi aprovado)
- ✅ `amount` está correto?

---

### **Query 4: Verificar Subscriptions Recentes (Últimas 24h)**

```sql
-- Verificar todas as subscriptions criadas nas últimas 24 horas
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.created_at,
  up.email,
  up.nome_completo,
  CASE 
    WHEN s.welcome_email_sent = true THEN '✅ E-mail enviado'
    WHEN s.welcome_email_sent = false THEN '❌ E-mail NÃO enviado'
    ELSE '⚠️ Status desconhecido'
  END as email_status
FROM subscriptions s
LEFT JOIN user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;
```

**O que verificar:**
- ✅ Quantas subscriptions foram criadas?
- ✅ Quantas têm `welcome_email_sent = false`?
- ✅ Quais e-mails estão salvos?

---

## 2️⃣ VERIFICAR LOGS DO WEBHOOK NO VERCEL

1. **Acesse:** https://vercel.com/dashboard
2. **Seu projeto** → **Deployments** → **Último deploy**
3. **Functions** → `/api/webhooks/mercado-pago`
4. **Procure por logs recentes** (últimas 2 horas)

**O que procurar:**
- `📥 Webhook Mercado Pago recebido:`
- `💳 Processando pagamento:`
- `📧 VERIFICAÇÃO DE ENVIO DE E-MAIL`
- `📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO`
- `📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅`
- `❌ ❌ ❌ ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ❌ ❌ ❌`

**Me envie os logs que aparecerem!**

---

## 3️⃣ VERIFICAR NO RESEND DASHBOARD

1. **Acesse:** https://resend.com/emails
2. **Procure por e-mails enviados** para o e-mail do pagamento
3. **Verifique o status:**
   - ✅ **Delivered** = E-mail entregue
   - ❌ **Bounced** = E-mail rejeitado (endereço inválido)
   - ⏳ **Pending** = E-mail na fila
   - ❌ **Failed** = Erro ao enviar

**O que verificar:**
- ✅ E-mail aparece na lista?
- ✅ Qual o status do e-mail?
- ✅ Quando foi enviado?

---

## 4️⃣ VERIFICAR NO MERCADO PAGO

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
2. **Vá em "Webhooks" ou "Notificações"**
3. **Veja o histórico de notificações**

**O que verificar:**
- ✅ Há tentativas de notificação para o pagamento?
- ✅ Status: Sucesso (200) ou Falha (500, 404)?
- ✅ Quando foi a última tentativa?

---

## 📊 INTERPRETAÇÃO DOS RESULTADOS

### ✅ **Cenário 1: Tudo OK**

- ✅ Usuário criado no Supabase
- ✅ Subscription criada com `status = 'active'`
- ✅ `welcome_email_sent = true`
- ✅ E-mail aparece no Resend como "Delivered"

**Significado:** Tudo funcionou! O e-mail pode estar na caixa de spam.

---

### ❌ **Cenário 2: Usuário Criado, Mas E-mail Não Enviado**

- ✅ Usuário criado no Supabase
- ✅ Subscription criada
- ❌ `welcome_email_sent = false`
- ❌ E-mail não aparece no Resend

**Possíveis causas:**
- Erro ao enviar e-mail (ver logs do webhook)
- Resend não configurado corretamente
- E-mail inválido

**Solução:** Verificar logs do webhook para ver o erro específico.

---

### ❌ **Cenário 3: Webhook Não Foi Chamado**

- ❌ Usuário não criado
- ❌ Subscription não criada
- ❌ Nenhum log no Vercel

**Possíveis causas:**
- Webhook não configurado no Mercado Pago
- URL do webhook incorreta
- Mercado Pago não conseguiu enviar notificação

**Solução:** Verificar configuração do webhook no Mercado Pago.

---

### ❌ **Cenário 4: Webhook Foi Chamado, Mas Erro**

- ❌ Usuário não criado (ou criado parcialmente)
- ❌ Subscription não criada
- ✅ Logs aparecem no Vercel com erro

**Possíveis causas:**
- Erro na criação do usuário
- Erro na criação da subscription
- Erro na API do Mercado Pago

**Solução:** Verificar logs do webhook para ver o erro específico.

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

- [ ] Executei Query 1 (verificar usuário)
- [ ] Executei Query 2 (verificar subscription)
- [ ] Executei Query 3 (verificar pagamento)
- [ ] Executei Query 4 (subscriptions recentes)
- [ ] Verifiquei logs do webhook no Vercel
- [ ] Verifiquei no Resend Dashboard
- [ ] Verifiquei no Mercado Pago Dashboard
- [ ] Anotei os resultados para análise

---

## 📝 DADOS NECESSÁRIOS PARA DEBUG

**Me envie:**
1. ✅ Resultado das queries SQL acima
2. ✅ Screenshot dos logs do webhook no Vercel
3. ✅ Screenshot do Resend Dashboard
4. ✅ E-mail usado no pagamento
5. ✅ Data/hora aproximada do pagamento

---

**Última atualização:** 11/11/2025

