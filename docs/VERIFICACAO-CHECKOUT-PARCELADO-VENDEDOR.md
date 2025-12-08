# 🔍 VERIFICAÇÃO: Checkout Parcelado Vendedor (12x sem juros)

## 🎯 PROBLEMA ATUAL

**Situação:**
- ❌ Checkout mostra **12x de R$ 58,49** (com juros do cliente)
- ✅ Deveria mostrar **12x de R$ 47,90** (sem juros, parcelado pelo vendedor)
- ✅ Valor total: **R$ 574,80** (correto)

**Causa:**
- O código está enviando `installments: 12` corretamente
- O problema é que o **painel do Mercado Pago** precisa ter **"Parcelado vendedor"** habilitado para **12x**
- Se não estiver habilitado, o Mercado Pago usa automaticamente "Parcelado cliente" (com juros)

---

## ✅ VERIFICAÇÃO DO CÓDIGO

### 1. Código está correto ✅

**Arquivo:** `src/lib/mercado-pago.ts` (linha 163)
```typescript
installments: request.maxInstallments || (request.planType === 'annual' ? 12 : 1),
```

**Arquivo:** `src/lib/payment-gateway.ts` (linha 283)
```typescript
maxInstallments: 12, // Plano anual/formação: permite parcelamento até 12x
```

**Status:** ✅ O código está enviando `installments: 12` corretamente

---

## 🔧 SOLUÇÃO: Configurar no Painel do Mercado Pago

### PASSO 1: Acessar Configurações

1. Acesse: https://www.mercadopago.com.br/
2. Faça login
3. Vá em **"Seu Negócio"** → **"Custos"** → **"Cobrar"** → **"Link de pagamento"**
4. Clique na aba **"Parcelamento"**

### PASSO 2: Habilitar 12x Parcelado Vendedor

1. Na seção **"Parcelado vendedor"**, verifique se está **ATIVADO** (toggle azul)
2. Verifique se **12x** está na lista de parcelas disponíveis
3. Se não estiver, procure por **"Configurar"** ou **"Adicionar parcelas"**
4. Adicione/habilite **12x** para "Parcelado vendedor"

**Taxa esperada para 12x:** ~15-17% (você absorve essa taxa)

### PASSO 3: Verificar Configuração

Após habilitar, você deve ver:
- ✅ **12x** na lista de "Parcelado vendedor"
- ✅ Taxa de ~15-17% ao lado de 12x
- ✅ Status: **ATIVO**

---

## 🧪 TESTE APÓS CONFIGURAR

1. Crie um novo checkout para plano anual (R$ 574,80)
2. No checkout do Mercado Pago, escolha **"Cartão de crédito"**
3. Verifique as opções de parcelamento:
   - ✅ Deve aparecer **12x R$ 47,90** (sem juros)
   - ❌ NÃO deve aparecer **12x R$ 58,49** (com juros)

---

## ⚠️ IMPORTANTE

1. **O código NÃO precisa ser alterado** - já está correto
2. **O problema é 100% no painel do Mercado Pago** - precisa habilitar 12x para "Parcelado vendedor"
3. **Se não conseguir habilitar 12x**, contate o suporte do Mercado Pago
4. **A taxa de ~15-17% é normal** - você absorve essa taxa para oferecer sem juros ao cliente

---

## 📊 COMPARAÇÃO

| Configuração | Parcela | Total | Juros | Status |
|--------------|---------|-------|-------|--------|
| **Atual (com juros)** | R$ 58,49 | R$ 701,88 | Cliente paga | ❌ Errado |
| **Desejado (sem juros)** | R$ 47,90 | R$ 574,80 | Vendedor paga | ✅ Correto |

---

**Última atualização:** Janeiro 2025
