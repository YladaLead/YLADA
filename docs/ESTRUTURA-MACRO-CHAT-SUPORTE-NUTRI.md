# 📋 ESTRUTURA MACRO - SISTEMA DE CHAT/SUPORTE ÁREA NUTRI

**Data:** Janeiro 2025  
**Status:** Planejamento  
**Área:** Nutri (será replicado para Coach e Wellness depois)

---

## 🎯 VISÃO GERAL

Sistema completo de suporte com bot inteligente e chat humano integrado, específico para a área Nutri, com capacidade de expansão para outras áreas.

---

## 🏗️ ARQUITETURA MACRO

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐    ┌──────────────────────────┐    │
│  │ SupportChatWidget │    │ SupportAgentDashboard    │    │
│  │ (Usuário Nutri)   │    │ (Atendente)              │    │
│  └──────────────────┘    └──────────────────────────┘    │
│           │                          │                     │
│           │                          │                     │
└───────────┼──────────────────────────┼─────────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│              API ROUTES (Next.js API)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /api/nutri/support/faq          → Buscar respostas         │
│  /api/nutri/support/chat         → Enviar mensagem          │
│  /api/nutri/support/tickets      → Gerenciar tickets        │
│  /api/nutri/support/agents       → Gerenciar atendentes     │
│  /api/nutri/support/messages     → Histórico de mensagens   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│           BANCO DE DADOS (Supabase PostgreSQL)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  faq_responses          → Perguntas e respostas             │
│  support_tickets        → Tickets de suporte                │
│  support_messages       → Mensagens do chat                 │
│  support_agents         → Atendentes                        │
│  support_conversations  → Histórico bot                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│         REALTIME (Supabase Realtime)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Notificações instantâneas para atendentes                  │
│  Atualização de status em tempo real                        │
│  Sincronização de mensagens                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 ESTRUTURA DE BANCO DE DADOS

### 1. `faq_responses` - Perguntas e Respostas

```sql
CREATE TABLE faq_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(50) NOT NULL DEFAULT 'nutri', -- 'nutri', 'coach', 'wellness'
  
  -- Conteúdo
  pergunta TEXT NOT NULL,
  palavras_chave TEXT[] NOT NULL, -- ['criar', 'calculadora', 'imc']
  resposta_completa TEXT NOT NULL, -- Resposta passo a passo completa
  resposta_resumida TEXT, -- Versão curta (opcional)
  
  -- Organização
  categoria VARCHAR(100) NOT NULL, -- 'ferramentas', 'formularios', 'clientes'
  subcategoria VARCHAR(100), -- 'calculadoras', 'quizzes', 'checklists'
  tags TEXT[], -- Tags adicionais para busca
  
  -- Mídia (opcional)
  video_url TEXT, -- Link para vídeo tutorial
  pdf_url TEXT, -- Link para PDF
  thumbnail_url TEXT, -- Imagem do vídeo
  
  -- Metadados
  ordem_prioridade INTEGER DEFAULT 0, -- Para ordenar resultados
  visualizacoes INTEGER DEFAULT 0, -- Quantas vezes foi visualizado
  foi_util INTEGER DEFAULT 0, -- Quantas vezes resolveu dúvida
  nao_resolveu INTEGER DEFAULT 0, -- Quantas vezes não resolveu
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_faq_area ON faq_responses(area);
CREATE INDEX idx_faq_categoria ON faq_responses(categoria);
CREATE INDEX idx_faq_palavras_chave ON faq_responses USING GIN(palavras_chave);
CREATE INDEX idx_faq_tags ON faq_responses USING GIN(tags);
```

### 2. `support_tickets` - Tickets de Suporte

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(50) NOT NULL DEFAULT 'nutri',
  
  -- Usuário
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'aguardando', 
  -- 'aguardando', 'em_atendimento', 'resolvido', 'fechado'
  
  -- Classificação
  categoria VARCHAR(100), -- Categoria da dúvida
  assunto TEXT, -- Resumo da dúvida
  prioridade VARCHAR(20) DEFAULT 'normal', -- 'baixa', 'normal', 'alta', 'urgente'
  
  -- Atendimento
  agent_id UUID REFERENCES auth.users(id), -- Atendente atribuído
  assigned_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Histórico
  primeira_mensagem TEXT, -- Primeira mensagem do usuário
  ultima_mensagem TEXT, -- Última mensagem
  ultima_mensagem_em TIMESTAMP WITH TIME ZONE,
  
  -- Métricas
  tempo_resposta_segundos INTEGER, -- Tempo até primeira resposta
  tempo_resolucao_segundos INTEGER, -- Tempo total até resolução
  mensagens_count INTEGER DEFAULT 0,
  
  -- Feedback
  satisfacao INTEGER, -- 1-5 (após fechamento)
  feedback TEXT, -- Comentário do usuário
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tickets_area ON support_tickets(area);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_agent ON support_tickets(agent_id);
CREATE INDEX idx_tickets_created ON support_tickets(created_at DESC);
```

### 3. `support_messages` - Mensagens do Chat

```sql
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  
  -- Remetente
  sender_type VARCHAR(20) NOT NULL, -- 'user', 'bot', 'agent'
  sender_id UUID REFERENCES auth.users(id),
  sender_name VARCHAR(255), -- Nome do remetente (cache)
  
  -- Conteúdo
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file', 'system'
  attachments JSONB, -- Array de anexos (opcional)
  
  -- Bot
  is_bot_response BOOLEAN DEFAULT false,
  faq_id UUID REFERENCES faq_responses(id), -- Se foi resposta do bot
  
  -- Status
  lida BOOLEAN DEFAULT false,
  lida_em TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_messages_ticket ON support_messages(ticket_id);
CREATE INDEX idx_messages_created ON support_messages(created_at);
CREATE INDEX idx_messages_sender ON support_messages(sender_type, sender_id);
```

### 4. `support_agents` - Atendentes

```sql
CREATE TABLE support_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL DEFAULT 'nutri', -- Pode atender múltiplas áreas
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'offline',
  -- 'online', 'offline', 'ocupado', 'pausado'
  
  -- Capacidade
  max_concurrent_tickets INTEGER DEFAULT 3, -- Máximo simultâneo
  current_tickets_count INTEGER DEFAULT 0, -- Atual
  
  -- Métricas
  total_tickets_atendidos INTEGER DEFAULT 0,
  tickets_resolvidos INTEGER DEFAULT 0,
  tempo_medio_resposta_segundos INTEGER,
  satisfacao_media DECIMAL(3,2), -- Média de satisfação
  
  -- Preferências
  categorias_preferidas TEXT[], -- Categorias que prefere atender
  auto_accept BOOLEAN DEFAULT false, -- Aceitar automaticamente
  
  -- Atividade
  last_activity TIMESTAMP WITH TIME ZONE,
  last_status_change TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_agents_area ON support_agents(area);
CREATE INDEX idx_agents_status ON support_agents(status);
CREATE INDEX idx_agents_user ON support_agents(user_id);
```

### 5. `support_conversations` - Histórico Bot

```sql
CREATE TABLE support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  
  -- Conversa com bot
  user_message TEXT NOT NULL, -- O que usuário perguntou
  bot_response TEXT, -- O que bot respondeu
  faq_id UUID REFERENCES faq_responses(id), -- Qual FAQ foi usado
  
  -- Resultado
  bot_resolveu BOOLEAN, -- Se bot resolveu ou não
  usuario_satisfeito BOOLEAN, -- Feedback do usuário
  
  -- Busca
  palavras_buscadas TEXT[], -- Palavras que foram buscadas
  faqs_sugeridos UUID[], -- FAQs que foram sugeridos
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_conversations_ticket ON support_conversations(ticket_id);
CREATE INDEX idx_conversations_faq ON support_conversations(faq_id);
```

---

## 🔌 ESTRUTURA DE APIs

### 1. `/api/nutri/support/faq`

**GET** - Buscar respostas
```
Query params:
- search: string (busca por palavras)
- categoria: string (filtrar por categoria)
- subcategoria: string (filtrar por subcategoria)
- limit: number (limite de resultados)

Response:
{
  success: true,
  results: [
    {
      id: string,
      pergunta: string,
      resposta_completa: string,
      categoria: string,
      video_url: string,
      pdf_url: string,
      relevancia: number
    }
  ]
}
```

**POST** - Criar FAQ (admin)
```
Body:
{
  pergunta: string,
  palavras_chave: string[],
  resposta_completa: string,
  categoria: string,
  subcategoria?: string,
  video_url?: string,
  pdf_url?: string
}
```

**PUT** - Atualizar FAQ (admin)
**DELETE** - Deletar FAQ (admin)

---

### 2. `/api/nutri/support/chat`

**POST** - Enviar mensagem
```
Body:
{
  message: string,
  ticket_id?: string (se já existe ticket)
}

Response:
{
  success: true,
  bot_response?: {
    faq_id: string,
    resposta: string,
    video_url?: string,
    pdf_url?: string
  },
  ticket_created?: boolean,
  ticket_id?: string,
  menu_options?: string[] (se bot não encontrou)
}
```

**GET** - Buscar histórico
```
Query params:
- ticket_id: string

Response:
{
  success: true,
  messages: [
    {
      id: string,
      sender_type: 'user' | 'bot' | 'agent',
      message: string,
      created_at: string
    }
  ]
}
```

---

### 3. `/api/nutri/support/tickets`

**GET** - Listar tickets
```
Query params:
- status?: string
- user_id?: string (para usuário ver seus tickets)
- agent_id?: string (para atendente ver seus tickets)

Response:
{
  success: true,
  tickets: [
    {
      id: string,
      status: string,
      assunto: string,
      categoria: string,
      created_at: string,
      agent?: {
        id: string,
        name: string
      }
    }
  ]
}
```

**POST** - Criar ticket
```
Body:
{
  assunto: string,
  categoria: string,
  primeira_mensagem: string,
  prioridade?: 'baixa' | 'normal' | 'alta'
}
```

**PUT** - Atualizar ticket
```
Body:
{
  status?: string,
  agent_id?: string,
  prioridade?: string
}
```

**GET /[id]** - Detalhes do ticket

---

### 4. `/api/nutri/support/agents`

**GET** - Listar atendentes
```
Query params:
- status?: string
- area?: string

Response:
{
  success: true,
  agents: [
    {
      id: string,
      user_id: string,
      name: string,
      status: string,
      current_tickets: number,
      max_tickets: number
    }
  ]
}
```

**PUT /status** - Atualizar status
```
Body:
{
  status: 'online' | 'offline' | 'ocupado' | 'pausado'
}
```

**POST /accept-ticket** - Aceitar ticket
```
Body:
{
  ticket_id: string
}
```

---

### 5. `/api/nutri/support/messages`

**POST** - Enviar mensagem (usuário ou atendente)
```
Body:
{
  ticket_id: string,
  message: string,
  attachments?: []
}
```

**GET** - Buscar mensagens
```
Query params:
- ticket_id: string
- limit?: number
- offset?: number
```

---

## 🎨 ESTRUTURA DE COMPONENTES FRONTEND

### 1. `SupportChatWidget` (Usuário)

**Localização:** `src/components/nutri/SupportChatWidget.tsx`

**Funcionalidades:**
- Widget flutuante no canto da tela
- Abrir/fechar chat
- Exibir mensagens (usuário, bot, atendente)
- Input para digitar mensagem
- Menu de categorias
- Botão "Falar com humano"
- Indicador de status (online, digitando, etc)

**Props:**
```typescript
interface SupportChatWidgetProps {
  area?: 'nutri' | 'coach' | 'wellness'
  userId: string
  minimized?: boolean
}
```

---

### 2. `SupportMenu` (Menu de Categorias)

**Localização:** `src/components/nutri/support/SupportMenu.tsx`

**Funcionalidades:**
- Menu principal com categorias
- Submenus por categoria
- Busca rápida
- Histórico de conversas
- Botão sempre visível para falar com humano

**Categorias:**
1. 🛠️ Ferramentas e Templates
2. 📝 Formulários
3. 👥 Clientes e Leads
4. 🌐 Portais e Compartilhamento
5. ⚙️ Configurações
6. 📊 Relatórios
7. ❓ Outras Dúvidas
8. 👤 Falar com Atendente

---

### 3. `FAQResponse` (Renderizar Resposta)

**Localização:** `src/components/nutri/support/FAQResponse.tsx`

**Funcionalidades:**
- Renderizar resposta formatada
- Exibir passo a passo
- Links para vídeos
- Links para PDFs
- Botões de ação (resolvido/não resolveu)

**Estrutura visual:**
```
┌─────────────────────────────────┐
│ 📌 TÍTULO                       │
├─────────────────────────────────┤
│ 🎯 O QUE VOCÊ VAI APRENDER      │
│ • Ponto 1                       │
│ • Ponto 2                       │
├─────────────────────────────────┤
│ 📝 PASSO A PASSO                │
│ Passo 1: ...                    │
│ Passo 2: ...                    │
├─────────────────────────────────┤
│ 💡 DICAS                        │
│ ⚠️ PROBLEMAS COMUNS             │
├─────────────────────────────────┤
│ [🎥 Ver vídeo] [📄 Baixar PDF]  │
│ [✅ Resolveu] [❌ Não resolveu] │
└─────────────────────────────────┘
```

---

### 4. `SupportAgentDashboard` (Atendente)

**Localização:** `src/components/nutri/support/SupportAgentDashboard.tsx`

**Funcionalidades:**
- Painel principal do atendente
- Lista de tickets aguardando
- Tickets em atendimento
- Chat ativo
- Status (online/offline/ocupado)
- Notificações
- Métricas (tickets atendidos, tempo médio)

**Seções:**
1. Status e controles
2. Tickets aguardando (fila)
3. Tickets em atendimento
4. Chat ativo
5. Métricas e estatísticas

---

### 5. `SupportChatWindow` (Janela de Chat)

**Localização:** `src/components/nutri/support/SupportChatWindow.tsx`

**Funcionalidades:**
- Janela de chat completa
- Histórico de mensagens
- Input de mensagem
- Envio de arquivos (opcional)
- Indicadores de leitura
- Timestamps

---

### 6. `SupportNotification` (Notificações)

**Localização:** `src/components/nutri/support/SupportNotification.tsx`

**Funcionalidades:**
- Notificações no navegador
- Badge de contador
- Som de notificação
- Toast notifications

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo 1: Usuário faz pergunta ao bot

```
1. Usuário abre chat
   ↓
2. Digita pergunta ou escolhe do menu
   ↓
3. Sistema busca no FAQ por palavras-chave
   ↓
4a. Se encontrou → Exibe resposta completa
    ↓
    Usuário avalia: Resolveu? Não resolveu?
    ↓
    Se resolveu → Fim
    Se não → Cria ticket
   ↓
4b. Se não encontrou → Mostra menu ou cria ticket
   ↓
5. Ticket criado → Notifica atendentes
```

---

### Fluxo 2: Atendente recebe ticket

```
1. Sistema cria ticket
   ↓
2. Busca atendentes online e disponíveis
   ↓
3. Notifica atendentes (realtime)
   ↓
4. Atendente vê notificação
   ↓
5. Atendente clica "Aceitar"
   ↓
6. Ticket muda status para "em_atendimento"
   ↓
7. Chat é aberto com histórico completo
   ↓
8. Atendente conversa com usuário
   ↓
9. Quando resolve → Marca como "resolvido"
   ↓
10. Usuário avalia atendimento (opcional)
```

---

### Fluxo 3: Busca inteligente

```
1. Usuário digita: "como criar calculadora"
   ↓
2. Sistema divide em palavras: ["como", "criar", "calculadora"]
   ↓
3. Busca no banco:
   - Palavras-chave que contêm essas palavras
   - Ordena por relevância (quantidade de matches)
   - Ordena por prioridade
   ↓
4. Retorna top 3-5 resultados
   ↓
5. Se relevância > threshold → Mostra resposta
   Se não → Oferece menu ou cria ticket
```

---

## 📁 CATEGORIAS E ORGANIZAÇÃO

### Categorias Principais

1. **Ferramentas e Templates**
   - Calculadoras (IMC, Proteína, Água, Calorias)
   - Quizzes (Interativo, Bem-Estar, Perfil Nutricional, Detox, Energético)
   - Checklists (Detox, Alimentar)
   - Guias (Nutracêutico, Proteico, Hidratação)
   - Tabelas (Comparativa, Substituições, Sintomas)

2. **Formulários**
   - Criar formulário
   - Usar formulários pré-montados
   - Editar formulários
   - Enviar para clientes
   - Visualizar respostas

3. **Clientes e Leads**
   - Visualizar leads
   - Converter leads
   - Criar cliente
   - Gerenciar clientes
   - Kanban
   - Importar pacientes

4. **Portais e Compartilhamento**
   - Criar portal
   - Organizar ferramentas
   - Gerar links
   - Gerar QR codes
   - Short codes

5. **Configurações**
   - Perfil
   - Telefone
   - Slug
   - Bio

6. **Relatórios**
   - Leads e conversões
   - Relatórios de gestão

7. **Problemas Técnicos**
   - Erros comuns
   - Problemas ao salvar
   - Problemas de acesso

---

## 🎯 PRÓXIMOS PASSOS (ORDEM DE IMPLEMENTAÇÃO)

### Fase 1: Estrutura Base (Semana 1)
- [ ] Criar tabelas no Supabase
- [ ] Criar APIs básicas (FAQ, Chat, Tickets)
- [ ] Criar componente SupportChatWidget básico
- [ ] Implementar busca simples por palavras-chave

### Fase 2: Conteúdo (Semana 2)
- [ ] Criar 50-100 perguntas/respostas principais
- [ ] Organizar por categorias
- [ ] Testar busca e respostas
- [ ] Criar menu de categorias

### Fase 3: Dashboard Atendente (Semana 3)
- [ ] Criar SupportAgentDashboard
- [ ] Sistema de notificações (Realtime)
- [ ] Chat entre atendente e usuário
- [ ] Sistema de fila e distribuição

### Fase 4: Melhorias (Semana 4)
- [ ] Adicionar links para vídeos
- [ ] Adicionar links para PDFs
- [ ] Melhorar busca (relevância)
- [ ] Analytics e métricas
- [ ] Feedback e satisfação

---

## 📝 NOTAS IMPORTANTES

1. **Multi-área:** Estrutura preparada para replicar para Coach e Wellness
2. **Escalável:** Banco de dados otimizado com índices
3. **Realtime:** Usa Supabase Realtime para notificações
4. **Extensível:** Fácil adicionar novas categorias e FAQs
5. **Métricas:** Sistema coleta dados para melhorias futuras

---

## 🔗 ARQUIVOS RELACIONADOS

- `docs/CHECKLIST-TUTORIAIS-VIDEO-NUTRI.md` - Checklist de vídeos
- `docs/ESTRUTURA-MACRO-CHAT-SUPORTE-NUTRI.md` - Este documento
- (Futuro) `docs/IMPLEMENTACAO-CHAT-SUPORTE-DETALHADA.md` - Detalhamento técnico

---

**Próximo passo:** Desmembrar cada seção em documentos detalhados e começar implementação pela Fase 1.

