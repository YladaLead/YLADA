# 🔑 COMO ADICIONAR CREDENCIAIS DE PRODUÇÃO MERCADO PAGO

## 📋 CREDENCIAIS DA IMAGEM

Baseado na imagem que você mostrou, aqui estão as credenciais de produção:

### **1. Public Key:**
```
APP_USR-xxxxxxxxxxxxx
```

### **2. Access Token:**
```
APP_USR-xxxxxxxxxxxxx
```

### **3. Client ID:**
```
xxxxxxxxxxxxx
```

### **4. Client Secret:**
```
xxxxxxxxxxxxx
```

⚠️ **IMPORTANTE:** Substitua os `xxxxxxxxxxxxx` pelas suas credenciais reais do painel do Mercado Pago.

---

## ✅ COMO ADICIONAR NO `.env.local`

### **1. Abrir arquivo `.env.local`**

No diretório raiz do projeto, abra ou crie o arquivo `.env.local`

### **2. Adicionar as variáveis:**

```env
# Mercado Pago - Produção
# ⚠️ NUNCA COMMITE ESTAS CREDENCIAIS NO GIT!
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_CLIENT_ID=xxxxxxxxxxxxx
MERCADOPAGO_CLIENT_SECRET=xxxxxxxxxxxxx

# Mercado Pago - Webhook Secret (se tiver)
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx
```

### **3. Manter credenciais de teste (opcional):**

Se quiser manter as de teste também:

```env
# Mercado Pago - Teste (sandbox)
MERCADOPAGO_ACCESS_TOKEN_TEST=TEST-SEU_TOKEN_DE_TESTE
MERCADOPAGO_PUBLIC_KEY_TEST=TEST-SUA_PUBLIC_KEY_DE_TESTE
MERCADOPAGO_WEBHOOK_SECRET_TEST=seu_webhook_secret_de_teste

# Mercado Pago - Produção
# ⚠️ NUNCA COMMITE ESTAS CREDENCIAIS NO GIT!
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_CLIENT_ID=xxxxxxxxxxxxx
MERCADOPAGO_CLIENT_SECRET=xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx
```

---

## ⚠️ IMPORTANTE

1. **NÃO commitar `.env.local`** no Git (já deve estar no `.gitignore`)
2. **Copiar exatamente** os valores (sem espaços extras)
3. **Não adicionar aspas** ao redor dos valores
4. **Salvar o arquivo** após adicionar

---

## 🔄 APÓS ADICIONAR

1. **Reiniciar o servidor** (se estiver rodando):
   ```bash
   # Parar o servidor (Ctrl+C)
   npm run dev
   ```

2. **Adicionar na Vercel também:**
   - Settings → Environment Variables
   - Adicionar as mesmas variáveis
   - Fazer redeploy

---

## 🧪 TESTAR

Após adicionar, o código vai usar automaticamente as credenciais de produção quando `NODE_ENV === 'production'`.

---

**Última atualização:** Janeiro 2025

