# 🔑 ADICIONAR CREDENCIAIS DE PRODUÇÃO NO .env.local

## 📋 CREDENCIAIS DA SUA IMAGEM

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

### **5. Webhook Secret (da configuração anterior):**
```
b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
```

---

## ✅ COMO ADICIONAR NO `.env.local`

### **1. Abrir o arquivo `.env.local`**

No diretório raiz do projeto (`/Users/air/ylada-app`), abra o arquivo `.env.local`

### **2. Adicionar/Atualizar as seguintes linhas:**

```env
# MERCADO PAGO - PRODUÇÃO
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
MERCADOPAGO_CLIENT_ID=6484673849752001
MERCADOPAGO_CLIENT_SECRET=9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5
MERCADOPAGO_WEBHOOK_SECRET_LIVE=b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
```

### **3. Exemplo completo da seção Mercado Pago no `.env.local`:**

```env
# MERCADO PAGO (Brasil)
# ⚠️ Obtenha essas credenciais em: https://www.mercadopago.com.br/developers/panel
# Veja o guia completo em: docs/GUIA-CONFIGURACAO-MERCADO-PAGO.md

# TESTE (Desenvolvimento - Sandbox)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxx

# PRODUÇÃO (Quando estiver pronto para receber pagamentos reais)
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
MERCADOPAGO_CLIENT_ID=6484673849752001
MERCADOPAGO_CLIENT_SECRET=9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5
MERCADOPAGO_WEBHOOK_SECRET_LIVE=b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
```

---

## ⚠️ IMPORTANTE

1. **Copiar EXATAMENTE** os valores (sem espaços extras antes ou depois)
2. **NÃO adicionar aspas** ao redor dos valores
3. **NÃO adicionar espaços** antes ou depois do `=`
4. **Salvar o arquivo** após adicionar
5. **NÃO commitar** `.env.local` no Git (já deve estar no `.gitignore`)

---

## 🔄 APÓS ADICIONAR

### **1. Reiniciar o servidor de desenvolvimento:**

```bash
# Parar o servidor atual (Ctrl+C)
# Depois iniciar novamente:
npm run dev
```

### **2. Adicionar na Vercel também:**

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione as mesmas variáveis:
   - `MERCADOPAGO_ACCESS_TOKEN_LIVE`
   - `MERCADOPAGO_PUBLIC_KEY_LIVE`
   - `MERCADOPAGO_CLIENT_ID`
   - `MERCADOPAGO_CLIENT_SECRET`
   - `MERCADOPAGO_WEBHOOK_SECRET_LIVE`
3. Selecione **"Production"** para cada variável
4. Salve e faça **redeploy**

---

## 🧪 COMO O CÓDIGO USA AS CREDENCIAIS

O código em `src/lib/mercado-pago.ts` usa automaticamente:

- **Em desenvolvimento** (`NODE_ENV !== 'production'`): 
  - `MERCADOPAGO_ACCESS_TOKEN` ou `MERCADOPAGO_ACCESS_TOKEN_TEST`
  
- **Em produção** (`NODE_ENV === 'production'`):
  - `MERCADOPAGO_ACCESS_TOKEN_LIVE`

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

Após adicionar, você pode testar:

1. **Fazer um pagamento de teste** (se ainda estiver em desenvolvimento)
2. **Verificar os logs** do servidor para ver se não há erros de autenticação
3. **Testar o webhook** no painel do Mercado Pago

---

**Última atualização:** Janeiro 2025

