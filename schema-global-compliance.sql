-- =====================================================
-- YLADA GLOBAL COMPLIANCE & TEMPLATE SYSTEM
-- Sistema completo com compliance por país e validações médicas
-- =====================================================

-- =====================================================
-- 1. SISTEMA DE COMPLIANCE GLOBAL
-- =====================================================

-- Países e suas regras de compliance
CREATE TABLE IF NOT EXISTS countries_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) UNIQUE NOT NULL, -- BRA, USA, EU, etc.
  country_name VARCHAR(100) NOT NULL,
  
  -- REGRAS MÉDICAS E NUTRICIONAIS
  medical_disclaimer_required BOOLEAN DEFAULT true,
  nutrition_advice_restrictions JSONB, -- Restrições por tipo de conselho
  calculation_limits JSONB, -- Limites para cálculos (IMC, hidratação, etc.)
  
  -- REGRAS DE DADOS E PRIVACIDADE
  data_protection_law VARCHAR(100), -- LGPD, GDPR, CCPA, etc.
  consent_required BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 365,
  
  -- REGRAS DE COMUNICAÇÃO
  marketing_restrictions JSONB, -- Restrições de marketing
  email_consent_required BOOLEAN DEFAULT true,
  whatsapp_restrictions JSONB, -- Restrições de WhatsApp
  
  -- REGRAS DE CONTEÚDO
  content_warnings JSONB, -- Avisos obrigatórios
  professional_licensing JSONB, -- Requisitos de licenciamento
  
  -- STATUS
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir regras de compliance por país
INSERT INTO countries_compliance (country_code, country_name, medical_disclaimer_required, nutrition_advice_restrictions, calculation_limits, data_protection_law, content_warnings) VALUES
('BRA', 'Brasil', true, 
 '{"requires_license": true, "disclaimer": "Consulte sempre um profissional de saúde"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'LGPD', 
 '{"medical": "Este conteúdo não substitui consulta médica", "nutrition": "Consulte um nutricionista registrado"}'),

('USA', 'Estados Unidos', true,
 '{"requires_license": true, "disclaimer": "Consult your healthcare provider"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'CCPA',
 '{"medical": "This content does not replace medical consultation", "nutrition": "Consult a registered dietitian"}'),

('EU', 'União Europeia', true,
 '{"requires_license": true, "disclaimer": "Consult your healthcare provider"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'GDPR',
 '{"medical": "This content does not replace medical consultation", "nutrition": "Consult a registered nutritionist"}');

-- =====================================================
-- 2. TEMPLATES BASE COM COMPLIANCE
-- =====================================================

-- Templates base com estrutura corrigida e compliance
CREATE TABLE IF NOT EXISTS templates_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação única (CORRIGIDO)
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
  
  -- CONFIGURAÇÕES DE COMPLIANCE
  compliance_config JSONB NOT NULL, -- Configurações de compliance por país
  medical_disclaimers JSONB, -- Avisos médicos por país
  calculation_validation JSONB, -- Validações de cálculos
  
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
-- 3. VALIDAÇÕES DE CÁLCULOS POR PAÍS
-- =====================================================

-- Validações específicas para cálculos médicos/nutricionais
CREATE TABLE IF NOT EXISTS calculation_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) REFERENCES countries_compliance(country_code),
  calculation_type VARCHAR(100) NOT NULL, -- imc, hydration, exercise, etc.
  
  -- LIMITES E VALIDAÇÕES
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  validation_rules JSONB, -- Regras específicas de validação
  
  -- AVISOS E DISCLAIMERS
  warning_message TEXT, -- Mensagem de aviso
  disclaimer_text TEXT, -- Texto de disclaimer
  
  -- CONFIGURAÇÕES
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir validações para cálculos comuns
INSERT INTO calculation_validations (country_code, calculation_type, min_value, max_value, validation_rules, warning_message, disclaimer_text) VALUES
-- IMC (Índice de Massa Corporal)
('BRA', 'imc', 10.0, 60.0, 
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos podem indicar necessidade de acompanhamento médico',
 'Este cálculo é apenas uma estimativa. Consulte sempre um profissional de saúde.'),

('USA', 'imc', 10.0, 60.0,
 '{"age_min": 2, "age_max": 120, "height_min": 20, "height_max": 98, "weight_min": 11, "weight_max": 660}',
 'Extreme values may indicate need for medical monitoring',
 'This calculation is only an estimate. Always consult a healthcare provider.'),

-- Hidratação
('BRA', 'hydration', 0.5, 5.0,
 '{"weight_min": 20, "weight_max": 200, "activity_level": ["sedentary", "moderate", "active", "very_active"]}',
 'Consulte um nutricionista para orientação personalizada',
 'Esta é uma estimativa geral. Suas necessidades podem variar.'),

('USA', 'hydration', 0.5, 5.0,
 '{"weight_min": 44, "weight_max": 440, "activity_level": ["sedentary", "moderate", "active", "very_active"]}',
 'Consult a dietitian for personalized guidance',
 'This is a general estimate. Your needs may vary.'),

-- Exercícios
('BRA', 'exercise', 0, 300,
 '{"age_min": 13, "age_max": 80, "intensity_levels": ["light", "moderate", "vigorous"]}',
 'Consulte um profissional antes de iniciar exercícios intensos',
 'Este programa é apenas uma sugestão. Consulte um profissional de educação física.'),

('USA', 'exercise', 0, 300,
 '{"age_min": 13, "age_max": 80, "intensity_levels": ["light", "moderate", "vigorous"]}',
 'Consult a professional before starting intense exercises',
 'This program is only a suggestion. Consult a fitness professional.');

-- =====================================================
-- 4. FERRAMENTAS GERADAS COM COMPLIANCE
-- =====================================================

-- Ferramentas criadas pelos usuários (com compliance)
CREATE TABLE IF NOT EXISTS generated_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_base(id),
  
  -- Identificação
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  
  -- CONFIGURAÇÕES DE COMPLIANCE
  target_country VARCHAR(3) REFERENCES countries_compliance(country_code) DEFAULT 'BRA',
  compliance_applied JSONB, -- Compliance aplicado
  disclaimers_included JSONB, -- Disclaimers incluídos
  
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
-- 5. RESPOSTAS COM VALIDAÇÃO DE COMPLIANCE
-- =====================================================

-- Respostas dos usuários nas ferramentas (com validação)
CREATE TABLE IF NOT EXISTS tool_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES generated_tools(id) ON DELETE CASCADE,
  session_id VARCHAR(100), -- ID da sessão do usuário
  
  -- DADOS DO USUÁRIO
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_phone VARCHAR(50),
  user_company VARCHAR(255),
  
  -- DADOS PARA CÁLCULOS
  user_data JSONB, -- Dados necessários para cálculos (peso, altura, idade, etc.)
  
  -- RESPOSTAS DA FERRAMENTA
  responses JSONB NOT NULL, -- Todas as respostas
  answers_summary JSONB, -- Resumo das respostas
  score DECIMAL(5,2), -- Pontuação se aplicável
  result_category VARCHAR(100), -- Categoria do resultado
  
  -- CÁLCULOS REALIZADOS
  calculations JSONB, -- Cálculos realizados (IMC, hidratação, etc.)
  calculation_results JSONB, -- Resultados dos cálculos
  validation_status JSONB, -- Status das validações
  
  -- RESULTADO FINAL
  final_result JSONB NOT NULL, -- Resultado final personalizado
  personalized_message TEXT, -- Mensagem personalizada
  recommendations JSONB, -- Recomendações baseadas nas respostas
  
  -- COMPLIANCE
  disclaimers_accepted JSONB, -- Disclaimers aceitos pelo usuário
  consent_given JSONB, -- Consentimentos dados
  
  -- METADADOS
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  completion_time INTEGER, -- Tempo em segundos para completar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FUNÇÕES DE VALIDAÇÃO
-- =====================================================

-- Função para validar cálculos baseado no país
CREATE OR REPLACE FUNCTION validate_calculation(
  p_country_code VARCHAR(3),
  p_calculation_type VARCHAR(100),
  p_value DECIMAL(10,2),
  p_user_data JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  validation_record RECORD;
  result JSONB;
BEGIN
  -- Buscar regras de validação
  SELECT * INTO validation_record
  FROM calculation_validations
  WHERE country_code = p_country_code
    AND calculation_type = p_calculation_type
    AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN '{"valid": false, "error": "Validation rules not found"}'::JSONB;
  END IF;
  
  -- Validar valor
  IF p_value < validation_record.min_value OR p_value > validation_record.max_value THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Value out of range',
      'min_value', validation_record.min_value,
      'max_value', validation_record.max_value,
      'warning', validation_record.warning_message,
      'disclaimer', validation_record.disclaimer_text
    );
  END IF;
  
  -- Validar dados do usuário se fornecidos
  IF p_user_data IS NOT NULL AND p_user_data != '{}' THEN
    -- Validações específicas baseadas no tipo de cálculo
    CASE p_calculation_type
      WHEN 'imc' THEN
        IF (p_user_data->>'age')::INTEGER < (validation_record.validation_rules->>'age_min')::INTEGER OR
           (p_user_data->>'age')::INTEGER > (validation_record.validation_rules->>'age_max')::INTEGER THEN
          RETURN json_build_object(
            'valid', false,
            'error', 'Age out of range',
            'warning', validation_record.warning_message,
            'disclaimer', validation_record.disclaimer_text
          );
        END IF;
    END CASE;
  END IF;
  
  -- Retornar sucesso
  RETURN json_build_object(
    'valid', true,
    'warning', validation_record.warning_message,
    'disclaimer', validation_record.disclaimer_text
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. DADOS INICIAIS - TEMPLATES COM COMPLIANCE
-- =====================================================

-- Template de Calculadora de IMC com Compliance
INSERT INTO templates_base (
  template_key, name, description, type, category, profession, specialization, objective,
  template_structure, compliance_config, calculation_validation, data_capture_config, response_config
) VALUES (
  'calculator-imc',
  'Calculadora de IMC',
  'Calcule seu Índice de Massa Corporal com validações de segurança',
  'calculator',
  'atracao',
  'nutricionista',
  'emagrecimento',
  'capturar-leads',
  
  -- ESTRUTURA DO TEMPLATE
  '{
    "inputs": [
      {"id": "weight", "label": "Peso (kg)", "type": "number", "min": 5, "max": 300, "required": true},
      {"id": "height", "label": "Altura (cm)", "type": "number", "min": 50, "max": 250, "required": true},
      {"id": "age", "label": "Idade", "type": "number", "min": 2, "max": 120, "required": true}
    ],
    "calculation": {
      "formula": "imc = weight / (height/100)^2",
      "result_format": "decimal",
      "decimals": 1
    },
    "categories": [
      {"min": 0, "max": 18.5, "category": "Abaixo do peso", "color": "blue"},
      {"min": 18.5, "max": 24.9, "category": "Peso normal", "color": "green"},
      {"min": 25, "max": 29.9, "category": "Sobrepeso", "color": "yellow"},
      {"min": 30, "max": 100, "category": "Obesidade", "color": "red"}
    ]
  }',
  
  -- CONFIGURAÇÃO DE COMPLIANCE
  '{
    "countries": {
      "BRA": {
        "disclaimer": "Este cálculo é apenas uma estimativa. Consulte sempre um profissional de saúde.",
        "warning": "Valores extremos podem indicar necessidade de acompanhamento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "USA": {
        "disclaimer": "This calculation is only an estimate. Always consult a healthcare provider.",
        "warning": "Extreme values may indicate need for medical monitoring",
        "required_fields": ["weight", "height", "age"]
      }
    }
  }',
  
  -- VALIDAÇÃO DE CÁLCULOS
  '{
    "validation_function": "validate_calculation",
    "limits": {
      "BRA": {"min": 10, "max": 60},
      "USA": {"min": 10, "max": 60}
    }
  }',
  
  -- CONFIGURAÇÃO DE CAPTURA
  '{
    "required_fields": ["name", "email"],
    "optional_fields": ["phone", "age"],
    "form_title": "Receba seu resultado personalizado!",
    "consent_required": true
  }',
  
  -- CONFIGURAÇÃO DE RESPOSTA
  '{
    "success_message": "Seu IMC foi calculado com sucesso!",
    "email_template": "Olá {{name}}! Seu IMC é {{imc}} ({{category}}). {{disclaimer}}",
    "whatsapp_template": "Olá {{name}}! Seu IMC é {{imc}} ({{category}}). Quer agendar uma consulta? 📅"
  }'
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_countries_compliance_code ON countries_compliance(country_code);
CREATE INDEX IF NOT EXISTS idx_templates_base_key ON templates_base(template_key);
CREATE INDEX IF NOT EXISTS idx_calculation_validations_country_type ON calculation_validations(country_code, calculation_type);
CREATE INDEX IF NOT EXISTS idx_generated_tools_country ON generated_tools(target_country);
CREATE INDEX IF NOT EXISTS idx_tool_responses_tool_id ON tool_responses(tool_id);

-- =====================================================
-- ESTRUTURA COMPLETA COM COMPLIANCE CRIADA!
-- =====================================================
