# 🧪 TESTE DE WEBHOOKS STRIPE - GUIA RÁPIDO

## 📋 STATUS ATUAL
- ✅ Servidor rodando em `localhost:3000`
- ✅ Stripe CLI instalado
- ✅ Webhooks configurados: `/api/webhooks/stripe-br` e `/api/webhooks/stripe-us`

---

## 🚀 PASSO 1: INICIAR LISTENER DO STRIPE CLI

Abra um **novo terminal** e execute:

```bash
# Para webhook BR
stripe listen --forward-to localhost:3000/api/webhooks/stripe-br

# OU para webhook US
stripe listen --forward-to localhost:3000/api/webhooks/stripe-us
```

**O que vai acontecer:**
1. O Stripe CLI vai mostrar um **webhook signing secret** temporário
2. Exemplo: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **Copie esse secret!** Você vai precisar dele

**⚠️ IMPORTANTE:** 
- Deixe esse terminal aberto enquanto testa
- O Stripe CLI vai encaminhar TODOS os eventos do Stripe para seu localhost

---

## 🔧 PASSO 2: CONFIGURAR WEBHOOK SECRET (OPCIONAL)

Se você quiser usar o secret do Stripe CLI no `.env.local`:

1. Copie o secret que apareceu no terminal (começa com `whsec_`)
2. Adicione no `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
   ```
3. Reinicie o servidor Next.js

**OU** você pode testar sem atualizar o `.env.local` - o Stripe CLI gerencia isso automaticamente.

---

## 🎯 PASSO 3: DISPARAR EVENTOS DE TESTE

Em **outro terminal**, execute os comandos abaixo para disparar eventos:

### 3.1. Testar Checkout Session Completed

```bash
stripe trigger checkout.session.completed
```

**O que verificar:**
- ✅ No terminal do `stripe listen`: deve mostrar evento recebido
- ✅ No terminal do servidor Next.js: deve mostrar logs como:
  ```
  📥 Webhook BR recebido: checkout.session.completed
  ✅ Checkout session completed: cs_test_xxxxx
  ```

### 3.2. Testar Subscription Created

```bash
stripe trigger customer.subscription.created
```

**O que verificar:**
- ✅ Logs mostram: `📝 Subscription updated: sub_test_xxxxx`
- ✅ Logs mostram: `✅ Subscription salva no banco`

### 3.3. Testar Subscription Updated

```bash
stripe trigger customer.subscription.updated
```

### 3.4. Testar Subscription Deleted

```bash
stripe trigger customer.subscription.deleted
```

**O que verificar:**
- ✅ Logs mostram: `🗑️ Subscription deleted: sub_test_xxxxx`
- ✅ Logs mostram: `✅ Subscription cancelada no banco`

### 3.5. Testar Invoice Payment Succeeded

```bash
stripe trigger invoice.payment_succeeded
```

**O que verificar:**
- ✅ Logs mostram: `💰 Invoice payment succeeded: in_test_xxxxx`
- ✅ Logs mostram: `✅ Pagamento salvo no banco`

### 3.6. Testar Invoice Payment Failed

```bash
stripe trigger invoice.payment_failed
```

**O que verificar:**
- ✅ Logs mostram: `❌ Invoice payment failed: in_test_xxxxx`
- ✅ Logs mostram: `⚠️ Subscription atualizada para past_due`

---

## 🔍 PASSO 4: VERIFICAR LOGS

### No Terminal do Servidor Next.js:
Procure por mensagens como:
- `📥 Webhook BR recebido: [evento]`
- `✅ Checkout session completed`
- `✅ Subscription salva no banco`
- `❌ Erro ao verificar webhook` (se houver problema)

### No Terminal do Stripe CLI:
- Mostra eventos recebidos do Stripe
- Mostra status da resposta (200 = sucesso)

---

## 🐛 TROUBLESHOOTING

### Erro: "Webhook signature verification failed"
**Solução:**
1. Certifique-se de que o `stripe listen` está rodando
2. Use o secret que o Stripe CLI mostrou no `.env.local`
3. Reinicie o servidor Next.js

### Erro: "STRIPE_WEBHOOK_SECRET_BR não configurado"
**Solução:**
1. Adicione `STRIPE_WEBHOOK_SECRET_BR` no `.env.local`
2. Use o secret do `stripe listen` ou do Stripe Dashboard
3. Reinicie o servidor

### Webhook não recebe eventos
**Solução:**
1. Verifique se o `stripe listen` está rodando
2. Verifique se a URL está correta: `localhost:3000/api/webhooks/stripe-br`
3. Verifique se o servidor Next.js está rodando na porta 3000

### Evento não é processado
**Solução:**
1. Verifique os logs do servidor para ver qual erro ocorreu
2. Verifique se o evento está na lista de eventos suportados:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

---

## ✅ CHECKLIST DE TESTES

- [ ] `checkout.session.completed` - Processa corretamente
- [ ] `customer.subscription.created` - Cria subscription no banco
- [ ] `customer.subscription.updated` - Atualiza subscription no banco
- [ ] `customer.subscription.deleted` - Cancela subscription no banco
- [ ] `invoice.payment_succeeded` - Salva pagamento no banco
- [ ] `invoice.payment_failed` - Atualiza status para past_due
- [ ] Logs aparecem corretamente no servidor
- [ ] Sem erros de verificação de assinatura

---

## 📝 PRÓXIMOS PASSOS

Após testar localmente:

1. **Configurar webhook em produção:**
   - Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://ylada.app/api/webhooks/stripe-br`
   - Copiar signing secret de produção
   - Adicionar no Vercel como variável de ambiente

2. **Testar checkout real:**
   - Fazer um checkout de teste no site
   - Verificar se webhook é disparado
   - Verificar se dados são salvos no banco

---

**Última atualização:** $(date)





