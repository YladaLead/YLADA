# 🔍 Verificar Por Que E-mail Não Está Sendo Enviado

## 📋 Checklist de Verificação

### 1. Verificar Logs do Webhook no Vercel

**Acesse:** Vercel → Functions → Logs

**Procure por logs que começam com:**
- `📥 Webhook Mercado Pago recebido:`
- `💳 Processando pagamento:`
- `📧 Tentando capturar e-mail do pagador:`
- `📋 User ID extraído do external_reference:`
- `🆕 Criando usuário automaticamente após pagamento:`
- `✅ E-mail de boas-vindas enviado para novo usuário:`
- `❌ Erro ao enviar e-mail de boas-vindas:`

**Me envie TODOS os logs que aparecerem relacionados ao webhook!**

---

### 2. Verificar no Mercado Pago

**Acesse:** https://www.mercadopago.com.br/developers/panel/app/[SEU_APP_ID]/webhooks

**Verifique:**
- ✅ Webhooks estão sendo entregues (status 200)
- ✅ Eventos configurados: `payment.created`, `payment.updated`
- ✅ URL configurada: `https://www.ylada.com/api/webhooks/mercado-pago`

**Clique em "Detalhe" (seta) de um webhook recente e me envie:**
- O que aparece no "Request" (corpo da requisição)
- Especialmente os campos: `payer`, `payer_email`, `metadata`, `external_reference`

---

### 3. Verificar no Resend

**Acesse:** https://resend.com/emails

**Verifique:**
- Se há algum e-mail enviado para `oanfaol@gmail.com`
- Se há algum erro registrado

---

### 4. Verificar no Banco de Dados (Supabase)

Execute estas queries no Supabase SQL Editor:

```sql
-- Verificar se o usuário foi criado
SELECT id, email, nome_completo, created_at 
FROM user_profiles 
WHERE email = 'oanfaol@gmail.com'
ORDER BY created_at DESC;

-- Verificar se a subscription foi criada
SELECT s.*, up.email, up.nome_completo
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.email = 'oanfaol@gmail.com'
ORDER BY s.created_at DESC;

-- Verificar se o e-mail foi marcado como enviado
SELECT welcome_email_sent, welcome_email_sent_at, user_email, created_at
FROM subscriptions
WHERE user_id IN (
  SELECT id FROM user_profiles WHERE email = 'oanfaol@gmail.com'
)
ORDER BY created_at DESC
LIMIT 1;

-- Verificar últimos pagamentos processados
SELECT p.*, up.email
FROM payments p
JOIN subscriptions s ON p.subscription_id = s.id
JOIN user_profiles up ON s.user_id = up.id
WHERE up.email = 'oanfaol@gmail.com'
ORDER BY p.created_at DESC
LIMIT 5;
```

---

## 🎯 O Que Verificar Especificamente

### Problema 1: Webhook não está processando

**Sintomas:**
- Webhook chega (status 200 no Mercado Pago)
- Mas não aparecem logs no Vercel

**Solução:**
- Verificar se a URL do webhook está correta
- Verificar se o webhook está sendo chamado (ver logs do Vercel)

### Problema 2: E-mail não está sendo capturado

**Sintomas:**
- Webhook processa, mas `payerEmail` é `null`

**Solução:**
- Verificar o corpo do webhook no Mercado Pago
- Ver se o e-mail está em `payer.email` ou `payer_email`

### Problema 3: User ID não está sendo encontrado

**Sintomas:**
- Log mostra: `❌ User ID não encontrado no metadata do pagamento`

**Solução:**
- Verificar se `external_reference` está sendo enviado
- Verificar se o formato está correto: `area_planType_userId`

---

## 📧 Próximos Passos

1. **Me envie os logs do Vercel** relacionados ao webhook
2. **Me envie o "Detalhe" de um webhook** do Mercado Pago (clique na seta)
3. **Execute as queries SQL** e me diga o resultado
4. **Verifique no Resend** se há algum e-mail

Com essas informações, vou conseguir identificar exatamente onde está o problema!

