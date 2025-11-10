# 🔄 PASSO A PASSO: CONFIGURAR ASSINATURAS RECORRENTES MERCADO PAGO

## 🎯 OBJETIVO

Configurar assinaturas recorrentes para que o plano mensal seja cobrado automaticamente todo mês.

---

## ⚠️ IMPORTANTE: DIFERENÇA ENTRE PAGAMENTO ÚNICO E ASSINATURA

### **Pagamento Único (Atual - Checkout Pro):**
- ✅ Cliente paga uma vez
- ✅ Funciona com PIX, Boleto e Cartão
- ✅ Usado para plano anual

### **Assinatura Recorrente (Preapproval):**
- ✅ Cliente é cobrado automaticamente todo mês
- ❌ **APENAS cartão de crédito** (PIX e Boleto não funcionam)
- ✅ Usado para plano mensal

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Verificar Credenciais** ✅

Certifique-se de que as credenciais estão configuradas:

**No .env.local:**
```env
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
```

**Na Vercel:**
- Mesmas variáveis configuradas como "Production"

---

### **PASSO 2: Atualizar Código** 💻

O código já foi criado em `src/lib/mercado-pago-subscriptions.ts`.

**Agora você precisa:**

1. **Atualizar `payment-gateway.ts`** para usar assinaturas recorrentes no plano mensal:

```typescript
// src/lib/payment-gateway.ts

import { createRecurringSubscription } from './mercado-pago-subscriptions'

async function createMercadoPagoCheckout(
  request: CheckoutRequest,
  baseUrl: string
): Promise<CheckoutResponse> {
  // ... código existente ...

  // Se for plano mensal, usar assinatura recorrente
  if (request.planType === 'monthly') {
    const subscription = await createRecurringSubscription({
      area: request.area,
      planType: request.planType,
      userId: request.userId,
      userEmail: request.userEmail,
      amount,
      description: `YLADA ${request.area.toUpperCase()} - Plano Mensal`,
      successUrl,
      failureUrl,
      pendingUrl,
    }, isTest)

    return {
      gateway: 'mercadopago',
      checkoutUrl: subscription.initPoint,
      sessionId: subscription.id,
      metadata: {
        area: request.area,
        planType: request.planType,
        countryCode: request.countryCode || 'BR',
        gateway: 'mercadopago',
        isRecurring: true, // Marcar como recorrente
      },
    }
  }

  // Se for plano anual, usar pagamento único (como está)
  // ... código existente para createPreference ...
}
```

---

### **PASSO 3: Atualizar Webhook** 📥

O webhook precisa processar eventos de assinatura recorrente:

```typescript
// src/app/api/webhooks/mercado-pago/route.ts

// Adicionar handler para eventos de assinatura
case 'subscription':
case 'preapproval':
  await handleSubscriptionEvent(body.data)
  break
```

**Handler de assinatura:**
```typescript
async function handleSubscriptionEvent(data: any) {
  const subscriptionId = data.id
  console.log('🔄 Processando assinatura recorrente:', subscriptionId)

  const metadata = data.metadata || {}
  const userId = metadata.user_id
  const area = metadata.area || 'wellness'
  const planType = metadata.plan_type || 'monthly'

  // Status da assinatura
  const status = data.status // 'authorized', 'paused', 'cancelled'

  // Criar ou atualizar assinatura no banco
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      area: area,
      plan_type: planType,
      mercadopago_subscription_id: subscriptionId,
      status: status === 'authorized' ? 'active' : status,
      gateway: 'mercadopago',
      // ... outros campos
    }, {
      onConflict: 'mercadopago_subscription_id',
    })

  console.log('✅ Assinatura recorrente processada:', subscriptionId)
}
```

---

### **PASSO 4: Configurar Webhook no Painel** 🔧

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
2. **Vá em:** "Suas integrações" → "YLADA" → "Webhooks"
3. **Configure a URL:**
   ```
   https://www.ylada.com/api/webhooks/mercado-pago
   ```
4. **Habilite os eventos:**
   - ✅ **Pagamentos** (para pagamentos únicos)
   - ✅ **Planos e assinaturas** (para assinaturas recorrentes) ⚠️ **IMPORTANTE**
   - ✅ **Order (Mercado Pago)**

---

### **PASSO 5: Testar** 🧪

#### **Teste 1: Criar Assinatura Recorrente**

1. Acesse: `/pt/wellness/checkout`
2. Escolha: **Plano Mensal**
3. Clique: "Continuar para Pagamento"
4. **Verifique:**
   - ✅ Redireciona para Mercado Pago
   - ✅ Mostra opção de **cartão de crédito** (PIX não aparece para assinaturas)
   - ✅ Valor: R$ 59,90

#### **Teste 2: Completar Assinatura**

1. Preencha dados do cartão
2. Complete o pagamento
3. **Verifique:**
   - ✅ Redireciona para página de sucesso
   - ✅ Webhook recebe notificação
   - ✅ Assinatura criada no banco

#### **Teste 3: Verificar Assinatura no Banco**

```sql
SELECT 
  id,
  user_id,
  area,
  plan_type,
  status,
  gateway,
  mercadopago_subscription_id,
  current_period_end
FROM subscriptions 
WHERE gateway = 'mercadopago' 
  AND plan_type = 'monthly'
ORDER BY created_at DESC 
LIMIT 1;
```

**Deve mostrar:**
- `status`: `active`
- `mercadopago_subscription_id`: ID da assinatura
- `current_period_end`: Data de renovação (próximo mês)

---

## 🔄 COMO FUNCIONA A COBRANÇA RECORRENTE

### **Fluxo Mensal:**

1. **Primeiro Pagamento:**
   - Cliente assina plano mensal
   - Mercado Pago cria Preapproval
   - Cliente é cobrado R$ 59,90

2. **Renovação Automática (Todo Mês):**
   - Mercado Pago cobra automaticamente no mesmo dia
   - Webhook recebe notificação de pagamento
   - Banco atualiza `current_period_end` para próximo mês

3. **Falha no Pagamento:**
   - Se cartão expirar ou falhar
   - Mercado Pago tenta novamente
   - Webhook recebe notificação
   - Status muda para `past_due` ou `unpaid`

---

## ⚠️ LIMITAÇÕES IMPORTANTES

### **Assinaturas Recorrentes:**
- ❌ **PIX não funciona** (apenas cartão)
- ❌ **Boleto não funciona** (apenas cartão)
- ✅ **Apenas cartão de crédito**

### **Recomendação:**
- **Plano Mensal:** Usar assinatura recorrente (cartão)
- **Plano Anual:** Manter pagamento único (permite PIX e parcelamento)

---

## 📊 ESTRUTURA DE DADOS

### **Tabela `subscriptions`:**

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID,
  area VARCHAR(50),
  plan_type VARCHAR(20),
  status VARCHAR(50), -- 'active', 'past_due', 'cancelled'
  gateway VARCHAR(20), -- 'mercadopago'
  mercadopago_subscription_id VARCHAR(255), -- ID do Preapproval
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP, -- Próxima cobrança
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🔍 VERIFICAÇÃO

### **Query para verificar assinaturas recorrentes:**

```sql
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.mercadopago_subscription_id,
  s.current_period_start,
  s.current_period_end,
  s.created_at
FROM subscriptions s
WHERE s.gateway = 'mercadopago'
  AND s.plan_type = 'monthly'
  AND s.mercadopago_subscription_id IS NOT NULL
ORDER BY s.created_at DESC;
```

---

## ✅ CHECKLIST FINAL

- [ ] Código atualizado para usar `createRecurringSubscription` no plano mensal
- [ ] Webhook atualizado para processar eventos de assinatura
- [ ] Evento "Planos e assinaturas" habilitado no webhook do painel
- [ ] Testado criação de assinatura recorrente
- [ ] Verificado que assinatura foi salva no banco
- [ ] Verificado que `mercadopago_subscription_id` está preenchido
- [ ] Testado com cartão de crédito (PIX não deve aparecer)

---

## 🚨 TROUBLESHOOTING

### **Problema: PIX aparece no checkout de assinatura**

**Causa:** Está usando `createPreference` em vez de `createRecurringSubscription`

**Solução:** Verificar se o código está usando a função correta para plano mensal

---

### **Problema: Webhook não recebe eventos de assinatura**

**Causa:** Evento "Planos e assinaturas" não está habilitado

**Solução:** Habilitar no painel do Mercado Pago → Webhooks → Eventos

---

### **Problema: Assinatura não renova automaticamente**

**Causa:** Preapproval não está configurado corretamente

**Solução:** Verificar se `auto_recurring` está configurado com `end_date: null`

---

**Última atualização:** Janeiro 2025

