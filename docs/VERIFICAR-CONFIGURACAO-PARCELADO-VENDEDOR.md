# 🔍 VERIFICAR CONFIGURAÇÃO PARCELADO VENDEDOR - MERCADO PAGO

## 🎯 PROBLEMA

**Situação:**
- ✅ Painel do Mercado Pago: 12x habilitado para "Parcelado vendedor"
- ❌ Checkout: Mostra 12x de R$ 58,49 (com juros) em vez de R$ 47,90 (sem juros)

**Causa possível:**
- Diferença entre configurações de **"Checkout"** e **"Link de pagamento"**
- O código usa **Preference API** que pode estar usando configuração diferente

---

## ✅ VERIFICAÇÃO PASSO A PASSO

### PASSO 1: Verificar Configuração de "Link de Pagamento"

O código usa **Preference API**, que está relacionado a **"Link de pagamento"**, não "Checkout".

1. Acesse: https://www.mercadopago.com.br/
2. Vá em: **"Seu Negócio"** → **"Custos"** → **"Cobrar"** → **"Link de pagamento"**
3. Clique na aba **"Parcelamento"**
4. Verifique se **"Parcelado vendedor"** está habilitado
5. **IMPORTANTE:** Verifique se **12x** está habilitado especificamente para **"Link de pagamento"**

---

### PASSO 2: Verificar Diferença entre "Checkout" e "Link de Pagamento"

O Mercado Pago tem **configurações separadas** para:
- **"Checkout"** (Checkout Pro tradicional)
- **"Link de pagamento"** (Preference API - o que estamos usando)

**Verificar ambas:**

1. **Checkout:**
   - "Seu Negócio" → "Custos" → "Cobrar" → **"Checkout"** → "Parcelamento"
   - Verificar se 12x está habilitado

2. **Link de Pagamento:**
   - "Seu Negócio" → "Custos" → "Cobrar" → **"Link de pagamento"** → "Parcelamento"
   - **VERIFICAR AQUI TAMBÉM** - esta é a que o código usa!

---

### PASSO 3: Verificar Valor Mínimo

Na configuração de "Link de pagamento" → "Parcelamento", verifique:

1. Se há **"Configure valores mínimos para parcelado vendedor"**
2. Verifique se R$ 574,80 está acima do mínimo para 12x
3. Verifique se há alguma restrição por valor

---

### PASSO 4: Verificar se Está Usando a Configuração Correta

O Mercado Pago pode ter diferentes configurações para:
- **Checkout Pro** (checkout hospedado)
- **Preference API** (link de pagamento)

**O código usa Preference API**, então precisa verificar especificamente a configuração de **"Link de pagamento"**.

---

## 🔧 SOLUÇÃO: Garantir Configuração Correta

### Opção 1: Habilitar 12x em "Link de Pagamento"

1. Acesse: **"Seu Negócio"** → **"Custos"** → **"Cobrar"** → **"Link de pagamento"** → **"Parcelamento"**
2. Na seção **"Parcelado vendedor"**, clique em **"Oferecer >"**
3. **Habilite 12x** especificamente para "Link de pagamento"
4. Salve e aguarde alguns minutos

### Opção 2: Verificar se Há Configuração Separada

Algumas contas do Mercado Pago têm configurações separadas:
- Uma para "Checkout" (Checkout Pro)
- Outra para "Link de pagamento" (Preference API)

**Certifique-se de configurar AMBAS.**

---

## 🧪 TESTE

Após configurar:

1. Crie um novo checkout para plano anual (R$ 574,80)
2. No checkout do Mercado Pago, escolha **"Cartão de crédito"**
3. Verifique as opções de parcelamento:
   - ✅ Deve aparecer **12x R$ 47,90** (sem juros)
   - ❌ NÃO deve aparecer **12x R$ 58,49** (com juros)

---

## 📝 NOTA IMPORTANTE

**O código está correto** - ele envia `installments: 12` corretamente.

**O problema é que:**
- O Mercado Pago pode ter configurações separadas para "Checkout" e "Link de pagamento"
- Você configurou em "Checkout", mas o código usa "Link de pagamento"
- Precisa habilitar 12x especificamente em **"Link de pagamento"**

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código** | ✅ Correto (envia installments: 12) |
| **Painel - Checkout** | ✅ 12x habilitado |
| **Painel - Link de Pagamento** | ❓ **VERIFICAR AQUI** |
| **Resultado** | ❌ Ainda mostra com juros |

**Ação:** Verificar e habilitar 12x especificamente em **"Link de pagamento"** → **"Parcelamento"** → **"Parcelado vendedor"**.

---

**Última atualização:** Janeiro 2025
