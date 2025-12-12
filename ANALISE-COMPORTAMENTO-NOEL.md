# 🔍 ANÁLISE: Mudança de Comportamento do Noel

**Data da análise:** 2025-01-27  
**Status:** ⚠️ PROBLEMA IDENTIFICADO

---

## 📋 RESUMO EXECUTIVO

O Noel está usando **Assistants API** da OpenAI, que lê o system prompt **estático** configurado no dashboard da OpenAI, **NÃO** o prompt dinâmico construído no código.

---

## 🔍 DIAGNÓSTICO TÉCNICO

### 1. **Como o Noel funciona atualmente:**

```
Usuário → /api/wellness/noel → noel-assistant-handler.ts → Assistants API
```

### 2. **Onde está o problema:**

**Arquivo:** `src/lib/noel-assistant-handler.ts` (linha 259)

```typescript
run = await openai.beta.threads.runs.create(currentThreadId, {
  assistant_id: ASSISTANT_ID,
  // ❌ NÃO está passando instructions (system prompt)
})
```

### 3. **O que acontece:**

1. ✅ O código constrói um prompt dinâmico em `buildSystemPrompt()` (linha 399 de `route.ts`)
2. ❌ Mas esse prompt **NÃO é usado** quando chama Assistants API
3. ⚠️ O Assistants API usa o prompt **estático** configurado no dashboard da OpenAI
4. 🔄 Se o prompt no dashboard foi alterado ou está desatualizado, o comportamento muda

---

## 🎯 CAUSA RAIZ

O Assistants API da OpenAI funciona assim:

- O **system prompt** é configurado **uma vez** no Assistant (no dashboard)
- Cada chamada usa esse prompt estático
- Para mudar o prompt dinamicamente, precisa passar `instructions` no `runs.create()`

**Atualmente o código NÃO está passando `instructions`**, então usa sempre o prompt do dashboard.

---

## 📊 COMPARAÇÃO: Código vs Dashboard

### **Código (não está sendo usado):**
- `src/lib/noel-wellness/system-prompt-lousa7.ts` → Prompt completo com Lousa 7
- `buildSystemPrompt()` → Constrói prompt dinâmico com contexto
- Inclui: perfil estratégico, contexto do consultor, base de conhecimento

### **Dashboard OpenAI (está sendo usado):**
- Prompt configurado manualmente no Assistant
- Pode estar desatualizado ou diferente do código
- Não recebe contexto dinâmico

---

## ✅ SOLUÇÕES POSSÍVEIS

### **Opção 1: Atualizar Prompt no Dashboard (RÁPIDA)**
- Acessar: https://platform.openai.com/assistants
- Encontrar o Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
- Atualizar o campo "Instructions" com o prompt completo de `system-prompt-lousa7.ts`
- **Vantagem:** Rápido, sem mudar código
- **Desvantagem:** Prompt ainda será estático (sem contexto dinâmico)

### **Opção 2: Passar Instructions Dinamicamente (RECOMENDADA)**
- Modificar `noel-assistant-handler.ts` para aceitar `instructions` como parâmetro
- Passar o prompt construído em `buildSystemPrompt()` para o Assistants API
- **Vantagem:** Prompt dinâmico com contexto personalizado
- **Desvantagem:** Requer mudança no código

### **Opção 3: Usar Chat Completions (ALTERNATIVA)**
- Trocar Assistants API por Chat Completions API
- Passar system prompt dinamicamente a cada chamada
- **Vantagem:** Controle total sobre o prompt
- **Desvantagem:** Perde function calling automático do Assistants API

---

## 🚨 VERIFICAÇÃO URGENTE

**Precisa verificar AGORA:**

1. Qual prompt está configurado no Assistant no dashboard da OpenAI?
2. Esse prompt está atualizado com as últimas mudanças?
3. O prompt no dashboard inclui todas as instruções de direcionamento e diálogo?

**Como verificar:**
1. Acesse: https://platform.openai.com/assistants
2. Encontre o Assistant com ID = `OPENAI_ASSISTANT_NOEL_ID`
3. Veja o campo "Instructions"
4. Compare com o prompt em `src/lib/noel-wellness/system-prompt-lousa7.ts`

---

## 📝 RECOMENDAÇÃO IMEDIATA

**Para resolver AGORA:**

1. ✅ Atualizar o prompt no dashboard da OpenAI com o conteúdo completo de:
   - `src/lib/noel-wellness/system-prompt-lousa7.ts` (NOEL_SYSTEM_PROMPT_WITH_SECURITY)

2. ✅ Verificar se o prompt inclui:
   - Arquitetura Mental do Noel (5 passos)
   - 12 Aprimoramentos Estratégicos
   - Árvore de Decisão Completa
   - Regras de Direcionamento e Diálogo
   - Estrutura obrigatória de resposta (Reconhecimento → Direção → Ação → CTA)

3. ✅ Testar após atualizar

**Para resolver DEFINITIVAMENTE (futuro):**

- Implementar Opção 2: passar `instructions` dinamicamente no `runs.create()`
- Isso permitirá prompt personalizado por usuário/perfil/contexto

---

## 🔗 ARQUIVOS RELEVANTES

- `src/lib/noel-assistant-handler.ts` - Handler do Assistants API
- `src/app/api/wellness/noel/route.ts` - Rota principal (constrói prompt mas não usa)
- `src/lib/noel-wellness/system-prompt-lousa7.ts` - Prompt completo do Noel
- `docs/INSTRUCOES-ATUALIZAR-PROMPT-MESTRE.md` - Instruções para atualizar no dashboard

---

## ✅ CONCLUSÃO

**Não houve mudança no código.** O problema é que o Assistants API está usando um prompt estático do dashboard que pode estar desatualizado ou diferente do esperado.

**Ação imediata:** Atualizar o prompt no dashboard da OpenAI com a versão mais recente do código.

