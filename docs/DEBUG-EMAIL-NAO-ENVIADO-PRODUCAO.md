# 🔍 Debug: E-mail Não Enviado Após Pagamento (Produção)

## 📋 Problema Reportado

- ✅ Pagamentos estão acontecendo em produção
- ❌ E-mails de confirmação **NÃO** estão sendo enviados
- ❌ E-mails não aparecem no Resend
- ✅ Dados aparecem no Supabase (usuários/subscriptions criados)

---

## 🔍 PASSO A PASSO PARA DEBUG

### 1. Verificar Logs do Webhook no Vercel

**Onde verificar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Vá em **Deployments** → Último deploy
4. Clique em **Functions** → `/api/webhooks/mercado-pago`
5. Procure por logs que começam com `📧`

**O que procurar:**
- `📧 VERIFICAÇÃO DE ENVIO DE E-MAIL`
- `📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO`
- `📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅`
- `❌ ❌ ❌ ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ❌ ❌ ❌`

**Me envie os logs que aparecerem!**

---

### 2. Verificar Diagnóstico do Sistema

**Endpoint de diagnóstico criado:**
```
https://www.ylada.com/api/webhooks/mercado-pago/diagnostico
```

**Para testar envio de e-mail também:**
```
https://www.ylada.com/api/webhooks/mercado-pago/diagnostico?testEmail=seu@email.com
```

**O que verificar no diagnóstico:**
- ✅ `resendApiKey.exists` deve ser `true`
- ✅ `resendConfigured` deve ser `true`
- ✅ `resendClient.exists` deve ser `true`
- ✅ `emailConfig.fromEmail` deve ser `noreply@ylada.com`
- ✅ Verificar `recentSubscriptions` para ver se há subscriptions sem e-mail enviado

**Me envie o resultado do diagnóstico!**

---

### 3. Verificar Variáveis de Ambiente no Vercel

**Onde verificar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Vá em **Settings** → **Environment Variables**
4. Procure por: `RESEND_API_KEY`

**O que verificar:**
- ✅ `RESEND_API_KEY` existe?
- ✅ Valor começa com `re_`?
- ✅ Ambiente selecionado: **Production** (e Preview/Development se necessário)
- ✅ Após adicionar/atualizar, fez **redeploy**?

**Se não estiver configurada:**
1. Adicione a variável `RESEND_API_KEY`
2. Valor: Sua API Key do Resend (começa com `re_`)
3. Ambiente: **Production**, **Preview**, **Development**
4. Clique em **Save**
5. Faça **redeploy** da aplicação

---

### 4. Verificar no Resend Dashboard

**Onde verificar:**
1. Acesse: https://resend.com/emails
2. Procure por e-mails enviados para os e-mails dos pagamentos
3. Verifique o status: "Delivered", "Bounced", "Pending", etc.

**O que verificar:**
- ✅ E-mails aparecem na lista?
- ✅ Qual o status dos e-mails?
- ✅ Há erros ou bounces?

---

### 5. Verificar no Banco de Dados (Supabase)

**Execute no Supabase SQL Editor:**

```sql
-- Verificar subscriptions recentes sem e-mail enviado
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.welcome_email_sent,
  s.welcome_email_sent_at,
  s.created_at,
  up.email,
  up.nome_completo
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE s.created_at >= NOW() - INTERVAL '7 days'
ORDER BY s.created_at DESC
LIMIT 10;
```

**O que verificar:**
- ✅ Quantas subscriptions foram criadas?
- ✅ Quantas têm `welcome_email_sent = false`?
- ✅ Quais e-mails estão salvos?

---

### 6. Verificar E-mail do Pagador no Webhook

**O problema pode ser:**
- E-mail do pagador não está sendo capturado corretamente do webhook do Mercado Pago
- E-mail está vindo em formato diferente

**Como verificar:**
- Ver logs do webhook procurando por: `📧 Tentando capturar e-mail do pagador:`
- Verificar se `payerEmail final` está preenchido

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

- [ ] Logs do webhook verificados
- [ ] Diagnóstico executado (`/api/webhooks/mercado-pago/diagnostico`)
- [ ] `RESEND_API_KEY` configurada no Vercel
- [ ] Redeploy feito após configurar variável
- [ ] Resend Dashboard verificado
- [ ] Banco de dados verificado (subscriptions sem e-mail)
- [ ] E-mail do pagador sendo capturado corretamente

---

## 🔧 SOLUÇÕES COMUNS

### Problema: `RESEND_API_KEY não configurada`

**Solução:**
1. Adicione `RESEND_API_KEY` no Vercel
2. Faça redeploy
3. Teste novamente

### Problema: E-mail não está sendo capturado do webhook

**Solução:**
- Verificar logs do webhook
- Adicionar mais fontes de e-mail no código se necessário

### Problema: Resend retorna erro

**Solução:**
- Verificar se o domínio `ylada.com` está verificado no Resend
- Verificar se a API Key tem permissões corretas (Full Access)

---

## 📝 DADOS NECESSÁRIOS PARA DEBUG

**Me envie:**
1. ✅ Logs do webhook (procure por `📧`)
2. ✅ Resultado do diagnóstico (`/api/webhooks/mercado-pago/diagnostico`)
3. ✅ Screenshot das variáveis de ambiente no Vercel
4. ✅ Resultado da query SQL acima
5. ✅ E-mails que não receberam (para verificar no Resend)

---

**Última atualização:** 10/11/2025

