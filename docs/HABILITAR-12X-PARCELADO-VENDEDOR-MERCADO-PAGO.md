# 🔧 HABILITAR 12x PARCELADO VENDEDOR (SEM JUROS) - MERCADO PAGO

## 🎯 PROBLEMA IDENTIFICADO

**Situação atual:**
- ❌ No painel do Mercado Pago, "Parcelado vendedor" só mostra até **10x**
- ❌ Quando cliente escolhe 12x, aparece **R$ 58,49** (com juros do cliente)
- ✅ Deveria aparecer **R$ 47,90** (sem juros, parcelado pelo vendedor)

**Causa:**
- A opção de **12x sem juros** não está habilitada no painel do Mercado Pago
- Quando não há 12x sem juros configurado, o Mercado Pago usa "Parcelado cliente" (com juros) automaticamente

---

## ✅ SOLUÇÃO: HABILITAR 12x NO PAINEL

### PASSO 1: Acessar Configurações de Parcelamento

1. Acesse: https://www.mercadopago.com.br/
2. Faça login na sua conta
3. Vá em **"Seu Negócio"** (menu lateral esquerdo)
4. Clique em **"Custos"** ou **"Taxas e parcelas"**
5. Vá em **"Cobrar"** → **"Link de pagamento"**
6. Clique na aba **"Parcelamento"**

---

### PASSO 2: Habilitar 12x para Parcelado Vendedor

1. Na seção **"Parcelado vendedor"**, clique em **"Oferecer >"**
2. Você verá uma lista de opções de parcelas (2x, 3x, 4x... até 10x)
3. **PROCURE por uma opção para adicionar mais parcelas** ou **"Configurar"**
4. **Habilite a opção de 12x** (pode estar em configurações avançadas)

**Se não aparecer a opção de 12x diretamente:**

1. Procure por **"Configurações avançadas"** ou **"Mais opções"**
2. Ou procure por **"Personalizar parcelas"** ou **"Adicionar parcelas"**
3. Adicione manualmente a opção de **12x**

---

### PASSO 3: Verificar Taxa de 12x

Após habilitar 12x, você verá a taxa correspondente:
- **12x:** ~15-17% (taxa aproximada)

**Importante:**
- Com 12x sem juros, você receberá aproximadamente **R$ 488,58** líquido de R$ 574,80
- O cliente pagará **12x de R$ 47,90 = R$ 574,80** (sem juros)
- Você absorve a taxa de ~15%

---

### PASSO 4: Salvar e Verificar

1. Clique em **"Salvar"** ou **"Aplicar"**
2. Aguarde alguns minutos para as alterações entrarem em vigor
3. Teste criando um novo checkout

---

## 🧪 COMO VERIFICAR SE FUNCIONOU

### Teste 1: Verificar no Painel

1. Volte para **"Taxas e parcelas"** → **"Link de pagamento"** → **"Parcelamento"**
2. Verifique se **12x** aparece na lista de "Parcelado vendedor"
3. Deve mostrar algo como: **12x: ~15-17%**

### Teste 2: Criar Checkout de Teste

1. Crie um checkout para plano anual (R$ 574,80)
2. No checkout do Mercado Pago, escolha **"Cartão de crédito"**
3. Verifique as opções de parcelamento:
   - ✅ Deve aparecer **12x R$ 47,90** (sem juros)
   - ❌ NÃO deve aparecer **12x R$ 58,49** (com juros)

---

## ⚠️ SE NÃO APARECER A OPÇÃO DE 12x

### Alternativa 1: Contatar Suporte do Mercado Pago

Se não conseguir habilitar 12x pelo painel:
1. Entre em contato com o suporte do Mercado Pago
2. Solicite habilitação de **12x sem juros** para "Parcelado vendedor"
3. Informe que você precisa oferecer 12x de R$ 47,90 sem juros

### Alternativa 2: Verificar Limitações da Conta

Algumas contas do Mercado Pago podem ter limitações:
- Contas novas podem ter limite menor de parcelas
- Verifique se sua conta permite até 12x sem juros
- Pode ser necessário aumentar o volume de vendas primeiro

### Alternativa 3: Usar 10x Temporariamente

Se não conseguir 12x imediatamente:
- Configure **10x de R$ 57,48 = R$ 574,80** (sem juros)
- Isso funciona enquanto não habilita 12x

---

## 📊 COMPARAÇÃO DE VALORES

| Configuração | Parcela | Total | Juros | Status |
|--------------|---------|-------|-------|--------|
| **Atual (com juros)** | R$ 58,49 | R$ 701,88 | Cliente paga | ❌ Errado |
| **Desejado (sem juros)** | R$ 47,90 | R$ 574,80 | Vendedor paga | ✅ Correto |
| **Alternativa (10x)** | R$ 57,48 | R$ 574,80 | Vendedor paga | ⚠️ Temporário |

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código** | ✅ Correto (envia installments: 12) |
| **Valor** | ✅ Correto (R$ 574,80) |
| **Painel - 12x habilitado** | ❌ **PRECISA HABILITAR** |
| **Resultado esperado** | ✅ 12x de R$ 47,90 (sem juros) |

---

## 📝 NOTAS IMPORTANTES

1. **O código não precisa ser alterado** - já está enviando `installments: 12` corretamente
2. **O problema é 100% no painel do Mercado Pago** - precisa habilitar 12x para "Parcelado vendedor"
3. **Se não conseguir habilitar 12x**, contate o suporte do Mercado Pago
4. **A taxa de ~15% para 12x é normal** - você absorve essa taxa para oferecer sem juros ao cliente

---

**Última atualização:** Janeiro 2025
