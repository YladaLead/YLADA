# LYA - Mentora Empresarial da Nutricionista

## 📋 Status da Implementação

✅ **Estrutura Base Completa**

## 🎯 O que foi implementado

### 1. Handler Principal
- **Arquivo**: `src/lib/lya-assistant-handler.ts`
- **Função**: Gerencia integração com OpenAI Assistants API
- **Functions suportadas**:
  - `getUserProfile` - Busca perfil da nutricionista
  - `saveInteraction` - Salva interações
  - `getNutriContext` - Busca contexto completo
  - `getFlowInfo` - Informações de fluxos empresariais
  - `getResourceInfo` - Informações de recursos

### 2. API Routes
- **Principal**: `src/app/api/nutri/lya/route.ts`
  - Endpoint: `POST /api/nutri/lya`
  - Processa mensagens e retorna respostas da LYA

- **Functions**:
  - `src/app/api/nutri/lya/getUserProfile/route.ts`
  - `src/app/api/nutri/lya/saveInteraction/route.ts`
  - `src/app/api/nutri/lya/getNutriContext/route.ts`

### 3. Types TypeScript
- **Arquivo**: `src/types/nutri-lya.ts`
- **Types definidos**:
  - `NutriProfile` - Perfis da nutricionista
  - `NutriState` - Estados emocionais-operacionais
  - `LyaFlow` - Fluxos empresariais
  - `LyaCycle` - Ciclos de ritmo
  - `LyaInteraction` - Interações
  - `LyaContext` - Contexto persistente

### 4. Componente de Chat
- **Arquivo**: `src/components/nutri/LyaChatWidget.tsx`
- **Características**:
  - Widget flutuante (similar ao SupportChatWidget)
  - Interface roxa (diferenciação visual)
  - Suporte a thread persistence
  - Mensagens em tempo real

### 5. Integração no Layout
- **Arquivo**: `src/components/nutri/ConditionalWidget.tsx`
- **Mudança**: Agora mostra tanto LYA quanto SupportChatWidget na área Nutri

### 6. Migration SQL
- **Arquivo**: `migrations/150-criar-tabelas-lya-nutri.sql`
- **Tabelas criadas**:
  - `lya_interactions` - Histórico de interações
  - `lya_context` - Contexto persistente da nutricionista
- **Features**:
  - RLS (Row Level Security) habilitado
  - Índices para performance
  - Triggers para updated_at automático

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Adicione no `.env` ou `.env.local`:

```bash
# OpenAI Assistants API - LYA
OPENAI_ASSISTANT_LYA_ID=asst_xxxxxxxxxxxxx

# Secret para autenticação de functions (opcional)
OPENAI_FUNCTION_SECRET=seu_secret_aqui
```

### 2. Criar Assistant no OpenAI

1. Acesse: https://platform.openai.com/assistants
2. Clique em "Create Assistant"
3. Configure:
   - **Name**: LYA - Mentora Empresarial
   - **Model**: `gpt-4-turbo` ou `gpt-4`
   - **Instructions**: Cole o **System Prompt Final da LYA v1.0** (do DOSSIÊ)
   - **Tools**: Adicione as functions:
     - `getUserProfile`
     - `saveInteraction`
     - `getNutriContext`
     - `getFlowInfo`
     - `getResourceInfo`

### 3. Executar Migration

Execute no Supabase:

```sql
-- Executar o arquivo:
migrations/150-criar-tabelas-lya-nutri.sql
```

Ou via Supabase CLI:

```bash
supabase db push
```

## 📚 System Prompt da LYA

O System Prompt completo está no DOSSIÊ LYA v1.0 (gerado pelo ChatGPT).

**Localização**: Deve ser copiado do DOSSIÊ e colado nas Instructions do Assistant no OpenAI.

**Principais seções**:
1. Identidade e Missão
2. Arquitetura de Comportamento
3. Detecção de Contexto
4. Fluxos Empresariais
5. Scripts Oficiais
6. Links e Direcionamentos
7. Rotinas e Ritmo
8. Segurança e Limites

## 🎨 Diferenças visuais

- **LYA**: Cor roxa (`purple-600`)
- **Support**: Cor azul (`blue-600`)
- **Ambos aparecem** na área Nutri (lado direito, empilhados)

## 🔄 Fluxo de Funcionamento

1. Usuário envia mensagem no widget
2. Frontend chama `/api/nutri/lya`
3. API autentica usuário
4. Handler processa via Assistants API
5. Functions são executadas quando necessário
6. Resposta retornada ao usuário
7. Interação salva no Supabase

## 📊 Estrutura de Dados

### lya_interactions
Armazena todas as conversas:
- Mensagens do usuário e respostas da LYA
- Perfil e estado detectados
- Fluxo e ciclo usados
- Thread ID para continuidade

### lya_context
Contexto persistente:
- Perfil atual da nutricionista
- Estado emocional-operacional
- Fluxo ativo
- Ciclo de ritmo

## 🚀 Próximos Passos

1. ✅ Estrutura base criada
2. ⏳ Configurar Assistant no OpenAI (manual)
3. ⏳ Testar integração completa
4. ⏳ Ajustar System Prompt se necessário
5. ⏳ Adicionar mais functions conforme necessário

## 📝 Notas Importantes

- A LYA usa **apenas Assistants API** (não usa fallback)
- Baseada no **DOSSIÊ LYA v1.0** como fonte única de verdade
- Segue a mesma arquitetura do NOEL (Wellness)
- Focada em **desenvolvimento empresarial**, não técnico
- Prioriza **organização e rotina** antes de crescimento

## 🔗 Referências

- DOSSIÊ LYA v1.0 (completo)
- System Prompt Final da LYA
- Prompt Técnico para Claude
- Estrutura do NOEL (referência técnica)

---

**Última atualização**: 2024
**Versão**: 1.0.0
