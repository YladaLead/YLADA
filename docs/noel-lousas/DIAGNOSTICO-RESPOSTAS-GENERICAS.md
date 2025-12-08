# 🔍 Diagnóstico: Respostas Genéricas do NOEL

**Data:** 2025-01-27  
**Problema:** NOEL está retornando respostas genéricas ao invés de usar Assistants API

---

## ❌ PROBLEMA IDENTIFICADO

O NOEL está caindo no **fallback híbrido** (sistema antigo) ao invés de usar o **Assistants API**.

**Sintomas:**
- Respostas genéricas: "O importante é fazer sentido pra você, não pra mim"
- Mostra "🤖 IA Gerada" e "📊 Similaridade: 0%"
- Não usa functions
- Não usa base de conhecimento corretamente

---

## 🔍 POSSÍVEIS CAUSAS

### **1. OPENAI_ASSISTANT_NOEL_ID não configurado**
**Sintoma:** Log mostra `ℹ️ [NOEL] OPENAI_ASSISTANT_NOEL_ID não configurado, usando fallback híbrido`

**Solução:**
- Verificar se variável está na Vercel
- Verificar se variável está no `.env.local` (local)
- Fazer novo deploy após adicionar

---

### **2. Assistants API falhando silenciosamente**
**Sintoma:** Log mostra `❌ [NOEL] Assistants API falhou: ...`

**Possíveis causas:**
- Assistant ID incorreto
- API Key inválida
- Assistant não tem functions configuradas
- Erro na execução das functions

**Solução:**
- Verificar logs no terminal/Vercel
- Verificar se Assistant ID está correto: `asst_pu4Tpeox9tldPOs2i6UhX6Em`
- Verificar se todas as 6 functions estão no Assistant

---

### **3. System Prompt do Assistant não está instruindo corretamente**
**Sintoma:** Assistants API funciona, mas respostas são genéricas

**Solução:**
- Verificar System Prompt no OpenAI Assistant
- Adicionar instruções claras sobre quando usar functions
- Adicionar instruções sobre usar scripts da base de conhecimento

---

## ✅ SOLUÇÃO IMEDIATA

### **Passo 1: Verificar Variáveis de Ambiente**

**Local (.env.local):**
```env
OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tldPOs2i6UhX6Em
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vercel (Production):**
```env
OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tldPOs2i6UhX6Em
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://www.ylada.com
```

---

### **Passo 2: Verificar Logs**

**No Terminal (local) ou Vercel Logs (produção):**

Procurar por:
- `🤖 [NOEL] Iniciando fluxo Assistants API...` → ✅ Está tentando usar Assistants API
- `ℹ️ [NOEL] OPENAI_ASSISTANT_NOEL_ID não configurado` → ❌ Variável não configurada
- `❌ [NOEL] Assistants API falhou:` → ❌ Erro na execução

---

### **Passo 3: Verificar Assistant no OpenAI**

1. Acessar: https://platform.openai.com/assistants
2. Abrir "Noel Wellness Mentor"
3. Verificar:
   - ✅ Assistant ID: `asst_pu4Tpeox9tldPOs2i6UhX6Em`
   - ✅ Model: `gpt-4.1-2025-04-14`
   - ✅ Functions: 6 functions configuradas
   - ✅ System Prompt: Instruções claras sobre usar functions

---

### **Passo 4: Ajustar System Prompt do Assistant**

O System Prompt deve incluir:

```
Você é NOEL, mentor oficial da área WELLNESS do YLADA.

IMPORTANTE - Quando o usuário perguntar sobre:
- Seu perfil, objetivos, metas → Use getUserProfile()
- Dia atual do plano → Use getPlanDay()
- Registrar cliente → Use registerLead()
- Dados de cliente → Use getClientData()
- Sempre salve interações → Use saveInteraction()

SEMPRE use as functions quando necessário. Não invente dados.

Para perguntas sobre scripts e estratégias:
- Use a base de conhecimento (File Search)
- Forneça scripts completos e práticos
- Seja direto e objetivo
```

---

## 🧪 TESTE APÓS CORREÇÃO

**Pergunta de teste:**
```
"Noel, quero vender hoje. Qual é o primeiro passo?"
```

**Resposta esperada:**
- ✅ Deve chamar `getUserProfile()` para personalizar
- ✅ Deve usar scripts da base de conhecimento
- ✅ Deve ser específica e prática
- ✅ NÃO deve ser genérica

**Logs esperados:**
```
🤖 [NOEL] Iniciando fluxo Assistants API...
🔧 Executando function: getUserProfile
✅ Function getUserProfile executada com sucesso
✅ [NOEL] Assistants API retornou resposta
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] `OPENAI_ASSISTANT_NOEL_ID` configurado (local e Vercel)
- [ ] `OPENAI_API_KEY` configurado
- [ ] Assistant ID correto: `asst_pu4Tpeox9tldPOs2i6UhX6Em`
- [ ] 6 functions configuradas no Assistant
- [ ] System Prompt instrui uso de functions
- [ ] Deploy feito após configurar variáveis
- [ ] Logs mostram uso de Assistants API (não fallback)

---

**Status:** 🔍 **DIAGNÓSTICO EM ANDAMENTO**
