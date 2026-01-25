# 📋 PLANO DE MIGRAÇÃO - Assistants API → Responses API

**Data:** 2025-01-27  
**Prazo de Depreciação:** Agosto de 2026 (aproximadamente 19 meses)  
**Status:** ⚠️ Planejamento necessário (não urgente agora)

---

## 🚨 O QUE SIGNIFICA O AVISO

A OpenAI anunciou que a **Assistants API** será **removida em agosto de 2026**. A substituição recomendada é a **Responses API**.

### **Impacto no YLADA:**

**Sistemas que usam Assistants API:**
1. ✅ **NOEL (Wellness)** - Usa `OPENAI_ASSISTANT_NOEL_ID`
2. ✅ **LYA (Nutri)** - Tem suporte para ambos (já preparado para Responses API)
3. ⚠️ **Outros assistentes** - Verificar se há mais

**Sistemas já preparados:**
- ✅ **LYA** - Já tem código preparado para Responses API (usa `LYA_PROMPT_ID`)

---

## ⏰ QUANDO FAZER A MIGRAÇÃO

### **Cronograma Recomendado:**

| Período | Ação | Prioridade |
|---------|------|------------|
| **Agora - Março 2025** | ✅ Nenhuma ação urgente | Baixa |
| **Abril - Junho 2025** | 📋 Planejar migração | Média |
| **Julho - Setembro 2025** | 🔧 Implementar migração | Alta |
| **Outubro 2025 - Julho 2026** | 🧪 Testar e validar | Alta |
| **Agosto 2026** | ⚠️ Assistants API será removida | Crítica |

### **Recomendação:**

**NÃO é urgente agora**, mas você deve:
1. ✅ **Agora:** Entender o que precisa ser feito
2. ✅ **Abril 2025:** Começar a planejar a migração
3. ✅ **Julho 2025:** Começar a implementar
4. ✅ **Antes de agosto 2026:** Ter tudo migrado e testado

---

## 🔍 O QUE PRECISA SER FEITO

### **1. NOEL (Wellness) - Migração Necessária**

**Situação Atual:**
- Usa `OPENAI_ASSISTANT_NOEL_ID` (Assistants API)
- Código em: `src/lib/noel-assistant-handler.ts`
- Endpoint: `src/app/api/wellness/noel/route.ts`

**O que precisa:**
1. Criar Prompt Object na OpenAI Platform para o NOEL
2. Atualizar código para usar Responses API (similar ao que a LYA já tem)
3. Manter compatibilidade durante período de transição
4. Testar function calling (se Responses API suportar)

### **2. LYA (Nutri) - Já Preparada**

**Situação Atual:**
- ✅ Já tem código preparado para Responses API
- ✅ Usa `LYA_PROMPT_ID` quando disponível
- ✅ Tem fallback para Assistants API
- ⚠️ Precisa apenas testar quando Responses API estiver totalmente disponível

**O que precisa:**
- ⏳ Aguardar Responses API estar totalmente disponível
- ⏳ Testar function calling na Responses API
- ⏳ Validar que tudo funciona corretamente

---

## 📋 COMO FAZER A MIGRAÇÃO

### **PASSO 1: Criar Prompt Object para NOEL**

1. Acesse: https://platform.openai.com/prompts
2. Clique em "+ Create" ou "New Prompt"
3. Nome: "NOEL Wellness Mentor"
4. Cole o prompt completo do NOEL (v3.7 atualizado)
5. Configure variáveis (se necessário)
6. Salve e copie o `pmpt_...` ID

### **PASSO 2: Atualizar Código do NOEL**

**Arquivo:** `src/lib/noel-assistant-handler.ts`

**Mudanças necessárias:**

1. **Adicionar suporte para Responses API:**
   ```typescript
   // Verificar se tem NOEL_PROMPT_ID (Responses API)
   const promptId = process.env.NOEL_PROMPT_ID
   const assistantId = process.env.OPENAI_ASSISTANT_NOEL_ID
   
   // PRIORIDADE: Se tem NOEL_PROMPT_ID, usar Responses API
   if (promptId && promptId.startsWith('pmpt_')) {
     // Usar Responses API
     const response = await openai.responses.create({
       prompt: {
         id: promptId,
         variables: {
           // Variáveis do contexto
         }
       }
     })
   } else if (assistantId) {
     // Fallback: Assistants API (até agosto 2026)
     // Código atual
   }
   ```

2. **Manter compatibilidade:**
   - Manter código atual funcionando
   - Adicionar Responses API como opção prioritária
   - Fallback para Assistants API se Responses API falhar

### **PASSO 3: Configurar Variáveis de Ambiente**

**Adicionar no `.env.local` e Vercel:**
```env
# Responses API (novo - recomendado)
NOEL_PROMPT_ID=pmpt_...

# Assistants API (antigo - será removido em 2026)
OPENAI_ASSISTANT_NOEL_ID=asst_...
```

### **PASSO 4: Testar Function Calling**

**Desafio:** Verificar se Responses API suporta function calling como Assistants API.

**Se não suportar:**
- Implementar function calling manualmente
- Ou usar Chat Completions com function calling (fallback)

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### **Opção 1: Migração Gradual (RECOMENDADA)**

1. **Fase 1 (Abril 2025):** Criar Prompt Object do NOEL
2. **Fase 2 (Julho 2025):** Adicionar código para Responses API (com fallback)
3. **Fase 3 (Setembro 2025):** Testar em produção (paralelo com Assistants API)
4. **Fase 4 (Dezembro 2025):** Tornar Responses API padrão
5. **Fase 5 (Março 2026):** Remover Assistants API (antes do prazo)

**Vantagens:**
- ✅ Sem interrupção do serviço
- ✅ Teste gradual
- ✅ Tempo para ajustes
- ✅ Rollback fácil se necessário

### **Opção 2: Migração Completa (Mais Rápida)**

1. **Julho 2025:** Migrar tudo de uma vez
2. **Agosto 2025:** Testar extensivamente
3. **Setembro 2025:** Remover Assistants API

**Desvantagens:**
- ⚠️ Mais risco de problemas
- ⚠️ Menos tempo para ajustes

---

## 📊 COMPARAÇÃO: Assistants API vs Responses API

| Característica | Assistants API | Responses API |
|----------------|----------------|--------------|
| **Status** | ⚠️ Deprecado (removido em 2026) | ✅ Recomendado |
| **Function Calling** | ✅ Suportado nativamente | ⚠️ Verificar suporte |
| **Threads** | ✅ Automático | ⚠️ Verificar suporte |
| **Prompt Management** | ❌ Estático no dashboard | ✅ Prompt Objects (versionado) |
| **Custo** | Mais caro | Mais barato |
| **Complexidade** | Mais complexo | Mais simples |

---

## ✅ CHECKLIST DE MIGRAÇÃO

### **Preparação (Abril - Junho 2025)**
- [ ] Entender Responses API completamente
- [ ] Verificar se Responses API suporta function calling
- [ ] Criar Prompt Object do NOEL na OpenAI Platform
- [ ] Documentar variáveis necessárias
- [ ] Criar plano de teste

### **Implementação (Julho - Setembro 2025)**
- [ ] Atualizar `noel-assistant-handler.ts` para suportar Responses API
- [ ] Adicionar variável `NOEL_PROMPT_ID` no código
- [ ] Implementar fallback para Assistants API
- [ ] Testar function calling
- [ ] Testar threads/conversas

### **Validação (Outubro 2025 - Julho 2026)**
- [ ] Testar em ambiente de desenvolvimento
- [ ] Testar em produção (paralelo)
- [ ] Validar todas as functions
- [ ] Validar performance
- [ ] Validar custos

### **Finalização (Antes de Agosto 2026)**
- [ ] Tornar Responses API padrão
- [ ] Remover código de Assistants API
- [ ] Remover variável `OPENAI_ASSISTANT_NOEL_ID`
- [ ] Atualizar documentação
- [ ] Comunicar mudança aos usuários (se necessário)

---

## 🔗 REFERÊNCIAS

### **Documentação OpenAI:**
- Responses API: https://platform.openai.com/docs/guides/responses
- Assistants API Deprecation: https://platform.openai.com/docs/assistants/overview

### **Código de Referência (LYA):**
- `src/app/api/nutri/lya/route.ts` - Exemplo de implementação Responses API
- `docs/TEMPLATE-PROMPT-OBJECT-LYA.md` - Template para criar Prompt Object

---

## 💡 RECOMENDAÇÃO FINAL

**Ação Imediata:** Nenhuma ação urgente necessária.

**Ação em Abril 2025:**
1. Começar a estudar Responses API
2. Criar Prompt Object do NOEL
3. Planejar implementação

**Ação em Julho 2025:**
1. Implementar código para Responses API
2. Testar em paralelo com Assistants API
3. Validar function calling

**Ação Antes de Agosto 2026:**
1. Completar migração
2. Remover Assistants API
3. Validar tudo funcionando

---

## ⚠️ IMPORTANTE

- **NÃO é urgente agora** - Você tem mais de 1 ano
- **MAS precisa planejar** - Não deixe para última hora
- **Teste bem antes** - Não migre tudo de uma vez
- **Mantenha fallback** - Sempre tenha plano B

---

**Status:** ✅ Plano criado e documentado  
**Próxima Revisão:** Abril 2025
