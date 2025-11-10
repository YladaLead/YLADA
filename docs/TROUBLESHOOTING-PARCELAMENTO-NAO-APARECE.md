# 🔍 TROUBLESHOOTING: PARCELAMENTO NÃO APARECE NO PLANO ANUAL

## ✅ CONFIRMAÇÃO: CÓDIGO ESTÁ CORRETO

O plano anual está usando **Preference (pagamento único)**, não Preapproval (recorrente):
- ✅ `isRecurring: false` (linha 259)
- ✅ Usa `createPreference()` (linha 247)
- ✅ Não usa `createRecurringSubscription()`

**O código está correto!** O problema está na configuração do Mercado Pago.

---

## 🔍 POSSÍVEIS CAUSAS

### 1. **Modo TESTE (Sandbox)** ⚠️

No ambiente de **sandbox/teste**, o parcelamento pode não aparecer mesmo estando configurado.

**Solução:**
- Teste com credenciais de **PRODUÇÃO** (se disponível)
- Ou aguarde até estar em produção para testar

---

### 2. **Parcelamento não configurado no painel** ⚠️

O parcelamento precisa estar habilitado no painel do Mercado Pago.

**Verificar:**
1. Acesse: https://www.mercadopago.com.br/
2. Vá em **"Seu Negócio"** → **"Custos"** → **"Configurar parcelamento"**
3. Verifique se **"Parcelado cliente"** está habilitado
4. Verifique o **número máximo de parcelas** (deve ser pelo menos 12x)

---

### 3. **Valor mínimo não atingido** ⚠️

O Mercado Pago pode exigir um valor mínimo para oferecer parcelamento.

**Verificar:**
- Valor atual: R$ 574,80
- Geralmente o mínimo é R$ 50,00
- R$ 574,80 deve ser suficiente, mas verifique no painel

---

### 4. **Tipo de cartão** ⚠️

Parcelamento geralmente funciona apenas com **cartões de crédito**, não débito.

**Verificar:**
- Cliente está usando cartão de **crédito**?
- Cartões de débito não oferecem parcelamento

---

### 5. **Configuração de parcelamento desabilitada** ⚠️

Pode estar desabilitado nas configurações da conta.

**Verificar no painel:**
1. **"Seu Negócio"** → **"Configurações"**
2. **"Formas de pagamento"** → **"Cartão de crédito"**
3. Verifique se parcelamento está habilitado

---

## 🧪 COMO TESTAR

### Passo 1: Verificar logs do servidor

Ao criar o checkout, verifique os logs:
```
💳 Criando pagamento único (Preference) para plano anual
✅ Preference anual Mercado Pago criada: [ID]
```

Se aparecer "Preapproval" em vez de "Preference", há um problema no código.

### Passo 2: Verificar no checkout do Mercado Pago

1. Crie um checkout para o plano anual
2. Escolha **"Cartão de crédito"**
3. Preencha os dados do cartão
4. **Procure por opções de parcelamento** na tela de confirmação

### Passo 3: Verificar URL do checkout

A URL deve ser:
- ✅ `https://www.mercadopago.com.br/checkout/v1/payment/...` (Preference)
- ❌ `https://www.mercadopago.com.br/checkout/v1/subscription/...` (Preapproval)

---

## 🔧 SOLUÇÕES

### Solução 1: Habilitar parcelamento no painel

1. Acesse o painel do Mercado Pago
2. **"Seu Negócio"** → **"Custos"** → **"Configurar parcelamento"**
3. Habilite **"Parcelado cliente"** (com juros)
4. Defina **número máximo de parcelas: 12**
5. **Salve** as alterações
6. Aguarde alguns minutos para aplicar

### Solução 2: Verificar configurações da conta

1. **"Seu Negócio"** → **"Configurações"**
2. **"Formas de pagamento"**
3. Verifique se **cartão de crédito** está habilitado
4. Verifique se **parcelamento** está habilitado

### Solução 3: Testar em produção

Se estiver em modo teste, o parcelamento pode não aparecer. Teste com credenciais de produção.

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Código está usando Preference (não Preapproval)
- [ ] Parcelamento está habilitado no painel do Mercado Pago
- [ ] "Parcelado cliente" está habilitado (não "Parcelado vendedor")
- [ ] Número máximo de parcelas é pelo menos 12x
- [ ] Valor é suficiente (R$ 574,80)
- [ ] Está testando com cartão de crédito (não débito)
- [ ] Está em produção (não sandbox) ou testando com credenciais de produção

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código (Preference)** | ✅ Correto |
| **Configuração no Painel** | ⚠️ Verificar |
| **Modo Teste/Produção** | ⚠️ Pode afetar |
| **Tipo de Cartão** | ⚠️ Deve ser crédito |

---

## 📚 PRÓXIMOS PASSOS

1. **Verificar configuração no painel** do Mercado Pago
2. **Habilitar parcelamento** se não estiver habilitado
3. **Testar em produção** (se possível)
4. **Verificar logs** do servidor para confirmar que está usando Preference

---

**Última atualização:** Janeiro 2025

