# 🔍 DIFERENÇA ENTRE OS CHECKOUTS DO MERCADO PAGO

## 📋 OS 3 TIPOS DE CHECKOUT

### **1. Checkout Pro (O que você está usando para plano anual)** ✅

**Como funciona:**
- Cliente é **redirecionado** para página do Mercado Pago
- Mercado Pago gerencia toda a interface
- Você cria uma "Preference" via API
- Cliente paga na página do Mercado Pago
- Redireciona de volta para seu site

**Vantagens:**
- ✅ Mais simples de implementar
- ✅ Suporta PIX, Boleto e Cartão
- ✅ Permite parcelamento
- ✅ Menos código necessário

**Desvantagens:**
- ❌ Cliente sai do seu site
- ❌ Menos personalização visual

**Quando usar:**
- ✅ Pagamentos únicos (plano anual)
- ✅ Quando quer PIX/Boleto
- ✅ Quando quer parcelamento

---

### **2. Checkout Transparente (O que está configurado no painel)**

**Como funciona:**
- Cliente **permanece no seu site**
- Você cria formulários de pagamento no seu site
- Coleta dados do cartão no seu site
- Envia para Mercado Pago via API
- Processa pagamento diretamente

**Vantagens:**
- ✅ Cliente não sai do site
- ✅ Total controle visual
- ✅ Experiência unificada

**Desvantagens:**
- ❌ Muito mais complexo
- ❌ Precisa conformidade PCI
- ❌ Mais código necessário
- ❌ Mais responsabilidade com segurança

**Quando usar:**
- Quando personalização visual é crítica
- Quando cliente não pode sair do site

---

### **3. Assinaturas (Preapproval - O que você vai usar para plano mensal)** ✅

**Como funciona:**
- Usa API de **Preapproval**
- Cliente autoriza cobrança recorrente
- Mercado Pago cobra automaticamente todo mês
- Cliente é redirecionado para página do Mercado Pago (similar ao Checkout Pro)

**Vantagens:**
- ✅ Cobrança automática
- ✅ Cliente não precisa fazer nada todo mês
- ✅ Aumenta retenção

**Desvantagens:**
- ❌ **APENAS cartão de crédito** (PIX não funciona)
- ❌ Boleto não funciona

**Quando usar:**
- ✅ Planos mensais recorrentes
- ✅ Quando quer cobrança automática

---

## 🎯 QUAL VOCÊ ESTÁ USANDO?

### **No Painel do Mercado Pago:**
- Está configurado como **"Checkout Transparente"**
- Mas isso é apenas uma **classificação/organização**
- **NÃO afeta o funcionamento do código**

### **No Código (O que realmente importa):**

**Plano Mensal:**
- ✅ Usa **Preapproval API** (Assinaturas)
- ✅ Cria assinatura recorrente
- ✅ Cliente é redirecionado para Mercado Pago
- ✅ Apenas cartão de crédito

**Plano Anual:**
- ✅ Usa **Preference API** (Checkout Pro)
- ✅ Cria pagamento único
- ✅ Cliente é redirecionado para Mercado Pago
- ✅ PIX, Boleto e Cartão

---

## ❓ PRECISA MUDAR ALGO NO PAINEL?

### **Resposta: NÃO!** ✅

**Por quê:**
- O tipo de checkout no painel é apenas **organizacional**
- O código decide qual API usar (Preference ou Preapproval)
- Não precisa mudar nada no painel
- Continue usando "Checkout Transparente" como está

**O que importa:**
- ✅ Credenciais configuradas (Access Token, Public Key)
- ✅ Webhook configurado
- ✅ Eventos habilitados (Pagamentos, Planos e assinaturas)

---

## 🔄 COMO FUNCIONA NA PRÁTICA

### **Fluxo Plano Mensal (Assinatura Recorrente):**

```
1. Cliente escolhe "Plano Mensal"
2. Código chama: createRecurringSubscription()
3. Mercado Pago cria Preapproval
4. Cliente é redirecionado para Mercado Pago
5. Cliente autoriza cobrança recorrente (cartão)
6. Redireciona de volta para seu site
7. Mercado Pago cobra automaticamente todo mês
```

### **Fluxo Plano Anual (Pagamento Único):**

```
1. Cliente escolhe "Plano Anual"
2. Código chama: createPreference()
3. Mercado Pago cria Preference
4. Cliente é redirecionado para Mercado Pago
5. Cliente escolhe método (PIX, Boleto, Cartão)
6. Cliente paga
7. Redireciona de volta para seu site
8. Pronto! (não há cobrança recorrente)
```

---

## ✅ CONCLUSÃO

**Você NÃO precisa mudar nada no painel!**

- ✅ Deixe como "Checkout Transparente"
- ✅ O código já decide qual API usar
- ✅ Tudo funciona automaticamente
- ✅ Foque apenas em configurar o webhook corretamente

---

**Última atualização:** Janeiro 2025

