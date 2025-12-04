# 🤖 Integração NOEL com OpenAI Assistants

## 📋 Visão Geral

O NOEL Wellness atualmente usa **Chat Completions** (API direta). Vamos migrar para **OpenAI Assistants** para melhor gerenciamento de contexto e threads.

## 🎯 Estrutura Proposta

### **3 Assistants (um para cada módulo NOEL):**

1. **NOEL Mentor** (`OPENAI_ASSISTANT_NOEL_MENTOR_ID`)
   - Foco: Estratégias, vendas, motivação, duplicação
   - Modelo: `gpt-4o` (análises profundas)

2. **NOEL Suporte** (`OPENAI_ASSISTANT_NOEL_SUPORTE_ID`)
   - Foco: Instruções técnicas do sistema YLADA
   - Modelo: `gpt-4o-mini` (respostas diretas)

3. **NOEL Técnico** (`OPENAI_ASSISTANT_NOEL_TECNICO_ID`)
   - Foco: Bebidas funcionais, campanhas, scripts
   - Modelo: `gpt-4o-mini` (conteúdo operacional)

## 🔧 Como Proceder

### **Opção 1: Reutilizar Assistants Existentes (Recomendado)**

1. **Na plataforma OpenAI:**
   - Identifique 3 assistentes existentes que você quer reutilizar
   - Anote os IDs (ex: `asst_abc123...`)
   - Atualize os nomes/instruções conforme necessário

2. **Variáveis de ambiente:**
   ```env
   OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_xxxxxxxxxxxxx
   OPENAI_ASSISTANT_NOEL_SUPORTE_ID=asst_xxxxxxxxxxxxx
   OPENAI_ASSISTANT_NOEL_TECNICO_ID=asst_xxxxxxxxxxxxx
   ```

3. **Envie os prompts aqui:**
   - Para revisão e alinhamento com a lógica do NOEL
   - Vou ajustar se necessário para integrar com base de conhecimento

### **Opção 2: Criar Novos Assistants**

1. **Criar 3 novos assistants na plataforma OpenAI**
2. **Usar os prompts que vou fornecer** (baseados no `buildSystemPrompt` atual)
3. **Configurar variáveis de ambiente**

## 📝 O Que Preciso de Você

1. **IDs dos Assistants** (3 IDs, um para cada módulo)
2. **Os prompts que você vai usar** (para revisão)
3. **Confirmação:** Reutilizar existentes ou criar novos?

## 🔄 Mudanças no Código

Após receber os IDs e prompts, vou:

1. **Atualizar `/api/wellness/noel/route.ts`:**
   - Adicionar lógica para usar Assistants quando necessário
   - Manter prioridade: Base de Conhecimento → Assistants → Fallback

2. **Criar helper para gerenciar threads:**
   - Uma thread por usuário/módulo
   - Persistir thread IDs no Supabase

3. **Manter lógica atual:**
   - Classificação de intenção (mentor/suporte/técnico)
   - Busca na base de conhecimento primeiro
   - Personalização com contexto do consultor

## ✅ Vantagens dos Assistants

- ✅ Melhor gerenciamento de contexto
- ✅ Threads persistentes
- ✅ Menos tokens (contexto gerenciado pela OpenAI)
- ✅ Melhor para conversas longas
- ✅ File attachments (futuro)

## 🚀 Próximos Passos

1. **Você:** Envia IDs e prompts dos assistants
2. **Eu:** Reviso e ajusto prompts se necessário
3. **Eu:** Atualizo código para usar Assistants
4. **Teste:** Validamos funcionamento

---

**Status:** Aguardando IDs e prompts dos assistants

