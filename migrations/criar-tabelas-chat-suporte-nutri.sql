-- =====================================================
-- YLADA - SISTEMA DE CHAT/SUPORTE ÁREA NUTRI
-- Criação das tabelas para suporte com bot e atendentes
-- =====================================================

-- =====================================================
-- 1. FAQ_RESPONSES - Perguntas e Respostas
-- =====================================================

CREATE TABLE IF NOT EXISTS faq_responses (
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

-- Índices para FAQ
CREATE INDEX IF NOT EXISTS idx_faq_area ON faq_responses(area);
CREATE INDEX IF NOT EXISTS idx_faq_categoria ON faq_responses(categoria);
CREATE INDEX IF NOT EXISTS idx_faq_palavras_chave ON faq_responses USING GIN(palavras_chave);
CREATE INDEX IF NOT EXISTS idx_faq_tags ON faq_responses USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_faq_ativo ON faq_responses(ativo) WHERE ativo = true;

-- =====================================================
-- 2. SUPPORT_TICKETS - Tickets de Suporte
-- =====================================================

CREATE TABLE IF NOT EXISTS support_tickets (
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

-- Índices para Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_area ON support_tickets(area);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_agent ON support_tickets(agent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_status_created ON support_tickets(status, created_at DESC);

-- =====================================================
-- 3. SUPPORT_MESSAGES - Mensagens do Chat
-- =====================================================

CREATE TABLE IF NOT EXISTS support_messages (
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

-- Índices para Mensagens
CREATE INDEX IF NOT EXISTS idx_messages_ticket ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON support_messages(sender_type, sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_ticket_created ON support_messages(ticket_id, created_at);

-- =====================================================
-- 4. SUPPORT_AGENTS - Atendentes
-- =====================================================

CREATE TABLE IF NOT EXISTS support_agents (
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

-- Índices para Atendentes
CREATE INDEX IF NOT EXISTS idx_agents_area ON support_agents(area);
CREATE INDEX IF NOT EXISTS idx_agents_status ON support_agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_user ON support_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status_area ON support_agents(status, area) WHERE status = 'online';

-- =====================================================
-- 5. SUPPORT_CONVERSATIONS - Histórico Bot
-- =====================================================

CREATE TABLE IF NOT EXISTS support_conversations (
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

-- Índices para Conversas
CREATE INDEX IF NOT EXISTS idx_conversations_ticket ON support_conversations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_conversations_faq ON support_conversations(faq_id);

-- =====================================================
-- 6. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_faq_responses_updated_at BEFORE UPDATE ON faq_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_agents_updated_at BEFORE UPDATE ON support_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE faq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (serão ajustadas depois)
-- Por enquanto, permitir tudo para autenticados (será refinado)

-- FAQ: Todos autenticados podem ler
CREATE POLICY "FAQ - Leitura para autenticados" ON faq_responses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Tickets: Usuário vê seus próprios tickets, atendentes veem todos
CREATE POLICY "Tickets - Usuário vê próprios" ON support_tickets
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT user_id FROM support_agents)
    );

CREATE POLICY "Tickets - Usuário cria próprios" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mensagens: Usuário vê mensagens de seus tickets, atendentes veem todas
CREATE POLICY "Messages - Acesso por ticket" ON support_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM support_tickets WHERE id = ticket_id
        ) OR
        auth.uid() IN (SELECT user_id FROM support_agents)
    );

CREATE POLICY "Messages - Criar mensagens" ON support_messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM support_tickets WHERE id = ticket_id
        ) OR
        auth.uid() IN (SELECT user_id FROM support_agents)
    );

-- Agents: Apenas admins e o próprio agente
CREATE POLICY "Agents - Acesso próprio e admin" ON support_agents
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
    );

-- =====================================================
-- 8. VERIFICAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN (
    'faq_responses',
    'support_tickets',
    'support_messages',
    'support_agents',
    'support_conversations'
  )
ORDER BY table_name;

