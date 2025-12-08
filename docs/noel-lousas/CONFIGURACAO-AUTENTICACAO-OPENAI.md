# 🔐 Configuração de Autenticação - Functions NOEL

**Data:** 2025-01-27  
**Objetivo:** Configurar autenticação segura para as functions do NOEL no OpenAI

---

## ✅ SOLUÇÃO IMPLEMENTADA

Implementei autenticação via **Bearer Token** em todas as rotas `/api/noel/*`.

### **Como Funciona:**

1. **Criar um Secret:**
   - Gere um token secreto (ex: `noel-functions-secret-2025-xyz123`)
   - Adicione nas variáveis de ambiente

2. **Configurar no OpenAI:**
   - Adicione header `Authorization` com valor `Bearer SEU_SECRET`

3. **As rotas validam automaticamente:**
   - Se o token estiver correto → permite acesso
   - Se estiver errado ou ausente → retorna 401

---

## 🔧 CONFIGURAÇÃO PASSO A PASSO

### **1. Criar Secret (Escolha um)**

Gere um token seguro, por exemplo:
```
noel-functions-secret-2025-abc123xyz789
```

Ou use um gerador:
```bash
# No terminal:
openssl rand -hex 32
```

### **2. Adicionar nas Variáveis de Ambiente**

#### **Local (.env.local):**
```env
OPENAI_FUNCTION_SECRET=noel-functions-secret-2025-abc123xyz789
```

#### **Vercel (Production):**
1. Acesse: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Seu projeto → **Settings** → **Environment Variables**
3. Adicione:
   - **Key:** `OPENAI_FUNCTION_SECRET`
   - **Value:** `noel-functions-secret-2025-abc123xyz789` (seu secret)
   - **Environment:** Production, Preview, Development
4. Clique em **Save**
5. **Fazer redeploy** (ou aguardar próximo deploy)

---

### **3. Configurar no OpenAI Assistant**

No **OpenAI Assistant Builder**:

1. Vá em cada function (getUserProfile, saveInteraction, etc.)
2. Clique em **"Add integration / URL"**
3. Configure a URL: `https://www.ylada.com/api/noel/getUserProfile`
4. **Adicione Header de Autenticação:**
   - **Header Name:** `Authorization`
   - **Header Value:** `Bearer noel-functions-secret-2025-abc123xyz789`
   - (Use o mesmo secret que configurou nas variáveis de ambiente)
5. Salve

**Repita para todas as 6 functions.**

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### **Variáveis de Ambiente:**
- [ ] Criar secret seguro
- [ ] Adicionar `OPENAI_FUNCTION_SECRET` no `.env.local` (local)
- [ ] Adicionar `OPENAI_FUNCTION_SECRET` no Vercel (produção)
- [ ] Fazer redeploy (se necessário)

### **OpenAI Assistant:**
- [ ] Configurar URL: `https://www.ylada.com/api/noel/getUserProfile`
- [ ] Adicionar header: `Authorization: Bearer SEU_SECRET`
- [ ] Repetir para todas as 6 functions

### **Testar:**
- [ ] Testar no modo "Evaluate" do OpenAI
- [ ] Verificar se retorna 401 sem token
- [ ] Verificar se funciona com token correto

---

## 🧪 TESTE DE AUTENTICAÇÃO

### **Teste 1: Sem Token (deve falhar)**
```bash
curl -X POST https://www.ylada.com/api/noel/getUserProfile \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test"}'
```

**Esperado:** `{ "success": false, "error": "Authorization header é obrigatório" }`

### **Teste 2: Com Token Correto (deve funcionar)**
```bash
curl -X POST https://www.ylada.com/api/noel/getUserProfile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer noel-functions-secret-2025-abc123xyz789" \
  -d '{"user_id": "test"}'
```

**Esperado:** `{ "success": true, "data": {...} }` ou erro de validação (mas não 401)

---

## 🔒 SEGURANÇA

### **✅ Implementado:**
- ✅ Validação de header obrigatório
- ✅ Validação de formato Bearer token
- ✅ Validação de token secreto
- ✅ Retorno de erro claro (sem expor detalhes)

### **⚠️ Importante:**
- **NUNCA** commite o secret no código
- **SEMPRE** use variáveis de ambiente
- **ROTE** o secret periodicamente
- **USE** HTTPS em produção (já está usando)

---

## 🚨 MODO DESENVOLVIMENTO

Se `OPENAI_FUNCTION_SECRET` não estiver configurado:
- ⚠️ As rotas **permitem acesso sem autenticação**
- ⚠️ Isso é **apenas para desenvolvimento local**
- ✅ Em produção, **SEMPRE** configure o secret

---

## 📝 EXEMPLO DE CONFIGURAÇÃO NO OPENAI

**Para cada function:**

```
Function: getUserProfile
URL: https://www.ylada.com/api/noel/getUserProfile
Method: POST
Headers:
  Authorization: Bearer noel-functions-secret-2025-abc123xyz789
  Content-Type: application/json
```

---

**Status:** ✅ **AUTENTICAÇÃO IMPLEMENTADA - AGUARDANDO CONFIGURAÇÃO DO SECRET**

**Próximo passo:** Criar o secret e configurar nas variáveis de ambiente + OpenAI.
