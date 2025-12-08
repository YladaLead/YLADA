# 🔍 DIAGNÓSTICO: Parcelamento 12x não está aparecendo

## ✅ VERIFICAÇÃO DO CÓDIGO

### 1. Valores estão CORRETOS ✅
- **Plano Anual:** R$ 574,80 (12x de R$ 47,90)
- **Código:** `src/lib/payment-gateway.ts` linha 68
- **Status:** ✅ Valores corretos (NÃO foram alterados para os novos preços de 10/10)

### 2. Parcelamento está CONFIGURADO ✅
- **Código:** `maxInstallments: 12` (linha 283 de `payment-gateway.ts`)
- **Tipo:** Preference (pagamento único) - permite parcelamento
- **Status:** ✅ Configuração correta no código

### 3. Tipo de Pagamento está CORRETO ✅
- **Plano Anual:** Usa `createPreference()` (pagamento único)
- **Permite:** PIX, Boleto e Cartão com parcelamento
- **Status:** ✅ Tipo correto

---

## ❌ PROBLEMA IDENTIFICADO

O código está **100% correto**. O problema está na **configuração do painel do Mercado Pago**.

---

## 🔧 SOLUÇÃO: Configurar Parcelamento VENDEDOR no Painel do Mercado Pago

**IMPORTANTE:** Você está usando **"Parcelado Vendedor"** (sem juros para o cliente), o que significa:
- ✅ Cliente paga **12x de R$ 47,90 = R$ 574,80 SEM JUROS**
- ⚠️ **Você (vendedor) absorve as taxas** de parcelamento (~15% para 12x)
- ⚠️ Você recebe menos que R$ 574,80 líquido (aproximadamente R$ 488,58)

### PASSO 1: Acessar Configurações

1. Acesse: https://www.mercadopago.com.br/
2. Faça login na sua conta
3. Vá em **"Seu Negócio"** (menu lateral)
4. Clique em **"Custos"** ou **"Configurações"**

### PASSO 2: Habilitar Parcelamento VENDEDOR

1. Procure por **"Checkout"** ou **"Formas de pagamento"**
2. Clique em **"Configurar parcelamento"** ou **"Parcelamento"**
3. Você verá duas opções:
   - **"Oferecer parcelado vendedor"** (você absorve taxas) ✅ **HABILITAR ESTA**
   - **"Parcelado cliente"** (cliente paga juros) ❌ Desabilitar ou manter desabilitado

### PASSO 3: Configurar Parcelamento Vendedor

**Configuração correta:**
- ✅ **Habilitar** "Oferecer parcelado vendedor"
- ✅ **Definir número máximo de parcelas:** 12x
- ✅ **Valor mínimo por parcela:** R$ 5,00 (padrão)
- ✅ **Configurar para 12x sem juros**

**Como funciona:**
- Cliente escolhe: **À vista** (R$ 574,80) ou **Parcelado** (12x de R$ 47,90 SEM JUROS)
- Cliente paga **sem juros** (12x de R$ 47,90 = R$ 574,80)
- **Você recebe menos** que R$ 574,80 líquido (aproximadamente R$ 488,58 após taxas)

### PASSO 4: Salvar e Verificar

1. Clique em **"Salvar"** ou **"Aplicar"**
2. Aguarde alguns minutos para as alterações entrarem em vigor
3. Teste criando um novo checkout

---

## 🧪 COMO TESTAR

### Teste 1: Verificar no Checkout

1. Crie um checkout para plano anual
2. Escolha **"Cartão de crédito"** no checkout do Mercado Pago
3. **Verifique se aparecem opções de parcelamento** (1x, 2x, 3x... até 12x)

### Teste 2: Verificar Logs

Ao criar checkout, verifique os logs do servidor:
```
💳 Criando pagamento único (Preference) para plano anual - PIX/Boleto/Cartão com parcelamento
📤 Enviando preferência para Mercado Pago:
  installments: 12
```

Se aparecer `installments: 12`, o código está enviando corretamente.

---

## ⚠️ POSSÍVEIS CAUSAS SE AINDA NÃO FUNCIONAR

### 1. Conta em Modo Teste (Sandbox)
- No sandbox, parcelamento pode não aparecer
- **Solução:** Teste com credenciais de PRODUÇÃO

### 2. Valor Mínimo não Atingido
- Mercado Pago pode exigir valor mínimo por parcela
- **Valor atual:** R$ 574,80 ÷ 12 = R$ 47,90 por parcela
- **Verificar:** Se R$ 47,90 está acima do mínimo (geralmente R$ 5,00)

### 3. Tipo de Cartão
- Parcelamento funciona apenas com **cartão de crédito**
- **Cartões de débito** não oferecem parcelamento
- **Verificar:** Cliente está usando cartão de crédito?

### 4. Configuração por Produto
- Algumas contas têm configuração de parcelamento por produto
- **Verificar:** Se há configuração específica para o produto "YLADA Wellness"

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Parcelamento **"Parcelado VENDEDOR"** está habilitado no painel
- [ ] Número máximo de parcelas: 12x
- [ ] Valor mínimo por parcela: R$ 5,00 ou menos
- [ ] Configuração de "sem juros" está ativa
- [ ] Configuração salva e aplicada
- [ ] Testado com cartão de crédito (não débito)
- [ ] Testado em PRODUÇÃO (não sandbox)
- [ ] Logs mostram `installments: 12`

---

## 💡 NOTA IMPORTANTE SOBRE VALORES

**Os valores estão CORRETOS e NÃO foram alterados:**
- ✅ Plano Anual: R$ 574,80 (12x de R$ 47,90)
- ✅ Valores novos (R$ 97,00 mensal / R$ 59,90/mês anual) só entram em vigor a partir de 10/10
- ✅ Até lá, os valores atuais permanecem

**O problema NÃO é o valor, é a configuração do parcelamento no painel do Mercado Pago.**

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código** | ✅ Correto (installments: 12) |
| **Valores** | ✅ Corretos (R$ 574,80 = 12x de R$ 47,90) |
| **Tipo de Pagamento** | ✅ Correto (Preference) |
| **Tipo de Parcelamento** | ✅ **Parcelado VENDEDOR** (sem juros para cliente) |
| **Configuração no Painel** | ❌ **PRECISA HABILITAR** |

**Ação necessária:** Habilitar **"Oferecer parcelado vendedor"** no painel do Mercado Pago com 12 parcelas máximas e "sem juros".

**⚠️ IMPORTANTE:** Com parcelado vendedor, você absorve as taxas (~15% para 12x). Você receberá aproximadamente R$ 488,58 líquido de R$ 574,80.
