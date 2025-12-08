# 📋 RESUMO: Problema Checkout Parcelado Vendedor

## 🎯 SITUAÇÃO ATUAL

**Problema:**
- Checkout mostra **12x de R$ 58,49** (com juros do cliente)
- Deveria mostrar **12x de R$ 47,90** (sem juros, parcelado pelo vendedor)
- Valor total: **R$ 574,80** ✅ (correto)

---

## ✅ VERIFICAÇÃO DO CÓDIGO

### Código está CORRETO ✅

**Arquivos verificados:**
- ✅ `src/lib/mercado-pago.ts` - Envia `installments: 12` corretamente
- ✅ `src/lib/payment-gateway.ts` - Envia `maxInstallments: 12` corretamente
- ✅ `src/app/pt/wellness/checkout/page.tsx` - Exibe valores corretos
- ✅ `src/app/pt/wellness/page.tsx` - Exibe valores corretos

**Valores no código:**
- ✅ Valor anual: R$ 574,80 (correto)
- ✅ Parcelas: 12x (correto)
- ✅ Valor por parcela esperado: R$ 47,90 (correto)

---

## 🔍 CAUSA DO PROBLEMA

**O problema NÃO está no código** - está na **configuração do painel do Mercado Pago**.

### Como funciona:

1. **Código envia:** `installments: 12` (número máximo de parcelas)
2. **Mercado Pago verifica:** Configuração do painel para tipo de parcelamento
3. **Se "Parcelado vendedor" 12x NÃO estiver habilitado:**
   - Mercado Pago usa automaticamente "Parcelado cliente" (com juros)
   - Resultado: 12x de R$ 58,49 (cliente paga juros)

4. **Se "Parcelado vendedor" 12x ESTIVER habilitado:**
   - Mercado Pago usa "Parcelado vendedor" (sem juros)
   - Resultado: 12x de R$ 47,90 (você absorve taxa de ~15%)

---

## 🔧 SOLUÇÃO: Configurar no Painel do Mercado Pago

### PASSO 1: Acessar Configurações

1. Acesse: https://www.mercadopago.com.br/
2. Login → **"Seu Negócio"** → **"Custos"** → **"Cobrar"** → **"Link de pagamento"**
3. Aba **"Parcelamento"**

### PASSO 2: Habilitar 12x Parcelado Vendedor

1. Na seção **"Parcelado vendedor"**, verifique se está **ATIVADO** (toggle azul)
2. Verifique se **12x** está na lista de parcelas
3. Se não estiver, procure por **"Configurar"** ou **"Adicionar parcelas"**
4. Adicione/habilite **12x** para "Parcelado vendedor"

**Taxa esperada:** ~15-17% (você absorve essa taxa)

### PASSO 3: Salvar e Testar

1. Clique em **"Salvar"**
2. Aguarde alguns minutos
3. Crie um novo checkout e teste

---

## 📊 COMPARAÇÃO

| Configuração | Parcela | Total | Juros | Status |
|--------------|---------|-------|-------|--------|
| **Atual (com juros)** | R$ 58,49 | R$ 701,88 | Cliente paga | ❌ Errado |
| **Desejado (sem juros)** | R$ 47,90 | R$ 574,80 | Vendedor paga | ✅ Correto |

---

## ⚠️ IMPORTANTE

1. **O código NÃO precisa ser alterado** ✅
2. **O problema é 100% no painel do Mercado Pago** ⚠️
3. **Se não conseguir habilitar 12x**, contate o suporte do Mercado Pago
4. **A taxa de ~15-17% é normal** - você absorve para oferecer sem juros

---

**Última atualização:** Janeiro 2025
