# 🔄 CONFIGURAR ASSINATURAS RECORRENTES NO MERCADO PAGO

## 📋 VISÃO GERAL

Para vendas recorrentes (assinaturas mensais), o Mercado Pago oferece o sistema de **"Planos e Assinaturas"**. Este guia mostra como configurar passo a passo.

---

## ⚠️ DIFERENÇA ENTRE PAGAMENTO ÚNICO E ASSINATURA

### **Pagamento Único (Atual - Checkout Pro):**
- ✅ Usado para pagamentos únicos (ex: plano anual)
- ✅ Permite parcelamento
- ✅ Cliente paga uma vez e pronto

### **Assinatura Recorrente (Planos):**
- ✅ Usado para cobranças mensais automáticas
- ✅ Cliente é cobrado todo mês automaticamente
- ✅ Ideal para planos mensais

---

## 🎯 PASSO A PASSO: CONFIGURAR PLANO RECORRENTE

### **PASSO 1: Acessar o Painel do Mercado Pago**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login na sua conta
3. Vá em **"Suas integrações"** → **"Planos e assinaturas"**

---

### **PASSO 2: Criar um Plano**

1. Clique em **"Criar plano"** ou **"Novo plano"**
2. Preencha os seguintes campos:

#### **Informações Básicas:**
- **Nome do plano:** `YLADA Wellness - Mensal`
- **Descrição:** `Assinatura mensal da plataforma YLADA Wellness`
- **Frequência:** `Mensal` (cobrado todo mês)
- **Valor:** `R$ 59,90`

#### **Configurações de Cobrança:**
- **Período de teste:** (opcional) Deixe em branco ou configure se quiser período de teste
- **Dia da cobrança:** Escolha o dia do mês (ex: dia 1, dia 15, etc.)
- **Tentativas de cobrança:** Configure quantas tentativas fazer se o pagamento falhar

#### **Configurações de Renovação:**
- **Renovação automática:** ✅ Ativar
- **Cancelamento:** Cliente pode cancelar a qualquer momento

---

### **PASSO 3: Configurar Métodos de Pagamento**

No plano criado, configure quais métodos de pagamento aceitar:

1. **Cartão de crédito:** ✅ Habilitado
2. **PIX:** ⚠️ PIX não funciona com assinaturas (apenas pagamentos únicos)
3. **Boleto:** ⚠️ Boleto não funciona com assinaturas (apenas pagamentos únicos)

**Nota:** Assinaturas recorrentes no Mercado Pago funcionam **apenas com cartão de crédito**.

---

### **PASSO 4: Obter o ID do Plano**

Após criar o plano:

1. O Mercado Pago gerará um **Plan ID** (ex: `2c9380848a1234567890`)
2. **Copie este ID** - você precisará dele no código
3. Anote também o **Preapproval ID** se disponível

---

### **PASSO 5: Configurar Webhook para Assinaturas**

1. Acesse: **"Webhooks e notificações"**
2. Configure a URL do webhook:
   ```
   https://www.ylada.com/api/webhooks/mercado-pago
   ```
3. **Habilite os eventos:**
   - ✅ **"Planos e assinaturas"** (obrigatório)
   - ✅ **"Pagamentos"** (para receber notificações de pagamento)
   - ✅ **"Order (Mercado Pago)"** (para receber notificações de pedidos)

---

### **PASSO 6: Adicionar Plan ID no Código**

No arquivo `.env.local` ou variáveis de ambiente da Vercel:

```env
# Mercado Pago - Planos Recorrentes
MERCADOPAGO_PLAN_MONTHLY_WELLNESS=2c9380848a1234567890
MERCADOPAGO_PLAN_ANNUAL_WELLNESS=2c9380848a1234567890
```

---

## 🔧 IMPLEMENTAÇÃO NO CÓDIGO

### **Opção A: Usar Checkout de Assinatura (Recomendado)**

O Mercado Pago oferece um checkout específico para assinaturas que cria automaticamente a assinatura quando o cliente paga.

```typescript
// Exemplo de criação de checkout de assinatura
const subscription = await mercadopago.preapproval.create({
  body: {
    reason: 'YLADA Wellness - Plano Mensal',
    external_reference: `wellness_monthly_${userId}`,
    payer_email: userEmail,
    auto_recurring: {
      frequency: 1, // 1 = mensal
      frequency_type: 'months',
      transaction_amount: 59.90,
      currency_id: 'BRL',
      start_date: new Date().toISOString(),
      end_date: null, // null = sem data de término
    },
    back_url: `${baseUrl}/pt/wellness/pagamento-sucesso`,
  }
})
```

### **Opção B: Usar Preference com Subscription (Atual)**

Se quiser manter o Checkout Pro mas criar assinatura após o primeiro pagamento:

1. Cliente faz primeiro pagamento (Checkout Pro)
2. Webhook recebe notificação
3. Código cria assinatura automaticamente usando o `customer_id` do primeiro pagamento

---

## 📊 ESTRUTURA DE DADOS

### **Tabela de Assinaturas (Supabase)**

A tabela `subscriptions` já está preparada para armazenar:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  area VARCHAR(50),
  plan_type VARCHAR(50), -- 'monthly' ou 'annual'
  status VARCHAR(50), -- 'active', 'cancelled', 'pending'
  mercadopago_subscription_id VARCHAR(255),
  mercadopago_customer_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🔄 FLUXO DE ASSINATURA RECORRENTE

### **1. Cliente Assina (Primeira Vez)**
```
Cliente → Checkout → Paga R$ 59,90 → Webhook recebe → Cria assinatura
```

### **2. Renovação Automática (Mensalmente)**
```
Mercado Pago → Cobra automaticamente → Webhook recebe → Atualiza status
```

### **3. Falha no Pagamento**
```
Mercado Pago → Tenta cobrar → Falha → Webhook recebe → Atualiza status para "pending"
```

### **4. Cancelamento**
```
Cliente cancela → Webhook recebe → Atualiza status para "cancelled"
```

---

## 🧪 TESTAR ASSINATURA RECORRENTE

### **1. Criar Assinatura de Teste**

1. Use credenciais de **TESTE** (sandbox)
2. Crie um plano de teste
3. Faça um pagamento de teste
4. Verifique se a assinatura foi criada

### **2. Simular Renovação**

No painel do Mercado Pago:
1. Vá em **"Planos e assinaturas"**
2. Selecione a assinatura de teste
3. Clique em **"Simular cobrança"** ou **"Processar renovação"**

### **3. Verificar Webhook**

1. Verifique os logs do servidor
2. Confirme que o webhook está recebendo as notificações
3. Verifique se o banco de dados está sendo atualizado

---

## ⚠️ LIMITAÇÕES E CONSIDERAÇÕES

### **Limitações:**
- ❌ **PIX não funciona** com assinaturas (apenas cartão)
- ❌ **Boleto não funciona** com assinaturas (apenas cartão)
- ⚠️ Cliente precisa ter cartão de crédito válido
- ⚠️ Se o cartão expirar, a assinatura pode ser suspensa

### **Vantagens:**
- ✅ Cobrança automática todo mês
- ✅ Cliente não precisa fazer nada
- ✅ Reduz atrito de pagamento
- ✅ Aumenta retenção

---

## 📝 CHECKLIST DE CONFIGURAÇÃO

- [ ] Plano mensal criado no Mercado Pago
- [ ] Plan ID copiado e adicionado nas variáveis de ambiente
- [ ] Webhook configurado para receber eventos de assinatura
- [ ] Código atualizado para criar assinaturas
- [ ] Webhook handler atualizado para processar eventos de assinatura
- [ ] Testado em ambiente de sandbox
- [ ] Testado em produção (com valores pequenos)

---

## 🔗 LINKS ÚTEIS

- **Documentação Mercado Pago - Assinaturas:** https://www.mercadopago.com.br/developers/pt/docs/subscriptions
- **API de Assinaturas:** https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post
- **Painel de Desenvolvedores:** https://www.mercadopago.com.br/developers/panel

---

## 💡 RECOMENDAÇÃO

Para o plano **mensal**, recomendo usar **assinaturas recorrentes** para:
- Cobrança automática
- Melhor experiência do cliente
- Maior retenção

Para o plano **anual**, mantenha **pagamento único** (Checkout Pro) porque:
- Cliente paga uma vez por ano
- Permite parcelamento
- Mais simples de gerenciar

---

**Última atualização:** Janeiro 2025

