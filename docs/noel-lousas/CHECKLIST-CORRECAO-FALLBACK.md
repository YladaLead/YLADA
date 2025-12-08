# ✅ Checklist: Corrigir Fallback do NOEL

**Data:** 2025-01-27  
**Problema:** NOEL está caindo no fallback híbrido ao invés de usar Assistants API

---

## 🔍 DIAGNÓSTICO

**Sintoma:** Respostas genéricas com "🤖 IA Gerada" e "📊 Similaridade: 0%"

**Causa provável:** `OPENAI_ASSISTANT_NOEL_ID` não configurada na Vercel

---

## ✅ CHECKLIST DE CORREÇÃO

### **1. Verificar Logs na Vercel**

Após fazer uma pergunta no chat, verificar logs:

**Se ver:**
```
⚠️ [NOEL] OPENAI_ASSISTANT_NOEL_ID NÃO CONFIGURADO
```

**→ Problema:** Variável não configurada

**Se ver:**
```
❌ [NOEL] ASSISTANTS API FALHOU
❌ [NOEL] Erro: ...
```

**→ Problema:** Erro na execução (verificar erro específico)

---

### **2. Configurar Variável na Vercel**

1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto
3. Settings → Environment Variables
4. Adicionar:
   ```
   Name: OPENAI_ASSISTANT_NOEL_ID
   Value: asst_pu4Tpeox9tldPOs2i6UhX6Em
   Environment: Production, Preview, Development (todos)
   ```
5. Salvar
6. Fazer novo deploy

---

### **3. Verificar no .env.local (Local)**

Para testar localmente:

```env
OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tldPOs2i6UhX6Em
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **4. Testar Novamente**

1. Fazer deploy na Vercel
2. Aguardar deploy completar
3. Acessar: `https://www.ylada.com/pt/wellness/noel`
4. Enviar: "Noel, qual é o meu perfil?"
5. Verificar logs na Vercel

**Logs esperados (sucesso):**
```
🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO
✅ [NOEL] Autenticação OK
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ✅ Configurado
🤖 [NOEL] INICIANDO ASSISTANTS API
🔧 Executando function: getUserProfile
✅ Function getUserProfile executada com sucesso
✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA
```

---

### **5. Se Ainda Não Funcionar**

Verificar:

- [ ] Assistant ID está correto: `asst_pu4Tpeox9tldPOs2i6UhX6Em`
- [ ] Variável configurada em TODOS os ambientes (Production, Preview, Development)
- [ ] Deploy foi feito APÓS configurar variável
- [ ] `OPENAI_API_KEY` também está configurada
- [ ] Assistant tem as 6 functions configuradas
- [ ] System Prompt do Assistant instrui uso de functions

---

## 🎯 RESULTADO ESPERADO

Após corrigir:

- ✅ Respostas personalizadas (não genéricas)
- ✅ Functions sendo executadas
- ✅ Logs mostram "ASSISTANTS API RETORNOU RESPOSTA"
- ✅ Frontend mostra "🤖 Assistants API" (não "IA Gerada")

---

**Status:** 🔧 **AGUARDANDO CONFIGURAÇÃO DA VARIÁVEL**
