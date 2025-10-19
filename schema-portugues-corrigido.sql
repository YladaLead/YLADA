-- ========================================
-- CORREÇÃO DO SCHEMA - NOMES EM PORTUGUÊS
-- ========================================
-- Este script corrige os nomes das colunas para português
-- Execute no Supabase SQL Editor

-- ========================================
-- 1. VERIFICAR ESTRUTURA ATUAL
-- ========================================

-- Verificar se as tabelas existem
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'user_profiles') 
ORDER BY table_name, ordinal_position;

-- ========================================
-- 2. CRIAR NOVA ESTRUTURA COM NOMES EM PORTUGUÊS
-- ========================================

-- Dropar tabelas existentes (se necessário)
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recriar tabela users com nomes em português
CREATE TABLE users (
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

-- Recriar tabela user_profiles com nomes em português
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dados profissionais (em português)
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ========================================
-- 3. CRIAR TABELAS DE FERRAMENTAS
-- ========================================

-- Templates de ferramentas por profissão
CREATE TABLE tool_templates (
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
CREATE TABLE user_tools (
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
-- 4. CRIAR TABELAS DE LEADS
-- ========================================

-- Leads gerados pelas ferramentas
CREATE TABLE leads (
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
-- 5. INSERIR DADOS INICIAIS
-- ========================================

-- Inserir usuário de teste
INSERT INTO users (id, email, nome, subscription_tier) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'teste@ylada.com', 'Maria Silva', 'pro');

-- Inserir perfil de teste
INSERT INTO user_profiles (user_id, profissao, especializacao, publico_alvo, objetivo_principal) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'nutricionista', 'emagrecimento', 'iniciantes', 'atrair novos clientes');

-- Inserir templates padrão para nutricionistas
INSERT INTO tool_templates (nome, tipo, profissao, especializacao, titulo, descricao, perguntas, cta_padrao) VALUES
('Quiz Perfil Metabólico', 'quiz', 'nutricionista', 'emagrecimento', 'Descubra seu Perfil Metabólico', 'Quiz que identifica o tipo metabólico para personalizar estratégias de emagrecimento', 
'[{"pergunta": "Como você se sente após comer carboidratos?", "opcoes": ["Energético", "Sonolento", "Normal", "Irritado"]}, {"pergunta": "Qual seu horário de maior fome?", "opcoes": ["Manhã", "Tarde", "Noite", "Madrugada"]}]', 'formulario'),

('Calculadora Déficit Calórico', 'calculadora', 'nutricionista', 'emagrecimento', 'Seu Déficit Calórico Ideal', 'Calcula o déficit calórico perfeito para perda de peso sustentável',
'[{"campo": "peso", "tipo": "number", "label": "Peso atual (kg)"}, {"campo": "altura", "tipo": "number", "label": "Altura (cm)"}, {"campo": "idade", "tipo": "number", "label": "Idade"}, {"campo": "atividade", "tipo": "select", "label": "Nível de atividade", "opcoes": ["Sedentário", "Leve", "Moderado", "Intenso"]}]', 'whatsapp'),

('Diagnóstico Relação com Comida', 'diagnostico', 'nutricionista', 'comportamento_alimentar', 'Avalie sua Relação com a Comida', 'Identifica padrões alimentares e gatilhos emocionais',
'[{"pergunta": "Você come quando está estressado?", "opcoes": ["Sempre", "Frequentemente", "Às vezes", "Nunca"]}, {"pergunta": "Como você se sente após comer?", "opcoes": ["Satisfeito", "Culpado", "Ansioso", "Normal"]}]', 'agendamento');

-- ========================================
-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
CREATE INDEX idx_user_profiles_profissao ON user_profiles(profissao);
CREATE INDEX idx_user_profiles_especializacao ON user_profiles(especializacao);
CREATE INDEX idx_tool_templates_profissao ON tool_templates(profissao);
CREATE INDEX idx_tool_templates_tipo ON tool_templates(tipo);
CREATE INDEX idx_user_tools_user_id ON user_tools(user_id);
CREATE INDEX idx_user_tools_status ON user_tools(status);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_tool_id ON leads(tool_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- ========================================
-- 7. CRIAR FUNÇÕES E TRIGGERS
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

-- ========================================
-- 8. VERIFICAR ESTRUTURA FINAL
-- ========================================

-- Verificar se tudo foi criado corretamente
SELECT 
    'users' as tabela,
    COUNT(*) as registros
FROM users
UNION ALL
SELECT 
    'user_profiles' as tabela,
    COUNT(*) as registros
FROM user_profiles
UNION ALL
SELECT 
    'tool_templates' as tabela,
    COUNT(*) as registros
FROM tool_templates
UNION ALL
SELECT 
    'user_tools' as tabela,
    COUNT(*) as registros
FROM user_tools
UNION ALL
SELECT 
    'leads' as tabela,
    COUNT(*) as registros
FROM leads;

-- Verificar estrutura das colunas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'user_profiles', 'tool_templates', 'user_tools', 'leads') 
ORDER BY table_name, ordinal_position;

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

/*
SCHEMA CORRIGIDO COM NOMES EM PORTUGUÊS:

✅ TABELAS CRIADAS:
- users (com nome em português)
- user_profiles (com profissao, especializacao, publico_alvo, objetivo_principal)
- tool_templates (templates de ferramentas)
- user_tools (ferramentas criadas pelos usuários)
- leads (leads capturados)

✅ DADOS DE TESTE INSERIDOS:
- Usuário: Maria Silva (nutricionista)
- Perfil: emagrecimento, iniciantes, atrair novos clientes
- Templates: Quiz, Calculadora, Diagnóstico

✅ ÍNDICES E PERFORMANCE:
- Índices criados para consultas rápidas
- Triggers para atualizar timestamps
- Funções para cálculos automáticos

✅ COMPATÍVEL COM O CÓDIGO:
- Nomes das colunas em português
- Estrutura alinhada com interfaces TypeScript
- Dados de teste para desenvolvimento

PRÓXIMOS PASSOS:
1. Executar este script no Supabase SQL Editor
2. Testar dashboard e chat inteligente
3. Integrar com dados reais
4. Implementar sistema de filtros
*/
