# 📋 RESUMO EXECUTIVO - Migração Assistants API → Responses API

**Prazo:** Agosto de 2026 (aproximadamente 19 meses)  
**Status:** ⚠️ Planejamento necessário (não urgente agora)

---

## 🚨 O QUE ACONTECEU

A OpenAI anunciou que a **Assistants API** será **removida em agosto de 2026**. A substituição recomendada é a **Responses API**.

---

## ⏰ QUANDO FAZER

### **Cronograma Simplificado:**

| Quando | O Que Fazer |
|--------|------------|
| **Agora - Março 2025** | ✅ Nada urgente |
| **Abril - Junho 2025** | 📋 Planejar migração |
| **Julho - Setembro 2025** | 🔧 Implementar |
| **Outubro 2025 - Julho 2026** | 🧪 Testar |
| **Agosto 2026** | ⚠️ Assistants API será removida |

**Resumo:** Você tem mais de 1 ano. Não precisa fazer nada agora, mas deve começar a planejar em abril de 2025.

---

## 🎯 O QUE PRECISA SER FEITO

### **1. NOEL (Wellness) - Precisa Migrar**

**Situação:**
- Atualmente usa `OPENAI_ASSISTANT_NOEL_ID` (Assistants API)
- Precisa migrar para Responses API

**Ações:**
1. Criar Prompt Object do NOEL na OpenAI Platform
2. Atualizar código para usar Responses API
3. Testar function calling

### **2. LYA (Nutri) - Já Preparada**

**Situação:**
- ✅ Já tem código preparado para Responses API
- ✅ Usa `LYA_PROMPT_ID` quando disponível
- ⏳ Só precisa testar quando Responses API estiver totalmente disponível

---

## 📋 COMO FAZER (Resumo)

### **PASSO 1: Criar Prompt Object (Abril 2025)**
1. Acesse: https://platform.openai.com/prompts
2. Crie novo Prompt Object
3. Cole o prompt do NOEL v3.7
4. Copie o ID (`pmpt_...`)

### **PASSO 2: Atualizar Código (Julho 2025)**
1. Adicionar suporte para Responses API no `noel-assistant-handler.ts`
2. Adicionar variável `NOEL_PROMPT_ID` no `.env`
3. Manter fallback para Assistants API durante transição

### **PASSO 3: Testar (Setembro 2025)**
1. Testar em paralelo com Assistants API
2. Validar function calling
3. Validar todas as funcionalidades

### **PASSO 4: Finalizar (Antes de Agosto 2026)**
1. Tornar Responses API padrão
2. Remover código de Assistants API
3. Validar tudo funcionando

---

## ✅ AÇÃO IMEDIATA

**Nenhuma ação urgente necessária agora.**

**Mas você deve:**
1. ✅ Entender que precisa migrar até agosto de 2026
2. ✅ Marcar no calendário: "Começar planejamento em abril 2025"
3. ✅ Revisar este plano em abril de 2025

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para detalhes completos, veja:
- `docs/PLANO-MIGRACAO-ASSISTANTS-API-PARA-RESPONSES-API.md` - Plano detalhado completo

---

**Status:** ✅ Plano criado  
**Próxima Ação:** Revisar em abril de 2025
