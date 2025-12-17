# 🔍 ANÁLISE: Preços da Área Nutri

## 📊 **COMPARAÇÃO DE PREÇOS**

### **1. Página de Vendas (`/pt/nutri/page.tsx`)**

**Preços exibidos:**
- **Plano Mensal:** R$ 297/mês
- **Plano Anual:** 12× de R$ 197 (total: R$ 2.364,00)

**Localização:** Linhas 840 e 889

---

### **2. Página de Checkout (`/pt/nutri/checkout/page.tsx`)**

**Preços exibidos:**
- **Plano Mensal:** R$ 97,00/mês
- **Plano Anual:** R$ 1.164,00/ano (equivalente a R$ 97/mês)

**Localização:** Linhas 179-194

---

### **3. Payment Gateway (`payment-gateway.ts`)**

**Preços configurados:**
- **Plano Mensal:** R$ 97,00
- **Plano Anual:** R$ 970,00 (12x de R$ 97)

**Localização:** Linhas 70-73

---

## ❌ **INCONSISTÊNCIAS IDENTIFICADAS**

### **Problema 1: Página de Vendas vs Checkout**

| Item | Página de Vendas | Checkout | Diferença |
|------|------------------|----------|-----------|
| **Mensal** | R$ 297/mês | R$ 97/mês | **R$ 200 de diferença!** |
| **Anual** | 12× R$ 197 = R$ 2.364 | R$ 1.164 | **R$ 1.200 de diferença!** |

### **Problema 2: Payment Gateway vs Checkout**

| Item | Payment Gateway | Checkout | Diferença |
|------|-----------------|----------|-----------|
| **Mensal** | R$ 97,00 | R$ 97,00 | ✅ Igual |
| **Anual** | R$ 970,00 | R$ 1.164,00 | **R$ 194 de diferença!** |

---

## 🎯 **QUAL É O PREÇO REAL?**

### **Análise:**

1. **Página de Vendas mostra:**
   - R$ 297/mês
   - 12× de R$ 197 (anual)

2. **Checkout mostra:**
   - R$ 97/mês
   - R$ 1.164/ano

3. **Payment Gateway usa:**
   - R$ 97/mês
   - R$ 970/ano

### **Conclusão:**

**Há 3 versões diferentes de preços!**

---

## ✅ **RECOMENDAÇÃO**

**Preciso que você confirme qual é o preço REAL que deve ser usado:**

### **Opção A: Preços da Página de Vendas**
- Mensal: **R$ 297/mês**
- Anual: **12× de R$ 197 = R$ 2.364/ano**

### **Opção B: Preços do Checkout Atual**
- Mensal: **R$ 97/mês**
- Anual: **R$ 1.164/ano**

### **Opção C: Preços do Payment Gateway**
- Mensal: **R$ 97/mês**
- Anual: **R$ 970/ano**

---

## 📋 **O QUE PRECISA SER CORRIGIDO**

### **Se a Opção A for a correta (R$ 297/mês e 12× R$ 197):**
1. ✅ Atualizar `payment-gateway.ts` (nutri mensal: 297, anual: 2364)
2. ✅ Atualizar `checkout/page.tsx` (mostrar R$ 297 e 12× R$ 197)
3. ✅ Verificar se página de vendas está correta

### **Se a Opção B for a correta (R$ 97/mês e R$ 1.164/ano):**
1. ✅ Atualizar `payment-gateway.ts` (nutri anual: 1164)
2. ✅ Atualizar página de vendas (mostrar R$ 97 e R$ 1.164)
3. ✅ Checkout já está correto

### **Se a Opção C for a correta (R$ 97/mês e R$ 970/ano):**
1. ✅ Atualizar `checkout/page.tsx` (mostrar R$ 970)
2. ✅ Atualizar página de vendas (mostrar R$ 97 e R$ 970)
3. ✅ Payment Gateway já está correto

---

## 🔍 **DETALHES ENCONTRADOS**

### **Na Página de Vendas:**
- Linha 840: `12× de R$ 197` (Plano Anual)
- Linha 889: `R$ 297 / mês` (Plano Mensal)
- FAQ menciona: "12x R$ 197" e "R$ 297/mês"

### **No Checkout:**
- Linha 181: `price: 97.00` (Mensal)
- Linha 187: `price: 1164.00` (Anual)

### **No Payment Gateway:**
- Linha 71: `monthly: 97.00`
- Linha 72: `annual: 970.00` (comentário: "Atualizado para R$ 970 (12x de R$ 97)")

---

## ⚠️ **IMPACTO**

**Se o usuário:**
1. Vê R$ 297/mês na página de vendas
2. Clica em "Escolher Plano Mensal"
3. Vai para checkout e vê R$ 97/mês
4. **Resultado:** Confusão e possível abandono

**OU:**

1. Vê 12× de R$ 197 na página de vendas
2. Clica em "Escolher Plano Anual"
3. Vai para checkout e vê R$ 1.164 (ou R$ 970)
4. **Resultado:** Confusão e possível abandono

---

## 🎯 **PRÓXIMOS PASSOS**

**Aguardando confirmação dos preços reais para:**
1. Alinhar página de vendas
2. Alinhar checkout
3. Alinhar payment-gateway
4. Garantir coerência em todo o fluxo

---

**Última atualização:** 16/12/2025


