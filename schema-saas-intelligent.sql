-- ========================================
-- YLADA SAAS INTELIGENTE - SCHEMA COMPLETO
-- ========================================
-- Objetivo: Plataforma SaaS com IA contextual e dados valiosos para venda

-- ========================================
-- 1. USUÁRIOS E PERFIS COMPLETOS
-- ========================================

-- Tabela principal de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
    status VARCHAR(20) DEFAULT 'active' -- active, suspended, cancelled
);

-- Perfil profissional detalhado
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dados profissionais
    profissao VARCHAR(100) NOT NULL,
    especializacao VARCHAR(100),
    publico_alvo VARCHAR(100),
    experiencia_anos INTEGER,
    localizacao VARCHAR(100),
    
    -- Dados de negócio
    objetivo_principal VARCHAR(100),
    faturamento_mensal DECIMAL(10,2),
    clientes_mensais INTEGER,
    plataformas_usadas TEXT[], -- ['instagram', 'whatsapp', 'site']
    
    -- Preferências de comunicação
    tom_comunicacao VARCHAR(50), -- 'profissional', 'leve', 'divertido'
    idioma_preferido VARCHAR(10) DEFAULT 'pt',
    timezone VARCHAR(50),
    
    -- Metadados para IA
    nivel_tecnico VARCHAR(20) DEFAULT 'iniciante', -- iniciante, intermediario, avancado
    preferencias_ferramentas TEXT[], -- ['quiz', 'calculadora', 'diagnostico']
    historico_sucessos TEXT, -- JSON com ferramentas que mais converteram
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. FERRAMENTAS E TEMPLATES INTELIGENTES
-- ========================================

-- Templates de ferramentas por profissão
CREATE TABLE IF NOT EXISTS tool_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- quiz, calculadora, diagnostico, checklist, desafio
    profissao VARCHAR(100) NOT NULL,
    especializacao VARCHAR(100),
    publico_alvo VARCHAR(100),
    
    -- Conteúdo da ferramenta
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    perguntas JSONB, -- Array de perguntas personalizadas
    formulas JSONB, -- Fórmulas para calculadoras
    criterios_avaliacao JSONB, -- Critérios para diagnósticos
    
    -- Metadados de performance
    taxa_conversao DECIMAL(5,2) DEFAULT 0.0,
    leads_gerados INTEGER DEFAULT 0,
    tempo_medio_completar INTEGER, -- em segundos
    satisfacao_media DECIMAL(3,2) DEFAULT 0.0,
    
    -- Configurações
    cta_padrao VARCHAR(50) DEFAULT 'formulario',
    personalizavel BOOLEAN DEFAULT true,
    ativo BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ferramentas criadas pelos usuários
CREATE TABLE IF NOT EXISTS user_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES tool_templates(id),
    
    -- Dados da ferramenta
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    
    -- Conteúdo personalizado
    perguntas JSONB,
    formulas JSONB,
    criterios_avaliacao JSONB,
    
    -- Configurações
    cta_tipo VARCHAR(50) NOT NULL,
    cta_config JSONB, -- Configurações específicas do CTA
    cor_tema VARCHAR(7) DEFAULT '#3B82F6',
    logo_url TEXT,
    
    -- Status e visibilidade
    status VARCHAR(20) DEFAULT 'active', -- active, paused, archived
    publico BOOLEAN DEFAULT true,
    
    -- Métricas de performance
    visualizacoes INTEGER DEFAULT 0,
    completacoes INTEGER DEFAULT 0,
    leads_gerados INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. LEADS E CONVERSÕES
-- ========================================

-- Leads gerados pelas ferramentas
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES user_tools(id) ON DELETE CASCADE,
    
    -- Dados do lead
    nome VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(20),
    profissao VARCHAR(100),
    especializacao VARCHAR(100),
    
    -- Dados da interação
    respostas JSONB, -- Respostas do quiz/calculadora
    resultado_final TEXT, -- Resultado do diagnóstico
    score DECIMAL(5,2), -- Pontuação final
    tempo_gasto INTEGER, -- Tempo em segundos
    
    -- Status do lead
    status VARCHAR(20) DEFAULT 'novo', -- novo, contatado, convertido, perdido
    fonte VARCHAR(50), -- instagram, whatsapp, site, email
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Metadados
    ip_address INET,
    user_agent TEXT,
    localizacao VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. ANALYTICS E MÉTRICAS PARA IA
-- ========================================

-- Métricas de performance por ferramenta
CREATE TABLE IF NOT EXISTS tool_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES user_tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Métricas de engajamento
    visualizacoes INTEGER DEFAULT 0,
    iniciacoes INTEGER DEFAULT 0,
    completacoes INTEGER DEFAULT 0,
    abandonos INTEGER DEFAULT 0,
    
    -- Métricas de conversão
    leads_gerados INTEGER DEFAULT 0,
    conversoes INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0.0,
    
    -- Métricas de tempo
    tempo_medio_completar INTEGER,
    tempo_medio_abandono INTEGER,
    
    -- Período de análise
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados de aprendizado da IA
CREATE TABLE IF NOT EXISTS ai_learning_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES user_tools(id) ON DELETE CASCADE,
    
    -- Dados da interação
    perfil_usuario JSONB, -- Perfil no momento da criação
    prompt_usuario TEXT,
    resposta_ia TEXT,
    ferramenta_criada VARCHAR(100),
    
    -- Feedback e resultados
    satisfacao_usuario INTEGER, -- 1-5
    feedback TEXT,
    leads_gerados INTEGER DEFAULT 0,
    conversao_atingida BOOLEAN DEFAULT false,
    
    -- Metadados para ML
    contexto_sessao JSONB,
    padroes_identificados TEXT[],
    sugestoes_melhoria TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. SISTEMA DE RECOMENDAÇÕES
-- ========================================

-- Recomendações personalizadas para usuários
CREATE TABLE IF NOT EXISTS user_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Tipo de recomendação
    tipo VARCHAR(50) NOT NULL, -- ferramenta, template, estrategia, cta
    categoria VARCHAR(100),
    
    -- Conteúdo da recomendação
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    acao_sugerida TEXT,
    prioridade INTEGER DEFAULT 1, -- 1-5
    
    -- Dados de contexto
    baseado_em JSONB, -- Dados que geraram a recomendação
    confianca DECIMAL(3,2) DEFAULT 0.0, -- 0.0-1.0
    
    -- Status
    visualizada BOOLEAN DEFAULT false,
    aceita BOOLEAN DEFAULT false,
    implementada BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 6. SISTEMA DE NOTIFICAÇÕES INTELIGENTES
-- ========================================

-- Notificações contextuais
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Conteúdo da notificação
    tipo VARCHAR(50) NOT NULL, -- lead_novo, ferramenta_performance, recomendacao
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT,
    acao_url TEXT,
    
    -- Contexto
    dados_contexto JSONB,
    prioridade VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Status
    lida BOOLEAN DEFAULT false,
    enviada BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lida_em TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_profissao ON user_profiles(profissao);
CREATE INDEX IF NOT EXISTS idx_user_profiles_especializacao ON user_profiles(especializacao);
CREATE INDEX IF NOT EXISTS idx_tool_templates_profissao ON tool_templates(profissao);
CREATE INDEX IF NOT EXISTS idx_tool_templates_tipo ON tool_templates(tipo);
CREATE INDEX IF NOT EXISTS idx_user_tools_user_id ON user_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tools_status ON user_tools(status);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_tool_id ON leads(tool_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_learning_user_id ON ai_learning_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_tool_id ON ai_learning_data(tool_id);

-- ========================================
-- 8. FUNÇÕES E TRIGGERS
-- ========================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_templates_updated_at BEFORE UPDATE ON tool_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tools_updated_at BEFORE UPDATE ON user_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular taxa de conversão
CREATE OR REPLACE FUNCTION calculate_conversion_rate(tool_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_leads INTEGER;
    total_conversions INTEGER;
    conversion_rate DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO total_leads FROM leads WHERE tool_id = tool_uuid;
    SELECT COUNT(*) INTO total_conversions FROM leads WHERE tool_id = tool_uuid AND status = 'convertido';
    
    IF total_leads > 0 THEN
        conversion_rate := (total_conversions::DECIMAL / total_leads::DECIMAL) * 100;
    ELSE
        conversion_rate := 0.0;
    END IF;
    
    RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 9. DADOS INICIAIS PARA IA APRENDER
-- ========================================

-- Templates padrão para nutricionistas
INSERT INTO tool_templates (nome, tipo, profissao, especializacao, titulo, descricao, perguntas, cta_padrao) VALUES
('Quiz Perfil Metabólico', 'quiz', 'nutricionista', 'emagrecimento', 'Descubra seu Perfil Metabólico', 'Quiz que identifica o tipo metabólico para personalizar estratégias de emagrecimento', 
'[{"pergunta": "Como você se sente após comer carboidratos?", "opcoes": ["Energético", "Sonolento", "Normal", "Irritado"]}, {"pergunta": "Qual seu horário de maior fome?", "opcoes": ["Manhã", "Tarde", "Noite", "Madrugada"]}]', 'formulario'),

('Calculadora Déficit Calórico', 'calculadora', 'nutricionista', 'emagrecimento', 'Seu Déficit Calórico Ideal', 'Calcula o déficit calórico perfeito para perda de peso sustentável',
'[{"campo": "peso", "tipo": "number", "label": "Peso atual (kg)"}, {"campo": "altura", "tipo": "number", "label": "Altura (cm)"}, {"campo": "idade", "tipo": "number", "label": "Idade"}, {"campo": "atividade", "tipo": "select", "label": "Nível de atividade", "opcoes": ["Sedentário", "Leve", "Moderado", "Intenso"]}]', 'whatsapp'),

('Diagnóstico Relação com Comida', 'diagnostico', 'nutricionista', 'comportamento_alimentar', 'Avalie sua Relação com a Comida', 'Identifica padrões alimentares e gatilhos emocionais',
'[{"pergunta": "Você come quando está estressado?", "opcoes": ["Sempre", "Frequentemente", "Às vezes", "Nunca"]}, {"pergunta": "Como você se sente após comer?", "opcoes": ["Satisfeito", "Culpado", "Ansioso", "Normal"]}]', 'agendamento');

-- Templates para personal trainers
INSERT INTO tool_templates (nome, tipo, profissao, especializacao, titulo, descricao, perguntas, cta_padrao) VALUES
('Quiz Tipo de Treino', 'quiz', 'personal trainer', 'musculacao', 'Descubra seu Tipo de Treino Ideal', 'Identifica o estilo de treino mais adequado para cada pessoa',
'[{"pergunta": "Qual seu objetivo principal?", "opcoes": ["Hipertrofia", "Força", "Resistência", "Definição"]}, {"pergunta": "Quantos dias por semana pode treinar?", "opcoes": ["2-3 dias", "4-5 dias", "6-7 dias"]}]', 'formulario'),

('Calculadora Carga Ideal', 'calculadora', 'personal trainer', 'musculacao', 'Calcule sua Carga de Treino', 'Calcula a carga ideal para diferentes exercícios',
'[{"campo": "exercicio", "tipo": "select", "label": "Exercício", "opcoes": ["Supino", "Agachamento", "Levantamento Terra", "Desenvolvimento"]}, {"campo": "rm_max", "tipo": "number", "label": "RM Máximo (kg)"}, {"campo": "repeticoes", "tipo": "number", "label": "Repetições desejadas"}]', 'whatsapp');

-- ========================================
-- 10. VIEWS PARA DASHBOARD
-- ========================================

-- View para dashboard do usuário
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    u.id as user_id,
    u.nome,
    u.email,
    u.subscription_tier,
    up.profissao,
    up.especializacao,
    up.publico_alvo,
    COUNT(ut.id) as total_ferramentas,
    COUNT(l.id) as total_leads,
    COALESCE(AVG(ut.taxa_conversao), 0) as taxa_conversao_media,
    MAX(ut.created_at) as ultima_ferramenta_criada
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_tools ut ON u.id = ut.user_id AND ut.status = 'active'
LEFT JOIN leads l ON ut.id = l.tool_id
GROUP BY u.id, u.nome, u.email, u.subscription_tier, up.profissao, up.especializacao, up.publico_alvo;

-- View para analytics de ferramentas
CREATE OR REPLACE VIEW tool_performance AS
SELECT 
    ut.id as tool_id,
    ut.nome,
    ut.tipo,
    ut.user_id,
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.status = 'convertido' THEN 1 END) as conversoes,
    CASE 
        WHEN COUNT(l.id) > 0 THEN (COUNT(CASE WHEN l.status = 'convertido' THEN 1 END)::DECIMAL / COUNT(l.id)::DECIMAL) * 100
        ELSE 0 
    END as taxa_conversao,
    AVG(l.tempo_gasto) as tempo_medio_gasto,
    COUNT(DISTINCT DATE(l.created_at)) as dias_ativos
FROM user_tools ut
LEFT JOIN leads l ON ut.id = l.tool_id
WHERE ut.status = 'active'
GROUP BY ut.id, ut.nome, ut.tipo, ut.user_id;

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

/*
ESTRUTURA COMPLETA PARA PLATAFORMA SAAS INTELIGENTE:

1. ✅ USUÁRIOS E PERFIS - Dados completos para personalização
2. ✅ FERRAMENTAS E TEMPLATES - Base de conhecimento da IA
3. ✅ LEADS E CONVERSÕES - Dados de valor para negócio
4. ✅ ANALYTICS - Métricas para otimização contínua
5. ✅ APRENDIZADO DA IA - Dados para ML e melhorias
6. ✅ RECOMENDAÇÕES - Sistema inteligente de sugestões
7. ✅ NOTIFICAÇÕES - Engajamento contextual
8. ✅ PERFORMANCE - Índices e funções otimizadas
9. ✅ DADOS INICIAIS - Templates para IA aprender
10. ✅ VIEWS - Dashboards e relatórios

VALOR PARA VENDA:
- Dados de performance por profissão
- Padrões de conversão por tipo de ferramenta
- Insights de comportamento do usuário
- Base de conhecimento da IA especializada
- Métricas de engajamento e retenção
- Sistema de recomendações personalizadas

PRÓXIMOS PASSOS:
1. Implementar dashboard inteligente
2. Criar sistema de filtros por profissão
3. Implementar chat contextual
4. Adicionar analytics em tempo real
5. Criar sistema de recomendações
*/
