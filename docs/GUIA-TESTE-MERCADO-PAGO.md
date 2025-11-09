# 🧪 GUIA DE TESTE: Mercado Pago

## ✅ O QUE JÁ FOI FEITO

- [x] SQL executado no Supabase
- [x] Webhook configurado no Mercado Pago (local)
- [ ] Variáveis configuradas na Vercel
- [ ] Teste de checkout

---

## 🔧 PASSO 1: Configurar Variáveis na Vercel

### 1.1. Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto `ylada-app`
3. Vá em **"Settings"** → **"Environment Variables"**

### 1.2. Adicionar Variáveis

Adicione estas 3 variáveis:

```
MERCADOPAGO_ACCESS_TOKEN = TEST-6484673849752001-110918-adce0427c426f14110cd2bd3af885523
MERCADOPAGO_PUBLIC_KEY = TEST-d59ed507-d8e6-49a4-87d9-afe73a335ab9
MERCADOPAGO_WEBHOOK_SECRET = c166f3dd675525f876bb5f3a8869e61ec15579d6ee7cde644ef1bac236d9ec6f
```

**Importante:**
- Selecione os ambientes: **Production**, **Preview**, **Development**
- Clique em **"Save"** após cada variável

### 1.3. Fazer Deploy

Após adicionar as variáveis:
1. Vá em **"Deployments"**
2. Clique nos **3 pontinhos** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o deploy concluir

---

## 🔧 PASSO 2: Atualizar Webhook no Mercado Pago

### 2.1. Atualizar URL do Webhook

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá na sua aplicação **YLADA**
3. Clique em **"Webhooks"**
4. Edite a URL existente ou adicione uma nova:
   - **URL:** `https://ylada.com/api/webhooks/mercado-pago`
5. Salve

---

## 🧪 PASSO 3: Testar Checkout

### 3.1. Testar Localmente (Opcional)

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse: `http://localhost:3000/pt/wellness/checkout`

3. Faça login (se necessário)

4. Selecione um plano (Mensal ou Anual)

5. Clique em **"Continuar para Pagamento"**

6. Você deve ser redirecionado para o checkout do Mercado Pago

### 3.2. Testar em Produção

1. Acesse: `https://ylada.com/pt/wellness/checkout`

2. Faça login

3. Selecione um plano

4. Clique em **"Continuar para Pagamento"**

5. Você será redirecionado para o Mercado Pago

---

## 💳 PASSO 4: Fazer Pagamento de Teste

### 4.1. No Checkout do Mercado Pago

**Cartão de Teste Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Data: Qualquer data futura (ex: 12/25)
- Nome: Qualquer nome

**Ou use PIX:**
- Escolha **"Pix"** como método de pagamento
- O pagamento será aprovado automaticamente após alguns segundos

### 4.2. Após o Pagamento

1. Você será redirecionado para: `/pt/wellness/pagamento-sucesso`
2. Verifique se a página mostra "Pagamento Confirmado"
3. Verifique se você consegue acessar o dashboard

---

## ✅ PASSO 5: Verificar se Funcionou

### 5.1. Verificar no Banco de Dados

Execute no Supabase SQL Editor:

```sql
-- Verificar assinatura criada
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  amount,
  currency,
  current_period_end,
  stripe_subscription_id,
  created_at
FROM subscriptions
ORDER BY created_at DESC
LIMIT 5;

-- Verificar pagamento criado
SELECT 
  id,
  subscription_id,
  user_id,
  amount,
  currency,
  status,
  payment_method,
  stripe_payment_intent_id,
  created_at
FROM payments
ORDER BY created_at DESC
LIMIT 5;
```

### 5.2. Verificar Logs

**No Terminal (se testando local):**
- Verifique se aparecem logs como:
  - `📥 Webhook Mercado Pago recebido`
  - `💳 Processando pagamento`
  - `✅ Pagamento processado e acesso ativado`

**Na Vercel:**
1. Vá em **"Deployments"**
2. Clique no último deploy
3. Vá em **"Functions"** → **"View Function Logs"**
4. Procure por logs do webhook

### 5.3. Verificar Acesso ao Dashboard

1. Acesse: `/pt/wellness/dashboard`
2. Verifique se você consegue acessar (não deve mostrar bloqueio)
3. Verifique se os templates aparecem

---

## 🐛 TROUBLESHOOTING

### Erro: "Mercado Pago Access Token não configurado"

**Solução:**
- Verifique se as variáveis estão no `.env.local` (local)
- Verifique se as variáveis estão na Vercel (produção)
- Faça redeploy após adicionar variáveis

### Erro: "Webhook não recebido"

**Solução:**
- Verifique se a URL do webhook está correta no Mercado Pago
- Verifique se o webhook está configurado para **"Modo de teste"**
- Verifique os logs da Vercel

### Erro: "Subscription não criada no banco"

**Solução:**
- Verifique se o SQL foi executado corretamente
- Verifique os logs do webhook
- Verifique se o `user_id` está correto no metadata

### Checkout não redireciona

**Solução:**
- Verifique se as credenciais estão corretas
- Verifique os logs do servidor
- Verifique se o país detectado é BR

---

## ✅ CHECKLIST FINAL

Antes de considerar completo, verifique:

- [ ] Variáveis configuradas na Vercel
- [ ] Deploy realizado
- [ ] Webhook configurado para produção (`ylada.com`)
- [ ] Teste de checkout funcionando
- [ ] Pagamento de teste aprovado
- [ ] Assinatura criada no banco
- [ ] Pagamento registrado no banco
- [ ] Acesso ao dashboard liberado
- [ ] Webhook recebido e processado

---

**Última atualização:** Janeiro 2025

