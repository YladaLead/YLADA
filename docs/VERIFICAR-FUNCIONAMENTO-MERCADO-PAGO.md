# ✅ VERIFICAR SE MERCADO PAGO ESTÁ FUNCIONANDO

## 🎯 O QUE VERIFICAR

1. ✅ Criação de checkout (preferência)
2. ✅ Identificação de área e plano
3. ✅ Recebimento de webhook
4. ✅ Salvamento no banco de dados
5. ✅ Ativação de acesso

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **1. Verificar Credenciais** ✅

#### **No .env.local:**
```env
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
```

#### **Na Vercel:**
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Verifique se as variáveis estão configuradas
3. Verifique se estão marcadas como **"Production"**

---

### **2. Verificar Webhook** ✅

#### **No Painel do Mercado Pago:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"** → **"YLADA"** → **"Webhooks"**
3. Verifique se a URL está configurada:
   ```
   https://www.ylada.com/api/webhooks/mercado-pago
   ```
   ⚠️ **IMPORTANTE:** Deve ter `www` (não apenas `ylada.com`)

4. **Eventos habilitados:**
   - ✅ Pagamentos
   - ✅ Order (Mercado Pago)
   - ✅ Planos e assinaturas (se usar)

---

### **3. Testar Checkout** 🧪

#### **Passo a Passo:**

1. **Acesse:** `/pt/wellness/checkout`
2. **Faça login** (se necessário)
3. **Escolha um plano:**
   - Mensal (R$ 59,90)
   - Anual (R$ 470,72)
4. **Clique em:** "Continuar para Pagamento"
5. **Verifique:**
   - ✅ Redireciona para Mercado Pago
   - ✅ Mostra o valor correto
   - ✅ Opções de pagamento aparecem (PIX, Cartão, Boleto)

---

### **4. Fazer Pagamento de Teste** 💳

#### **Opção A: PIX (Recomendado para teste)**

1. No checkout do Mercado Pago, escolha **"Pix"**
2. **Verifique:**
   - ✅ QR Code aparece
   - ✅ Valor está correto
   - ✅ Chave PIX aparece (ylada.lead@gmail.com)

3. **Para testar:**
   - Use um app de banco para escanear o QR Code
   - Ou copie o código PIX e pague
   - ⚠️ **Em produção:** Faça um pagamento real pequeno

#### **Opção B: Cartão de Teste**

1. No checkout, escolha **"Cartão de crédito"**
2. Use cartão de teste:
   - **Número:** `5031 4332 1540 6351`
   - **CVV:** `123`
   - **Data:** Qualquer data futura
   - **Nome:** Qualquer nome

---

### **5. Verificar Webhook Recebido** 📥

#### **No Vercel (Logs):**

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **"Deployments"** → Último deploy
3. Clique em **"Functions"** → `/api/webhooks/mercado-pago`
4. **Procure por:**
   ```
   📥 Webhook Mercado Pago recebido: {
     type: 'payment',
     action: 'payment.created',
     requestId: '...'
   }
   ```

#### **O que verificar nos logs:**

✅ **Webhook recebido:**
```json
{
  "type": "payment",
  "action": "payment.created",
  "data": {
    "id": "123456789",
    "status": "approved",
    "metadata": {
      "user_id": "abc123",
      "area": "wellness",
      "plan_type": "monthly"
    },
    "external_reference": "wellness_monthly_abc123"
  }
}
```

---

### **6. Verificar Banco de Dados** 💾

#### **No Supabase:**

1. Acesse: https://supabase.com/dashboard
2. Vá em **"Table Editor"** → **"subscriptions"**
3. **Procure pelo registro:**
   - `user_id`: ID do usuário que fez o pagamento
   - `area`: `wellness` (ou outra área)
   - `plan_type`: `monthly` ou `annual`
   - `status`: `active`
   - `gateway`: `mercadopago`
   - `mercadopago_payment_id`: ID do pagamento

#### **Query SQL para verificar:**

```sql
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  gateway,
  mercadopago_payment_id,
  mercadopago_preference_id,
  created_at
FROM subscriptions
WHERE gateway = 'mercadopago'
ORDER BY created_at DESC
LIMIT 10;
```

---

### **7. Verificar Acesso Ativado** 🔓

#### **No Dashboard:**

1. Faça login como o usuário que fez o pagamento
2. Acesse: `/pt/wellness/dashboard`
3. **Verifique:**
   - ✅ Dashboard carrega (não mostra erro de acesso)
   - ✅ Funcionalidades estão disponíveis
   - ✅ Não aparece mensagem de "assinatura necessária"

---

## 🔍 VERIFICAÇÃO DETALHADA

### **Verificar Metadata no Checkout:**

1. **Abra o DevTools** (F12) no navegador
2. Vá na aba **"Network"**
3. Faça um checkout
4. **Procure pela requisição:** `/api/wellness/checkout`
5. **Veja a resposta:**
   ```json
   {
     "url": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
     "gateway": "mercadopago",
     "sessionId": "pref-123456789"
   }
   ```

### **Verificar Metadata no Webhook:**

Nos logs do Vercel, verifique se o webhook recebe:

```json
{
  "metadata": {
    "user_id": "abc123",
    "area": "wellness",
    "plan_type": "monthly"
  },
  "external_reference": "wellness_monthly_abc123"
}
```

---

## 🚨 PROBLEMAS COMUNS

### **Problema 1: Webhook não recebe notificações**

**Sintomas:**
- Pagamento feito, mas não aparece no banco
- Logs não mostram webhook recebido

**Soluções:**
1. Verificar URL do webhook no painel (deve ter `www`)
2. Verificar se eventos estão habilitados
3. Testar webhook manualmente no painel
4. Verificar logs do Vercel

---

### **Problema 2: Metadata não está sendo salvo**

**Sintomas:**
- Pagamento aparece no banco, mas `area` ou `plan_type` estão vazios

**Soluções:**
1. Verificar se `metadata` está sendo enviado na preferência
2. Verificar se webhook está processando `metadata` corretamente
3. Verificar código do webhook handler

---

### **Problema 3: Valor incorreto**

**Sintomas:**
- Valor no Mercado Pago diferente do esperado

**Soluções:**
1. Verificar `getPrice()` em `payment-gateway.ts`
2. Verificar se `amount` está sendo enviado corretamente
3. Verificar logs de criação de preferência

---

## 📊 QUERY SQL PARA VERIFICAR TUDO

```sql
-- Ver todas as assinaturas do Mercado Pago
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.gateway,
  s.mercadopago_payment_id,
  s.mercadopago_preference_id,
  s.created_at,
  p.amount,
  p.status as payment_status
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
WHERE s.gateway = 'mercadopago'
ORDER BY s.created_at DESC
LIMIT 20;
```

---

## ✅ CHECKLIST FINAL

- [ ] Credenciais configuradas no .env.local e Vercel
- [ ] Webhook configurado com URL correta (com `www`)
- [ ] Eventos habilitados no webhook
- [ ] Checkout redireciona para Mercado Pago
- [ ] Valor correto aparece no Mercado Pago
- [ ] PIX/Cartão/Boleto aparecem como opções
- [ ] Pagamento de teste realizado
- [ ] Webhook recebido (verificar logs)
- [ ] Registro criado no banco de dados
- [ ] `area` e `plan_type` corretos no banco
- [ ] Acesso ativado no dashboard

---

## 🧪 TESTE RÁPIDO

### **Script de Teste:**

1. **Fazer checkout:**
   ```
   Acesse: /pt/wellness/checkout
   Escolha: Plano Mensal
   Clique: Continuar para Pagamento
   ```

2. **Verificar URL:**
   ```
   Deve redirecionar para: mercadopago.com.br/checkout/...
   ```

3. **Fazer pagamento:**
   ```
   Escolha: PIX
   Pague: (ou use cartão de teste)
   ```

4. **Verificar retorno:**
   ```
   Deve redirecionar para: /pt/wellness/pagamento-sucesso?payment_id=...
   ```

5. **Verificar banco:**
   ```sql
   SELECT * FROM subscriptions 
   WHERE gateway = 'mercadopago' 
   ORDER BY created_at DESC LIMIT 1;
   ```

---

**Última atualização:** Janeiro 2025

