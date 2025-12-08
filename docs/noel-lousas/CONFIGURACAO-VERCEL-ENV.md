# 🔧 Configuração de Variáveis de Ambiente na Vercel

**Data:** 2025-01-27  
**Status:** ✅ **GUIA COMPLETO**

---

## 📋 VARIÁVEIS NECESSÁRIAS

Para o NOEL funcionar com Assistants API + Functions, você precisa configurar estas variáveis na Vercel:

### **1. Variáveis Obrigatórias**

```env
# OpenAI Assistant ID (obrigatório)
OPENAI_ASSISTANT_NOEL_ID=asst_xxxxxxxxxxxxx

# OpenAI API Key (já deve existir)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# URL da aplicação (produção)
NEXT_PUBLIC_APP_URL=https://www.ylada.com

# Secret para autenticação das functions (opcional mas recomendado)
OPENAI_FUNCTION_SECRET=noel-functions-secret-2025-abc123xyz789
```

### **2. Variáveis Opcionais (mas recomendadas)**

```env
# Se não usar OPENAI_ASSISTANT_NOEL_ID, pode usar este como fallback
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxx
```

---

## 🚀 COMO CONFIGURAR NA VERCEL

### **Método 1: Via Dashboard da Vercel (Recomendado)**

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione seu projeto:** `ylada-app` (ou nome do seu projeto)
3. **Vá em:** Settings → Environment Variables
4. **Adicione cada variável:**

   **Para Production:**
   - Key: `OPENAI_ASSISTANT_NOEL_ID`
   - Value: `asst_xxxxxxxxxxxxx` (seu Assistant ID)
   - Environment: ✅ Production
   - Clique em **Save**

   **Repita para todas as variáveis:**
   - `OPENAI_API_KEY` (se ainda não tiver)
   - `NEXT_PUBLIC_APP_URL` = `https://www.ylada.com`
   - `OPENAI_FUNCTION_SECRET` = (gere um secret seguro)

5. **Após adicionar todas:**
   - Vá em **Deployments**
   - Clique nos 3 pontos (...) do último deployment
   - Selecione **Redeploy**
   - Ou faça um novo commit para trigger automático

---

### **Método 2: Via Vercel CLI**

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login
vercel login

# Adicionar variáveis
vercel env add OPENAI_ASSISTANT_NOEL_ID production
# Cole o valor quando solicitado

vercel env add NEXT_PUBLIC_APP_URL production
# Cole: https://www.ylada.com

vercel env add OPENAI_FUNCTION_SECRET production
# Cole seu secret gerado

# Verificar variáveis
vercel env ls
```

---

## 🔐 GERAR OPENAI_FUNCTION_SECRET

Você pode gerar um secret seguro de várias formas:

### **Opção 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Opção 2: OpenSSL**
```bash
openssl rand -hex 32
```

### **Opção 3: Online**
- Acesse: https://randomkeygen.com/
- Use uma "CodeIgniter Encryption Keys" (32 caracteres)

**Exemplo de secret gerado:**
```
noel-functions-secret-2025-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

Após configurar, verifique:

- [ ] `OPENAI_ASSISTANT_NOEL_ID` configurado
- [ ] `OPENAI_API_KEY` configurado (já deve existir)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.ylada.com`
- [ ] `OPENAI_FUNCTION_SECRET` configurado (opcional mas recomendado)
- [ ] Todas as variáveis marcadas para **Production**
- [ ] Deployment feito após adicionar variáveis

---

## 🧪 COMO TESTAR APÓS CONFIGURAR

### **1. Verificar se as variáveis estão disponíveis:**

Acesse: `https://www.ylada.com/api/wellness/noel`

**Se estiver configurado corretamente:**
- Logs mostrarão: `🤖 [NOEL] Iniciando fluxo Assistants API...`
- Se não estiver: `ℹ️ [NOEL] OPENAI_ASSISTANT_NOEL_ID não configurado`

### **2. Testar uma mensagem:**

```bash
curl -X POST https://www.ylada.com/api/wellness/noel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "message": "Qual é meu dia atual do plano?",
    "userId": "seu-user-id"
  }'
```

**Resposta esperada:**
```json
{
  "response": "Seu dia atual é...",
  "source": "assistant_api",
  "threadId": "thread_...",
  "functionCalls": [...]
}
```

---

## 🔍 VERIFICAR VARIÁVEIS NO CÓDIGO

O código verifica as variáveis nesta ordem:

```typescript
// src/app/api/wellness/noel/route.ts
const assistantId = process.env.OPENAI_ASSISTANT_NOEL_ID || process.env.OPENAI_ASSISTANT_ID

// src/lib/noel-assistant-handler.ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const secret = process.env.OPENAI_FUNCTION_SECRET
```

---

## ⚠️ PROBLEMAS COMUNS

### **Problema 1: "OPENAI_ASSISTANT_NOEL_ID não configurado"**

**Solução:**
- Verifique se adicionou a variável na Vercel
- Verifique se marcou para **Production**
- Faça um novo deployment após adicionar

### **Problema 2: "Assistants API falhou"**

**Solução:**
- Verifique se `OPENAI_API_KEY` está correto
- Verifique se o Assistant ID existe e está ativo
- Verifique os logs da Vercel para mais detalhes

### **Problema 3: Functions não executam**

**Solução:**
- Verifique se `NEXT_PUBLIC_APP_URL` está correto
- Verifique se as rotas `/api/noel/*` estão deployadas
- Verifique se `OPENAI_FUNCTION_SECRET` está configurado (se usar autenticação)

---

## 📝 RESUMO RÁPIDO

1. **Acesse:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. **Adicione:**
   - `OPENAI_ASSISTANT_NOEL_ID` = `asst_...`
   - `NEXT_PUBLIC_APP_URL` = `https://www.ylada.com`
   - `OPENAI_FUNCTION_SECRET` = (gere um secret)
3. **Marque todas para:** ✅ Production
4. **Redeploy:** Deployments → ... → Redeploy
5. **Teste:** Envie uma mensagem para o NOEL

---

**Status:** ✅ **GUIA COMPLETO - PRONTO PARA USAR**
