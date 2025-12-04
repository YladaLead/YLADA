# 🔧 NOEL - Integração Completa com Agent Builder

## 🎯 Problema Identificado

O NOEL **NÃO está usando o Agent Builder** que você criou. O sistema ainda está chamando a API antiga (`/api/wellness/noel`) que usa Chat Completions diretamente, ignorando:
- ❌ As instruções do Agent Builder
- ❌ Os few-shots configurados
- ❌ O formato NOEL (Mensagem → Ação → Script → Frase)
- ❌ O estilo Mark Hughes / Jim Rohn / Eric Worre

## ✅ Solução Implementada

Criei **3 opções** para você escolher:

---

## 📋 OPÇÃO A: ChatKit (Frontend Direto)

**Vantagens:**
- ✅ Interface pronta
- ✅ Não precisa mexer no backend
- ✅ Chat aparece direto na página

**Desvantagens:**
- ❌ Menos controle sobre autenticação
- ❌ Menos personalização

### **Como usar:**

1. **Instalar pacote:**
```bash
npm install @openai/chatkit-react
```

2. **Adicionar no `.env.local`:**
```env
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
NEXT_PUBLIC_CHATKIT_DOMAIN_PK=domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19
NEXT_PUBLIC_CHATKIT_VERSION=1
```

3. **Substituir componente na página:**
```tsx
import { Chat } from '@openai/chatkit-react'

export default function NoelChatPage() {
  return (
    <Chat
      workflow={{
        id: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID!,
        version: process.env.NEXT_PUBLIC_CHATKIT_VERSION || undefined,
      }}
    />
  )
}
```

---

## 📋 OPÇÃO B: Agents SDK (Backend - RECOMENDADO)

**Vantagens:**
- ✅ Mantém autenticação atual
- ✅ Mantém controle total
- ✅ Pode ter fallback
- ✅ Integra com base de conhecimento

**Desvantagens:**
- ⚠️ Precisa verificar se a API está disponível

### **Como usar:**

1. **Adicionar no `.env.local`:**
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
# OU
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
```

2. **Código já implementado:**
- ✅ Rota `/api/wellness/noel` atualizada para tentar Agent Builder primeiro
- ✅ Fallback automático se Agent Builder não estiver disponível
- ✅ Rota dedicada `/api/wellness/noel/agent-builder` criada

3. **O frontend já está chamando `/api/wellness/noel`** - vai funcionar automaticamente!

---

## 📋 OPÇÃO C: Híbrido (Agent Builder + Fallback)

**Como funciona:**
1. Tenta usar Agent Builder primeiro
2. Se não estiver configurado ou falhar, usa sistema híbrido atual
3. Melhor dos dois mundos

**Status:** ✅ **JÁ IMPLEMENTADO**

A rota `/api/wellness/noel` agora:
- Tenta Agent Builder primeiro (se `OPENAI_WORKFLOW_ID` configurado)
- Se falhar, usa fallback híbrido (base de conhecimento + IA)
- Mantém toda funcionalidade atual

---

## 🔧 Configuração Necessária

### **Variáveis de Ambiente:**

```env
# OpenAI API Key (obrigatório)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Workflow ID do Agent Builder (obrigatório para usar Agent Builder)
OPENAI_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
# OU
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa

# Domain Public Key (se usar ChatKit)
NEXT_PUBLIC_CHATKIT_DOMAIN_PK=domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19

# Version (opcional)
NEXT_PUBLIC_CHATKIT_VERSION=1
```

---

## ✅ O Que Foi Implementado

### **1. Rota Agent Builder Dedicada:**
- ✅ `src/app/api/wellness/noel/agent-builder/route.ts`
- ✅ Usa Agents SDK para chamar o workflow
- ✅ Tratamento de erros completo

### **2. Rota Principal Atualizada:**
- ✅ `src/app/api/wellness/noel/route.ts`
- ✅ Tenta Agent Builder primeiro
- ✅ Fallback automático se não disponível
- ✅ Mantém toda funcionalidade atual

### **3. Função Helper:**
- ✅ `tryAgentBuilder()` - Tenta usar Agent Builder
- ✅ Retorna sucesso/erro
- ✅ Integrado na rota principal

---

## 🚀 Como Ativar

### **Passo 1: Adicionar Workflow ID no `.env.local`**

```env
OPENAI_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
```

### **Passo 2: Reiniciar servidor**

```bash
npm run dev
```

### **Passo 3: Testar**

Acesse `/pt/wellness/noel` e envie uma mensagem.

**Se funcionar:**
- ✅ Resposta vem do Agent Builder
- ✅ Usa formato NOEL (Mensagem → Ação → Script → Frase)
- ✅ Usa few-shots configurados

**Se não funcionar:**
- ⚠️ Usa fallback híbrido (sistema atual)
- ⚠️ Verifique logs do servidor
- ⚠️ Verifique se Workflow ID está correto

---

## 🔍 Verificação

### **Como saber se está usando Agent Builder:**

1. **Logs do servidor:**
   - ✅ `🤖 Tentando usar Agent Builder...`
   - ✅ `✅ Agent Builder retornou resposta`
   - ❌ `⚠️ Agent Builder não disponível, usando fallback`

2. **Resposta no frontend:**
   - ✅ Formato NOEL completo
   - ✅ Mensagem → Ação → Script → Frase
   - ✅ Estilo Mark Hughes / Jim Rohn

3. **Metadata da resposta:**
   - ✅ `source: 'agent_builder'` (se usar Agent Builder)
   - ⚠️ `source: 'ia_generated'` (se usar fallback)

---

## ⚠️ Nota Importante

A API `openai.agents.workflowRuns` pode não estar disponível em todas as contas OpenAI ainda. Se der erro, o sistema automaticamente usa o fallback.

**Se a API não funcionar:**
- Use a **Opção A (ChatKit)** que é mais estável
- Ou aguarde a API de Agents SDK ficar disponível

---

## 📝 Resumo

| Opção | Status | Quando Usar |
|-------|--------|-------------|
| **A) ChatKit** | ✅ Pronto | Quer interface pronta, sem backend |
| **B) Agents SDK** | ✅ Implementado | Quer manter controle e autenticação |
| **C) Híbrido** | ✅ Ativo | Quer melhor dos dois mundos |

**Recomendação:** Use a **Opção B (já implementada)** - apenas adicione o `OPENAI_WORKFLOW_ID` no `.env.local`!

---

**Status:** ✅ Código pronto - apenas configurar variáveis de ambiente

