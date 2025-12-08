# 🧪 Teste Localhost Primeiro - NOEL

**Data:** 2025-01-27  
**Objetivo:** Testar Assistants API localmente antes de fazer deploy

---

## ✅ CONFIGURAR .env.local

Criar/editar `.env.local` na raiz do projeto:

```env
# Assistants API (NOVO - o que queremos usar)
OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tldPOs2i6UhX6Em

# OpenAI API Key
OPENAI_API_KEY=sk-...

# URL local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Autenticação Functions (opcional)
OPENAI_FUNCTION_SECRET=noel-secret-local-abc123
```

**⚠️ IMPORTANTE:** 
- `OPENAI_ASSISTANT_NOEL_ID` = Assistants API (✅ usar)
- `OPENAI_WORKFLOW_ID` = Agent Builder (❌ não usar para NOEL)

---

## 🚀 RODAR LOCALMENTE

```bash
# Parar servidor se estiver rodando
# Ctrl+C

# Rodar novamente
npm run dev
```

---

## 🧪 TESTAR

1. **Acessar:** `http://localhost:3000/pt/wellness/noel`
2. **Enviar:** "Noel, qual é o meu perfil?"
3. **Verificar terminal** (onde está rodando `npm run dev`)

**Logs esperados (sucesso):**
```
🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO
✅ [NOEL] Autenticação OK - User ID: ...
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ✅ Configurado
🤖 [NOEL] INICIANDO ASSISTANTS API
🔧 Executando function: getUserProfile
✅ Function getUserProfile executada com sucesso
✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA
```

**Se aparecer:**
```
⚠️ [NOEL] OPENAI_ASSISTANT_NOEL_ID NÃO CONFIGURADO
```

**→ Verificar se `.env.local` está correto e reiniciar servidor**

---

## 🔍 VERIFICAR VARIÁVEIS

No terminal, você pode verificar se as variáveis estão sendo lidas:

```bash
# No terminal do Next.js, as variáveis aparecem nos logs
# Ou adicionar temporariamente no código para debug:
console.log('🔍 Variáveis:', {
  ASSISTANT_ID: process.env.OPENAI_ASSISTANT_NOEL_ID ? '✅' : '❌',
  API_KEY: process.env.OPENAI_API_KEY ? '✅' : '❌'
})
```

---

## ✅ SE FUNCIONAR NO LOCALHOST

Depois que funcionar localmente:

1. **Configurar na Vercel:**
   - `OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tldPOs2i6UhX6Em`
   - Em todos os ambientes (Production, Preview, Development)

2. **Fazer deploy**

3. **Testar em produção**

---

## ❌ SE NÃO FUNCIONAR NO LOCALHOST

Verificar:

- [ ] `.env.local` existe na raiz do projeto
- [ ] Variáveis estão escritas corretamente (sem espaços extras)
- [ ] Servidor foi reiniciado após adicionar variáveis
- [ ] `OPENAI_API_KEY` está válida
- [ ] Assistant ID está correto: `asst_pu4Tpeox9tldPOs2i6UhX6Em`

---

**Status:** 🧪 **PRONTO PARA TESTE LOCAL**
