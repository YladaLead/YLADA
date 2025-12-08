# 📋 Como Enviar Logs Completos

**Data:** 2025-01-27

---

## 🔍 COMO CAPTURAR LOGS COMPLETOS

### **1. No Terminal (onde roda `npm run dev`)**

**Copiar os logs:**
1. Fazer uma pergunta no chat: "Noel, qual é o meu perfil?"
2. No terminal, selecionar todo o texto dos logs
3. Copiar (Cmd+C)
4. Colar aqui no chat

**Ou salvar em arquivo:**
```bash
# No terminal, redirecionar para arquivo
npm run dev 2>&1 | tee logs-noel.txt
```

Depois enviar o conteúdo de `logs-noel.txt`.

---

### **2. No Console do Navegador (F12)**

1. Abrir DevTools (F12)
2. Ir na aba "Console"
3. Fazer pergunta no chat
4. Selecionar todos os logs do console
5. Copiar e colar aqui

---

### **3. Logs Específicos do NOEL**

Para ver apenas logs do NOEL:

```bash
# No terminal
npm run dev 2>&1 | grep "\[NOEL\]"
```

---

## 📋 O QUE PROCURAR NOS LOGS

### **Se Assistants API está funcionando:**
```
🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO
✅ [NOEL] Autenticação OK
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ✅ Configurado
🤖 [NOEL] INICIANDO ASSISTANTS API
🚀 [NOEL Handler] Criando run do assistant...
✅ [NOEL Handler] Run criado com sucesso
🔧 Executando function: getUserProfile
✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA
```

### **Se Assistants API está falhando:**
```
❌ [NOEL Handler] Erro ao criar run: ...
❌ [NOEL Handler] Status code: 404
⚠️ [NOEL] CAINDO NO FALLBACK HÍBRIDO
```

---

## ✅ O QUE JÁ FOI CORRIGIDO

1. ✅ Cache limpo (`rm -rf .next`)
2. ✅ ID corrigido no `.env.local`
3. ✅ Versão corrigida (agora mostra `gpt-4.1-assistant` quando usa Assistants API)
4. ✅ Servidor reiniciado

---

## 🧪 TESTE AGORA

1. Acessar: `http://localhost:3000/pt/wellness/noel`
2. Enviar: "Noel, qual é o meu perfil?"
3. **Copiar TODOS os logs do terminal** (onde roda `npm run dev`)
4. **Enviar aqui no chat**

---

**Status:** ✅ **CACHE LIMPO - AGUARDANDO TESTE E LOGS**
