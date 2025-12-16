# ✅ CHECKLIST: Variáveis de Ambiente do NOEL

**Data:** 2025-01-27  
**Status:** Verificação necessária

---

## 📋 VARIÁVEIS OBRIGATÓRIAS PARA O NOEL

### ✅ **Variáveis que você JÁ TEM:**

1. ✅ **OPENAI_ASSISTANT_NOEL_ID**
   - Você tem: `OPENAI_ASSISTANT_NOEL_ID`
   - Status: ✅ OK

2. ✅ **OPENAI_API_KEY**
   - Você tem: `OPENAI_API_KEY`
   - Status: ✅ OK

3. ✅ **NEXT_PUBLIC_APP_URL**
   - Você tem: `NEXT_PUBLIC_APP_URL` (e também `NEXT_PUBLIC_APP_URL_PRODUCTION`)
   - Status: ✅ OK

---

## ❌ VARIÁVEL QUE ESTÁ FALTANDO

### **OPENAI_FUNCTION_SECRET** ⚠️ **FALTA ADICIONAR**

**O que é:**
- Secret usado para autenticar as chamadas das functions do NOEL
- Protege as rotas `/api/noel/*` contra acesso não autorizado
- Necessário para que as functions funcionem corretamente

**Por que é importante:**
- Sem essa variável, as functions podem falhar com erro de autenticação
- É por isso que você está vendo "Erro no servidor" quando pergunta "Qual é o meu perfil?"

**Como adicionar na Vercel:**

1. Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**
2. Clique em **"Add New"**
3. Preencha:
   - **Key:** `OPENAI_FUNCTION_SECRET`
   - **Value:** (gere um secret seguro - veja abaixo)
   - **Environment:** ✅ Production, ✅ Preview, ✅ Development
4. Clique em **Save**

**Como gerar o secret:**

Opção 1 - Terminal:
```bash
openssl rand -hex 32
```

Opção 2 - Online:
- Acesse: https://randomkeygen.com/
- Use um "CodeIgniter Encryption Keys" (64 caracteres)

**Exemplo de secret:**
```
noel-functions-secret-2025-abc123xyz789def456ghi012jkl345mno678pqr901stu234
```

**⚠️ IMPORTANTE:**
- Use o MESMO secret em Production, Preview e Development
- Mantenha o secret seguro (não compartilhe)
- Após adicionar, faça um novo deploy

---

## 📋 CHECKLIST COMPLETO

### **Variáveis Obrigatórias:**

- [x] `OPENAI_ASSISTANT_NOEL_ID` - ✅ Você tem
- [x] `OPENAI_API_KEY` - ✅ Você tem
- [x] `NEXT_PUBLIC_APP_URL` - ✅ Você tem
- [ ] `OPENAI_FUNCTION_SECRET` - ❌ **FALTA ADICIONAR**

### **Variáveis Opcionais (mas recomendadas):**

- [ ] `OPENAI_ASSISTANT_ID` - Opcional (fallback se não tiver OPENAI_ASSISTANT_NOEL_ID)

---

## 🚨 O QUE ACONTECE SEM `OPENAI_FUNCTION_SECRET`

**Sem essa variável:**
- ⚠️ Functions podem falhar com erro de autenticação
- ⚠️ Você vê "Erro no servidor" quando pergunta coisas que precisam de functions
- ⚠️ `getUserProfile`, `getFluxoInfo`, etc. podem não funcionar

**Com essa variável:**
- ✅ Functions funcionam corretamente
- ✅ Autenticação protegida
- ✅ Erros de servidor resolvidos

---

## ✅ AÇÃO NECESSÁRIA

**Adicione esta variável na Vercel:**

```
Key: OPENAI_FUNCTION_SECRET
Value: [gere um secret de 32-64 caracteres]
Environment: Production, Preview, Development
```

**Após adicionar:**
1. Faça um novo deploy (ou aguarde o próximo)
2. Teste novamente as perguntas que estavam dando erro

---

## 📝 RESUMO

**Você tem:**
- ✅ OPENAI_ASSISTANT_NOEL_ID
- ✅ OPENAI_API_KEY
- ✅ NEXT_PUBLIC_APP_URL

**Falta adicionar:**
- ❌ **OPENAI_FUNCTION_SECRET** ← Esta é a variável que você estava em dúvida!

**Não precisa:**
- ❌ Não existe variável chamada "función" ou "function"
- ❌ A variável correta é `OPENAI_FUNCTION_SECRET`

---

**✅ Adicione `OPENAI_FUNCTION_SECRET` e faça deploy!**











