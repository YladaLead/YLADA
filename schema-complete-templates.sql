-- =====================================================
-- YLADA COMPLETE TEMPLATE & DATA STRUCTURE
-- Sistema completo para templates editáveis e captura de dados
-- =====================================================

-- =====================================================
-- 1. TEMPLATES BASE EDITÁVEIS
-- =====================================================

-- Templates base com estrutura completa e editável
CREATE TABLE IF NOT EXISTS templates_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação única
  template_key VARCHAR(200) UNIQUE NOT NULL,
  version INTEGER DEFAULT 1,
  
  -- Metadados básicos
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- quiz, calculator, checklist, etc.
  category VARCHAR(100) NOT NULL, -- atracao, conversao, indicacao
  
  -- Segmentação
  profession VARCHAR(100),
  specialization VARCHAR(200),
  objective VARCHAR(100),
  
  -- ESTRUTURA COMPLETA DO TEMPLATE
  template_structure JSONB NOT NULL, -- Estrutura completa editável
  
  -- CONFIGURAÇÕES DE PERSONALIZAÇÃO
  customization_options JSONB, -- Opções que o usuário pode editar
  required_fields JSONB, -- Campos obrigatórios
  optional_fields JSONB, -- Campos opcionais
  
  -- CONFIGURAÇÕES DE CAPTURA DE DADOS
  data_capture_config JSONB NOT NULL, -- Como capturar dados do usuário
  lead_form_fields JSONB, -- Campos do formulário de lead
  required_lead_data JSONB, -- Dados obrigatórios do lead
  
  -- CONFIGURAÇÕES DE RESPOSTA/MENSAGEM FINAL
  response_config JSONB NOT NULL, -- Configuração da resposta final
  success_message_template JSONB, -- Template da mensagem de sucesso
  email_template JSONB, -- Template do email de follow-up
  whatsapp_template JSONB, -- Template do WhatsApp
  
  -- Metadados
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  is_editable BOOLEAN DEFAULT true, -- Se o usuário pode editar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. FERRAMENTAS GERADAS (COM EDIÇÃO)
-- =====================================================

-- Ferramentas criadas pelos usuários (editáveis)
CREATE TABLE IF NOT EXISTS generated_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_base(id),
  
  -- Identificação
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  
  -- CONTEÚDO PERSONALIZADO E EDITÁVEL
  content JSONB NOT NULL, -- Conteúdo final da ferramenta
  customizations JSONB, -- Personalizações feitas pelo usuário
  edited_content JSONB, -- Conteúdo editado pelo usuário
  
  -- CONFIGURAÇÕES DE CAPTURA
  lead_capture_config JSONB, -- Como capturar leads
  form_fields JSONB, -- Campos do formulário
  success_message JSONB, -- Mensagem de sucesso personalizada
  
  -- CONFIGURAÇÕES DE AUTOMAÇÃO
  auto_email_config JSONB, -- Configuração de email automático
  auto_whatsapp_config JSONB, -- Configuração de WhatsApp automático
  follow_up_sequence JSONB, -- Sequência de follow-up
  
  -- Status e configurações
  status VARCHAR(50) DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
  is_editable BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Métricas
  views_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. RESPOSTAS E DADOS CAPTURADOS
-- =====================================================

-- Respostas dos usuários nas ferramentas
CREATE TABLE IF NOT EXISTS tool_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES generated_tools(id) ON DELETE CASCADE,
  session_id VARCHAR(100), -- ID da sessão do usuário
  
  -- DADOS DO USUÁRIO
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_phone VARCHAR(50),
  user_company VARCHAR(255),
  
  -- RESPOSTAS DA FERRAMENTA
  responses JSONB NOT NULL, -- Todas as respostas
  answers_summary JSONB, -- Resumo das respostas
  score DECIMAL(5,2), -- Pontuação se aplicável
  result_category VARCHAR(100), -- Categoria do resultado
  
  -- RESULTADO FINAL
  final_result JSONB NOT NULL, -- Resultado final personalizado
  personalized_message TEXT, -- Mensagem personalizada
  recommendations JSONB, -- Recomendações baseadas nas respostas
  
  -- METADADOS
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  completion_time INTEGER, -- Tempo em segundos para completar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. LEADS CAPTURADOS
-- =====================================================

-- Leads capturados pelas ferramentas
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES generated_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  response_id UUID REFERENCES tool_responses(id),
  
  -- DADOS DO LEAD
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  
  -- DADOS ADICIONAIS CAPTURADOS
  additional_data JSONB, -- Dados extras capturados
  lead_score DECIMAL(5,2), -- Score do lead (0-100)
  lead_category VARCHAR(100), -- Categoria do lead
  
  -- RESPOSTAS E RESULTADOS
  responses JSONB, -- Respostas da ferramenta
  result_summary TEXT, -- Resumo do resultado
  personalized_message TEXT, -- Mensagem personalizada
  
  -- STATUS E FOLLOW-UP
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, lost
  follow_up_status VARCHAR(50), -- email_sent, whatsapp_sent, called, etc.
  conversion_value DECIMAL(10,2), -- Valor da conversão
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- METADADOS
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. MENSAGENS E COMUNICAÇÃO AUTOMÁTICA
-- =====================================================

-- Mensagens automáticas enviadas
CREATE TABLE IF NOT EXISTS automated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES generated_tools(id),
  
  -- CONFIGURAÇÃO DA MENSAGEM
  message_type VARCHAR(50) NOT NULL, -- email, whatsapp, sms
  template_id VARCHAR(100), -- ID do template usado
  message_content TEXT NOT NULL, -- Conteúdo da mensagem
  
  -- PERSONALIZAÇÃO
  personalized_content TEXT, -- Conteúdo personalizado
  variables_used JSONB, -- Variáveis usadas na personalização
  
  -- STATUS DE ENVIO
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- METADADOS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TEMPLATES DE MENSAGENS
-- =====================================================

-- Templates de mensagens personalizáveis
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- IDENTIFICAÇÃO
  template_name VARCHAR(200) NOT NULL,
  template_type VARCHAR(50) NOT NULL, -- email, whatsapp, sms
  
  -- CONTEÚDO DO TEMPLATE
  subject VARCHAR(500), -- Assunto (para email)
  content TEXT NOT NULL, -- Conteúdo da mensagem
  
  -- PERSONALIZAÇÃO
  variables JSONB, -- Variáveis disponíveis para personalização
  personalization_rules JSONB, -- Regras de personalização
  
  -- CONFIGURAÇÕES
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  -- METADADOS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. HISTÓRICO DE EDIÇÕES
-- =====================================================

-- Histórico de edições dos templates
CREATE TABLE IF NOT EXISTS template_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES generated_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- DADOS DA EDIÇÃO
  edit_type VARCHAR(50) NOT NULL, -- content, settings, message, etc.
  old_content JSONB, -- Conteúdo anterior
  new_content JSONB, -- Conteúdo novo
  changes_summary TEXT, -- Resumo das mudanças
  
  -- METADADOS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_templates_base_key ON templates_base(template_key);
CREATE INDEX IF NOT EXISTS idx_templates_base_type ON templates_base(type);
CREATE INDEX IF NOT EXISTS idx_generated_tools_user_id ON generated_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_tools_slug ON generated_tools(slug);
CREATE INDEX IF NOT EXISTS idx_tool_responses_tool_id ON tool_responses(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_responses_email ON tool_responses(user_email);
CREATE INDEX IF NOT EXISTS idx_leads_tool_id ON leads(tool_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_automated_messages_lead_id ON automated_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id ON message_templates(user_id);

-- =====================================================
-- 9. DADOS INICIAIS - TEMPLATES COMPLETOS
-- =====================================================

-- Template de Quiz Metabólico Completo
INSERT INTO templates_base (
  template_key, name, description, type, category, profession, specialization, objective,
  template_structure, customization_options, data_capture_config, response_config
) VALUES (
  'quiz-metabolic-profile',
  'Quiz de Perfil Metabólico',
  'Descubra seu tipo metabólico e necessidades nutricionais',
  'quiz',
  'atracao',
  'nutricionista',
  'emagrecimento',
  'capturar-leads',
  
  -- ESTRUTURA COMPLETA DO TEMPLATE
  '{
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "Como você se sente ao acordar?",
        "options": [
          {"value": "energetic", "text": "Energético", "score": 3},
          {"value": "tired", "text": "Cansado", "score": 1},
          {"value": "hungry", "text": "Com fome", "score": 2},
          {"value": "no_appetite", "text": "Sem apetite", "score": 1}
        ],
        "required": true
      },
      {
        "id": "q2",
        "type": "multiple_choice",
        "question": "Qual sua relação com doces?",
        "options": [
          {"value": "love", "text": "Adoro", "score": 1},
          {"value": "moderate", "text": "Gosto moderadamente", "score": 2},
          {"value": "avoid", "text": "Evito", "score": 3},
          {"value": "dont_eat", "text": "Não como", "score": 4}
        ],
        "required": true
      }
    ],
    "scoring": {
      "total_questions": 2,
      "max_score": 7,
      "categories": [
        {"min_score": 6, "max_score": 7, "category": "Metabolismo Rápido", "description": "Seu metabolismo é acelerado"},
        {"min_score": 4, "max_score": 5, "category": "Metabolismo Moderado", "description": "Seu metabolismo é equilibrado"},
        {"min_score": 2, "max_score": 3, "category": "Metabolismo Lento", "description": "Seu metabolismo precisa de estímulo"}
      ]
    }
  }',
  
  -- OPÇÕES DE PERSONALIZAÇÃO
  '{
    "editable_fields": ["questions", "scoring", "categories"],
    "customizable_texts": ["title", "description", "success_message"],
    "branding_options": ["logo", "colors", "fonts"]
  }',
  
  -- CONFIGURAÇÃO DE CAPTURA DE DADOS
  '{
    "required_fields": ["name", "email"],
    "optional_fields": ["phone", "age", "gender"],
    "capture_timing": "after_completion",
    "form_title": "Receba seu resultado personalizado!"
  }',
  
  -- CONFIGURAÇÃO DE RESPOSTA
  '{
    "success_message": "Parabéns! Seu perfil metabólico foi analisado com sucesso!",
    "email_template": "Seu resultado está pronto!",
    "whatsapp_template": "Olá {{name}}! Seu perfil metabólico está pronto. Quer saber mais?",
    "follow_up_sequence": [
      {"delay": "1_hour", "type": "email", "template": "welcome"},
      {"delay": "1_day", "type": "whatsapp", "template": "follow_up"}
    ]
  }'
);

-- =====================================================
-- ESTRUTURA COMPLETA CRIADA!
-- =====================================================
