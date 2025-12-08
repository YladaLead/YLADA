# 📊 Como Ver Logs do NOEL na Vercel

**Data:** 2025-01-27

---

## 🔍 ONDE VER OS LOGS

### **1. Vercel Dashboard**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **"Logs"** (menu lateral)
4. Filtre por:
   - **Contains:** `[NOEL]`
   - **Timeline:** Últimas 30 minutos (ou período desejado)

---

## 📋 LOGS QUE VOCÊ DEVE VER

### **Quando o endpoint é chamado:**
```
🚀 [NOEL] ==========================================
🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO
🚀 [NOEL] ==========================================
🕐 [NOEL] Timestamp: 2025-01-27T09:40:00.000Z
✅ [NOEL] Autenticação OK - User ID: abc123
📥 [NOEL] Body recebido: { messageLength: 50, hasThreadId: false }
```

### **Se Assistants API está configurado:**
```
🔍 [NOEL] Verificando configuração Assistants API...
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ✅ Configurado
🔍 [NOEL] OPENAI_API_KEY: ✅ Configurado
🤖 [NOEL] ==========================================
🤖 [NOEL] INICIANDO ASSISTANTS API
🤖 [NOEL] ==========================================
```

### **Se Assistants API NÃO está configurado:**
```
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ❌ NÃO CONFIGURADO
⚠️ [NOEL] ==========================================
⚠️ [NOEL] OPENAI_ASSISTANT_NOEL_ID NÃO CONFIGURADO
⚠️ [NOEL] ==========================================
⚠️ [NOEL] Usando fallback híbrido (sistema antigo)
```

---

## 🔍 SE NÃO VER LOGS DO NOEL

### **Possíveis causas:**

1. **Endpoint não está sendo chamado**
   - Verificar se o frontend está fazendo a requisição correta
   - Verificar console do navegador (F12) para erros

2. **Logs estão em outro período**
   - Ajustar timeline para período mais amplo
   - Verificar se há deploy recente

3. **Filtro está escondendo os logs**
   - Remover filtros
   - Buscar por `NOEL` sem colchetes

4. **Deploy não foi feito**
   - Fazer novo deploy após adicionar logs
   - Aguardar alguns minutos para logs aparecerem

---

## 🧪 TESTE PARA GERAR LOGS

1. **Acessar:** `https://www.ylada.com/pt/wellness/noel`
2. **Enviar mensagem:** "Olá, quem é você?"
3. **Aguardar 10-20 segundos**
4. **Verificar logs na Vercel**

---

## 📊 INTERPRETAÇÃO DOS LOGS

### **✅ Tudo OK:**
- Vê `🚀 [NOEL] ENDPOINT CHAMADO`
- Vê `✅ [NOEL] Autenticação OK`
- Vê `🤖 [NOEL] INICIANDO ASSISTANTS API`
- Vê `✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA`

### **❌ Problema: Variável não configurada**
- Vê `❌ NÃO CONFIGURADO`
- **Solução:** Adicionar `OPENAI_ASSISTANT_NOEL_ID` na Vercel

### **❌ Problema: Assistants API falhou**
- Vê `❌ [NOEL] ASSISTANTS API FALHOU`
- Vê erro específico
- **Solução:** Verificar erro e corrigir

### **❌ Problema: Endpoint não chamado**
- **Não vê nenhum log do NOEL**
- **Solução:** Verificar frontend e console do navegador

---

**Status:** 📊 **GUIA DE DIAGNÓSTICO**
