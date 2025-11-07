# 🧪 PASSO-A-PASSO COMPLETO PARA TESTES STRIPE

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de que:

- [ ] `.env.local` configurado com chaves de **TESTE**
- [ ] Price IDs configurados:
  - [ ] `STRIPE_PRICE_WELLNESS_MONTHLY_BR`
  - [ ] `STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR`
- [ ] Webhook de teste configurado no Stripe
- [ ] Servidor rodando (`npm run dev`)

---

## 🔴 PASSO 1: VERIFICAR CONFIGURAÇÃO

### 1.1. Verificar `.env.local`

Abra o arquivo `.env.local` e confirme:

```env
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx

STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1SQo0RRN0Ga5apy89od4tBV7
```

### 1.2. Verificar Webhook no Stripe

1. Acesse: **Stripe Dashboard → Developers → Webhooks**
2. Verifique se há webhook de **TESTE** configurado
3. URL deve ser: `https://seu-dominio.com/api/webhooks/stripe-br` (ou localhost com Stripe CLI)
4. Eventos selecionados:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

### 1.3. Verificar Produtos no Stripe

1. Acesse: **Stripe Dashboard → Products**
2. Verifique se existem:
   - ✅ Produto mensal (Recurring - Monthly)
   - ✅ Produto anual (One-time - permite parcelamento)

---

## 🟡 PASSO 2: TESTAR CHECKOUT (LOCAL)

### 2.1. Iniciar Servidor

```bash
npm run dev
```

### 2.2. Acessar Página de Checkout

1. Abra: `http://localhost:3000/pt/wellness/checkout`
2. Faça login (se necessário)
3. Você deve ver opções de planos

### 2.3. Testar Checkout Mensal

1. **Escolher plano mensal**
2. **Clicar em "Assinar"** (ou botão de checkout)
3. **Verificar no console do servidor:**
   ```
   🌍 País detectado: BR → Conta Stripe: br
   💰 Price ID: price_1SQmi9RN0Ga5apy8bklmiOuL
   ```
4. **Deve redirecionar para Stripe Checkout**
5. **Verificar no checkout:**
   - ✅ Mostra valor: R$ 59,90
   - ✅ Mostra "Assinatura mensal"
   - ✅ Opções: Cartão ou Pix

### 2.4. Testar Checkout Anual

1. **Escolher plano anual**
2. **Clicar em "Assinar"**
3. **Verificar no console:**
   ```
   🌍 País detectado: BR → Conta Stripe: br
   💰 Usando preço one-time (parcelado) para wellness anual BR
   💰 Price ID: price_1SQo0RRN0Ga5apy89od4tBV7
   ```
4. **Verificar no checkout:**
   - ✅ Mostra valor: R$ 570,00
   - ✅ Mostra opção de parcelar (até 12x)
   - ✅ Opções: Cartão (parcelado) ou Pix

---

## 🟢 PASSO 3: TESTAR PAGAMENTO (MODO TESTE)

### 3.1. Testar Pagamento Mensal (Assinatura)

1. **No checkout do Stripe, escolher:**
   - Método: **Cartão de crédito**
   - Usar cartão de teste: `4242 4242 4242 4242`
   - Data: Qualquer data futura (ex: 12/25)
   - CVC: Qualquer 3 dígitos (ex: 123)
   - Nome: Qualquer nome

2. **Clicar em "Pagar"**

3. **Verificar redirecionamento:**
   - ✅ Deve redirecionar para: `/pt/wellness/pagamento-sucesso`
   - ✅ Mostra mensagem de sucesso

4. **Verificar no console do servidor:**
   ```
   📥 Webhook BR recebido: checkout.session.completed
   ✅ Checkout session completed: cs_test_xxxxx
   📝 Subscription updated: sub_test_xxxxx
   ✅ Subscription salva no banco: sub_test_xxxxx
   ```

5. **Verificar no banco de dados:**
   ```sql
   -- Verificar subscription criada
   SELECT * FROM subscriptions 
   WHERE user_id = 'seu-user-id' 
   AND area = 'wellness' 
   AND plan_type = 'monthly';
   
   -- Verificar payment criado
   SELECT * FROM payments 
   WHERE user_id = 'seu-user-id';
   ```

### 3.2. Testar Pagamento Anual (Parcelado)

1. **No checkout do Stripe, escolher:**
   - Método: **Cartão de crédito**
   - Cartão: `4242 4242 4242 4242`
   - **Verificar se aparece opção de parcelar**
   - Escolher parcelas (ex: 12x de R$ 47,50)

2. **Clicar em "Pagar"**

3. **Verificar redirecionamento:**
   - ✅ Deve redirecionar para: `/pt/wellness/pagamento-sucesso`

4. **Verificar no console:**
   ```
   📥 Webhook BR recebido: checkout.session.completed
   ✅ Checkout session completed: cs_test_xxxxx
   💳 Processando pagamento único: cs_test_xxxxx
   ✅ Pagamento único processado e acesso ativado: cs_test_xxxxx
   📅 Acesso válido até: 2025-XX-XX...
   ```

5. **Verificar no banco:**
   ```sql
   -- Verificar subscription (pagamento único)
   SELECT * FROM subscriptions 
   WHERE user_id = 'seu-user-id' 
   AND stripe_subscription_id LIKE 'one_time_%';
   
   -- Verificar payment
   SELECT * FROM payments 
   WHERE user_id = 'seu-user-id';
   ```

### 3.3. Testar Pix

1. **No checkout, escolher:**
   - Método: **Pix**

2. **Verificar:**
   - ✅ Mostra QR Code
   - ✅ Mostra código Pix

3. **Simular pagamento:**
   - No Stripe Dashboard → Payments → Encontrar pagamento → Marcar como pago

4. **Verificar webhook:**
   - ✅ Deve processar `checkout.session.completed`

---

## 🔵 PASSO 4: VERIFICAR ATIVAÇÃO DE ACESSO

### 4.1. Verificar se Acesso Foi Ativado

1. **Após pagamento, acessar:**
   - `http://localhost:3000/pt/wellness/dashboard` (ou página principal)

2. **Verificar:**
   - ✅ Cliente tem acesso à plataforma
   - ✅ Pode criar ferramentas
   - ✅ Pode criar links
   - ✅ Pode acessar portal

### 4.2. Verificar no Banco

```sql
-- Verificar subscription ativa
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  created_at
FROM subscriptions
WHERE user_id = 'seu-user-id'
AND area = 'wellness'
AND status = 'active'
AND current_period_end > NOW();
```

---

## 🟣 PASSO 5: TESTAR WEBHOOK LOCALMENTE (OPCIONAL)

Se você quiser testar webhook localmente sem deploy:

### 5.1. Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Ou baixar de: https://stripe.com/docs/stripe-cli
```

### 5.2. Login no Stripe CLI

```bash
stripe login
```

### 5.3. Encaminhar Webhooks

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe-br
```

Isso vai mostrar um **webhook signing secret** temporário. Use esse no `.env.local`:

```env
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
```

### 5.4. Disparar Evento de Teste

```bash
stripe trigger checkout.session.completed
```

---

## 🔴 PASSO 6: TESTAR EM PRODUÇÃO (VERCEL)

### 6.1. Configurar Variáveis no Vercel

1. Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

2. Adicione (use chaves de **PRODUÇÃO**):
   ```
   STRIPE_WEBHOOK_SECRET_BR = whsec_xxxxxxxxxxxxx
   STRIPE_SECRET_KEY_BR = sk_live_xxxxxxxxxxxxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR = pk_live_xxxxxxxxxxxxx
   
   STRIPE_PRICE_WELLNESS_MONTHLY_BR = price_1SQmi9RN0Ga5apy8bklmiOuL
   STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR = price_1SQo0RRN0Ga5apy89od4tBV7
   ```

3. Selecione ambiente: **Production**

4. Faça **redeploy**

### 6.2. Configurar Webhook de Produção no Stripe

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**

2. **URL:** `https://seu-dominio.com/api/webhooks/stripe-br`

3. **Eventos:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

4. **Copiar Signing Secret** e adicionar no Vercel

### 6.3. Testar em Produção

1. Acesse: `https://seu-dominio.com/pt/wellness/checkout`
2. Faça um pagamento de teste (modo teste ainda)
3. Verifique logs no Vercel
4. Verifique webhook no Stripe Dashboard

---

## ✅ CHECKLIST FINAL

### Testes Locais:
- [ ] Checkout mensal funciona
- [ ] Checkout anual funciona
- [ ] Parcelamento aparece no checkout anual
- [ ] Pix aparece como opção
- [ ] Pagamento mensal cria subscription
- [ ] Pagamento anual cria subscription (one-time)
- [ ] Webhook processa corretamente
- [ ] Acesso é ativado após pagamento
- [ ] Dados salvos no banco corretamente

### Testes em Produção:
- [ ] Variáveis configuradas no Vercel
- [ ] Webhook de produção configurado
- [ ] Checkout funciona em produção
- [ ] Webhook recebe eventos
- [ ] Acesso ativado corretamente

---

## 🐛 TROUBLESHOOTING

### Erro: "Price ID não configurado"
- Verifique se `STRIPE_PRICE_WELLNESS_MONTHLY_BR` está no `.env.local`
- Reinicie o servidor após adicionar variáveis

### Erro: "Webhook signature verification failed"
- Verifique se `STRIPE_WEBHOOK_SECRET_BR` está correto
- Certifique-se de usar o secret do webhook correto (teste ou produção)

### Webhook não recebe eventos
- Verifique se URL do webhook está correta
- Verifique se eventos estão selecionados no Stripe
- Verifique logs do servidor/Vercel

### Acesso não é ativado
- Verifique se subscription foi criada no banco
- Verifique se `status = 'active'`
- Verifique se `current_period_end > NOW()`

---

**Última atualização:** {{ data atual }}

