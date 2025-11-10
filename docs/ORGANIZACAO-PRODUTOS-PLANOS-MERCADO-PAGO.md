# 📦 ORGANIZAÇÃO DE PRODUTOS E PLANOS NO MERCADO PAGO

## 🎯 PERGUNTA

**"Uma aplicação serve para todos os planos ou preciso criar produtos separados para cada plano/área?"**

---

## ✅ RESPOSTA: UMA APLICAÇÃO, MÚLTIPLOS PRODUTOS

### **Estrutura Recomendada:**

```
1 Aplicação Mercado Pago (YLADA)
├── Produto 1: Wellness Mensal
├── Produto 2: Wellness Anual
├── Produto 3: Nutri Mensal
├── Produto 4: Nutri Anual
├── Produto 5: Coach Mensal
├── Produto 6: Coach Anual
├── Produto 7: Nutra Mensal
└── Produto 8: Nutra Anual
```

**Total:** 1 aplicação + 8 produtos (4 áreas × 2 planos cada)

---

## 🔍 COMO FUNCIONA

### **1. Aplicação (Application):**
- ✅ **Uma única aplicação** para toda a plataforma YLADA
- ✅ Contém todas as credenciais (Access Token, Public Key)
- ✅ Configurações gerais (webhooks, notificações)
- ✅ Usa as mesmas credenciais para todos os produtos

### **2. Produtos/Preferências (Products/Preferences):**
- ✅ **Criados dinamicamente** via API (não precisa criar manualmente)
- ✅ Cada checkout cria uma "preferência" única
- ✅ Identificados por `metadata` e `external_reference`
- ✅ Não precisa criar produtos fixos no painel

---

## 💡 COMO O CÓDIGO DISTINGUE OS PLANOS

### **Atualmente no Código:**

O código já distingue os planos usando **metadata** e **external_reference**:

```typescript
// src/lib/mercado-pago.ts
metadata: {
  user_id: request.userId,
  area: request.area,        // 'wellness', 'nutri', 'coach', 'nutra'
  plan_type: request.planType, // 'monthly' ou 'annual'
},
external_reference: `${request.area}_${request.planType}_${request.userId}`
```

**Exemplo de external_reference:**
- `wellness_monthly_12345`
- `wellness_annual_12345`
- `nutri_monthly_12345`
- `nutri_annual_12345`

---

## 🎯 DUAS ABORDAGENS POSSÍVEIS

### **Opção 1: Produtos Dinâmicos (Atual - Recomendado)** ✅

**Como funciona:**
- Não cria produtos fixos no painel
- Cada checkout cria uma preferência única
- Identificação via `metadata` e `external_reference`
- Mais flexível e simples

**Vantagens:**
- ✅ Não precisa criar 8 produtos manualmente
- ✅ Mais fácil de manter
- ✅ Permite personalização por usuário
- ✅ Já está funcionando assim

**Desvantagens:**
- ⚠️ Não aparece como "produtos" no painel do Mercado Pago
- ⚠️ Cada preferência é única (não reutilizável)

---

### **Opção 2: Produtos Fixos no Painel** 

**Como funciona:**
- Criar 8 produtos fixos no painel do Mercado Pago
- Cada produto tem um ID fixo
- Usar o mesmo produto ID para todos os checkouts daquele tipo

**Vantagens:**
- ✅ Aparece como produtos organizados no painel
- ✅ Melhor para relatórios e análises
- ✅ Produtos reutilizáveis

**Desvantagens:**
- ❌ Precisa criar 8 produtos manualmente
- ❌ Mais complexo de gerenciar
- ❌ Menos flexível

---

## 📋 RECOMENDAÇÃO: MANTER COMO ESTÁ

### **Por quê?**

1. **Já está funcionando:**
   - O código atual cria preferências dinamicamente
   - Cada checkout é identificado corretamente
   - Webhooks recebem os dados corretos

2. **Mais simples:**
   - Não precisa criar produtos manualmente
   - Não precisa gerenciar IDs de produtos
   - Facilita adicionar novas áreas/planos

3. **Suficiente para distinguir:**
   - `metadata.area` identifica a área
   - `metadata.plan_type` identifica o plano
   - `external_reference` identifica o usuário

---

## 🔍 COMO VERIFICAR NO PAINEL

### **No Painel do Mercado Pago:**

1. **Vá em:** "Suas integrações" → "YLADA"
2. **Clique em:** "Pagamentos" ou "Transações"
3. **Você verá:**
   - Todas as transações da aplicação
   - Cada uma com seu `external_reference`
   - Filtros por data, status, etc.

### **No Webhook:**

O webhook recebe os dados com `metadata`:

```json
{
  "type": "payment",
  "data": {
    "id": "123456789",
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

## 📊 ESTRUTURA DE DADOS NO BANCO

### **Tabela `subscriptions`:**

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID,
  area VARCHAR(50),        -- 'wellness', 'nutri', 'coach', 'nutra'
  plan_type VARCHAR(50),   -- 'monthly', 'annual'
  status VARCHAR(50),
  mercadopago_preference_id VARCHAR(255),
  mercadopago_payment_id VARCHAR(255),
  gateway VARCHAR(50),     -- 'mercadopago' ou 'stripe'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Exemplo de registro:**
```sql
INSERT INTO subscriptions VALUES (
  'uuid-123',
  'user-456',
  'wellness',      -- Área
  'monthly',       -- Plano
  'active',
  'pref-789',
  'payment-101',
  'mercadopago',
  NOW(),
  NOW()
);
```

---

## 🎯 SE QUISER CRIAR PRODUTOS FIXOS (Opcional)

### **Passo a Passo:**

1. **No Painel do Mercado Pago:**
   - Vá em "Suas integrações" → "YLADA"
   - Clique em "Produtos" (se disponível)
   - Crie 8 produtos:
     - Wellness Mensal (R$ 59,90)
     - Wellness Anual (R$ 470,72)
     - Nutri Mensal (R$ 97,00)
     - Nutri Anual (R$ 1.164,00)
     - Coach Mensal (R$ 97,00)
     - Coach Anual (R$ 1.164,00)
     - Nutra Mensal (R$ 97,00)
     - Nutra Anual (R$ 1.164,00)

2. **No Código:**
   - Adicionar variáveis de ambiente com Product IDs
   - Modificar `createPreference` para usar Product ID
   - Mais complexo, mas possível

---

## ✅ CONCLUSÃO

### **Recomendação Final:**

**Manter como está (Produtos Dinâmicos):**

1. ✅ **Uma aplicação** para toda a plataforma
2. ✅ **Preferências criadas dinamicamente** via API
3. ✅ **Distinção via metadata** (`area` e `plan_type`)
4. ✅ **Já está funcionando** corretamente
5. ✅ **Mais simples** de manter

### **Não precisa:**
- ❌ Criar produtos fixos no painel
- ❌ Separar em múltiplas aplicações
- ❌ Mudar o código atual

### **O que você já tem:**
- ✅ Uma aplicação YLADA
- ✅ Código que distingue áreas e planos
- ✅ Webhooks que processam corretamente
- ✅ Banco de dados organizado

---

## 🔍 VERIFICAÇÃO

Para verificar se está funcionando:

1. **Faça um checkout de teste:**
   - Wellness Mensal
   - Wellness Anual
   - Outra área

2. **Verifique no painel:**
   - Vá em "Pagamentos"
   - Veja se cada transação tem `external_reference` correto

3. **Verifique no banco:**
   - Veja se `area` e `plan_type` estão corretos
   - Veja se `gateway` está como 'mercadopago'

---

**Última atualização:** Janeiro 2025

