# 🔍 PARCELAMENTO: DIFERENÇA ENTRE PRODUÇÃO E TESTE

## 🎯 PROBLEMA IDENTIFICADO

- ✅ **Modo TESTE:** Parcelamento aparecia
- ❌ **Modo PRODUÇÃO:** Parcelamento não aparece

Isso indica que as **configurações de produção** são diferentes das de teste.

---

## 🔍 CAUSA PROVÁVEL

As configurações de parcelamento no painel do Mercado Pago são **separadas** para:
- **Credenciais de TESTE** (sandbox)
- **Credenciais de PRODUÇÃO** (live)

Você precisa configurar o parcelamento **especificamente para produção**.

---

## ✅ SOLUÇÃO: CONFIGURAR PARCELAMENTO EM PRODUÇÃO

### Passo 1: Acessar Configurações de Produção

1. Acesse: https://www.mercadopago.com.br/
2. Faça login na sua conta
3. Vá em **"Seu Negócio"** → **"Custos"** → **"Configurar parcelamento"**

### Passo 2: Verificar se está na conta de PRODUÇÃO

⚠️ **IMPORTANTE:** Certifique-se de que está configurando na conta de **PRODUÇÃO**, não na de teste.

**Como verificar:**
- No painel, verifique se está usando credenciais de **PRODUÇÃO** (APP_USR-...)
- Não deve estar em modo "Teste" ou "Sandbox"

### Passo 3: Habilitar Parcelamento para Produção

1. Na seção de parcelamento, verifique se há **duas configurações:**
   - Uma para **TESTE**
   - Uma para **PRODUÇÃO**

2. Configure o parcelamento para **PRODUÇÃO:**
   - ✅ Habilite **"Parcelado cliente"** (com juros)
   - ✅ Defina **número máximo de parcelas: 12**
   - ⚠️ **NÃO habilite** "Parcelado vendedor" (sem juros)

3. **Salve** as alterações

### Passo 4: Verificar Credenciais de Produção

Verifique se o código está usando credenciais de **PRODUÇÃO**:

**No `.env.local` ou Vercel:**
```env
# PRODUÇÃO (deve começar com APP_USR-)
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx

# TESTE (começa com TEST-)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
```

**No código (`src/lib/mercado-pago.ts`):**
```typescript
const isTest = process.env.NODE_ENV !== 'production'
```

Se `NODE_ENV=production`, deve usar `MERCADOPAGO_ACCESS_TOKEN_LIVE`.

---

## 🔍 VERIFICAÇÃO

### Como verificar se está usando produção:

1. **Verificar variáveis de ambiente:**
   - No Vercel: Settings → Environment Variables
   - Verifique se `MERCADOPAGO_ACCESS_TOKEN_LIVE` está configurado
   - Verifique se `NODE_ENV=production`

2. **Verificar logs do servidor:**
   - Deve aparecer: `🧪 Modo teste: false`
   - Se aparecer `true`, está usando credenciais de teste

3. **Verificar URL do checkout:**
   - Produção: `https://www.mercadopago.com.br/checkout/v1/payment/...`
   - Teste: `https://sandbox.mercadopago.com.br/...` (ou similar)

---

## 📋 CHECKLIST

- [ ] Está usando credenciais de **PRODUÇÃO** (APP_USR-...)
- [ ] `NODE_ENV=production` no Vercel
- [ ] Parcelamento configurado para **PRODUÇÃO** no painel
- [ ] "Parcelado cliente" habilitado (não "Parcelado vendedor")
- [ ] Número máximo de parcelas: 12x
- [ ] Configurações salvas no painel

---

## 🎯 DIFERENÇA ENTRE TESTE E PRODUÇÃO

| Item | TESTE | PRODUÇÃO |
|------|-------|----------|
| **Credenciais** | `TEST-...` | `APP_USR-...` |
| **Configurações** | Separadas | Separadas |
| **Parcelamento** | Pode aparecer | Precisa configurar |
| **Painel** | Sandbox | Produção |

---

## ⚠️ IMPORTANTE

As configurações de parcelamento são **independentes** para teste e produção. Se funcionou em teste, você precisa **configurar novamente para produção**.

---

**Última atualização:** Janeiro 2025

