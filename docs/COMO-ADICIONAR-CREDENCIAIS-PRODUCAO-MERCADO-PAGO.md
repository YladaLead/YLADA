# 🔑 COMO ADICIONAR CREDENCIAIS DE PRODUÇÃO MERCADO PAGO

## 📋 CREDENCIAIS DA IMAGEM

Baseado na imagem que você mostrou, aqui estão as credenciais de produção:

### **1. Public Key:**
```
APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
```

### **2. Access Token:**
```
APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
```

### **3. Client ID:**
```
6484673849752001
```

### **4. Client Secret:**
```
9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5
```

---

## ✅ COMO ADICIONAR NO `.env.local`

### **1. Abrir arquivo `.env.local`**

No diretório raiz do projeto, abra ou crie o arquivo `.env.local`

### **2. Adicionar as variáveis:**

```env
# Mercado Pago - Produção
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
MERCADOPAGO_CLIENT_ID=6484673849752001
MERCADOPAGO_CLIENT_SECRET=9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5

# Mercado Pago - Webhook Secret (se tiver)
MERCADOPAGO_WEBHOOK_SECRET_LIVE=b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
```

### **3. Manter credenciais de teste (opcional):**

Se quiser manter as de teste também:

```env
# Mercado Pago - Teste (sandbox)
MERCADOPAGO_ACCESS_TOKEN_TEST=TEST-SEU_TOKEN_DE_TESTE
MERCADOPAGO_PUBLIC_KEY_TEST=TEST-SUA_PUBLIC_KEY_DE_TESTE
MERCADOPAGO_WEBHOOK_SECRET_TEST=seu_webhook_secret_de_teste

# Mercado Pago - Produção
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
MERCADOPAGO_CLIENT_ID=6484673849752001
MERCADOPAGO_CLIENT_SECRET=9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5
MERCADOPAGO_WEBHOOK_SECRET_LIVE=b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
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

