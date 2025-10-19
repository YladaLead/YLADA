-- =====================================================
-- YLADA SMART CALCULATORS SYSTEM
-- Sistema inteligente de calculadoras com IA para busca e criação
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELAS BASE PRIMEIRO
-- =====================================================

-- Criar tabela de países e compliance
CREATE TABLE IF NOT EXISTS countries_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) UNIQUE NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  
  -- REGRAS MÉDICAS E NUTRICIONAIS
  medical_disclaimer_required BOOLEAN DEFAULT true,
  nutrition_advice_restrictions JSONB,
  calculation_limits JSONB,
  
  -- REGRAS DE DADOS E PRIVACIDADE
  data_protection_law VARCHAR(100),
  consent_required BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 365,
  
  -- REGRAS DE COMUNICAÇÃO
  marketing_restrictions JSONB,
  email_consent_required BOOLEAN DEFAULT true,
  whatsapp_restrictions JSONB,
  
  -- REGRAS DE CONTEÚDO
  content_warnings JSONB,
  professional_licensing JSONB,
  
  -- STATUS
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de validações de cálculo
CREATE TABLE IF NOT EXISTS calculation_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) REFERENCES countries_compliance(country_code),
  calculation_type VARCHAR(100) NOT NULL,
  
  -- LIMITES E VALIDAÇÕES
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  validation_rules JSONB,
  
  -- AVISOS E DISCLAIMERS
  warning_message TEXT,
  disclaimer_text TEXT,
  
  -- CONFIGURAÇÕES
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. SISTEMA INTELIGENTE DE CALCULADORAS
-- =====================================================

-- Tabela de tipos de calculadoras disponíveis
CREATE TABLE IF NOT EXISTS calculator_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- IDENTIFICAÇÃO
  calculator_key VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- health, nutrition, fitness, finance, etc.
  
  -- CONFIGURAÇÃO DA CALCULADORA
  formula JSONB NOT NULL, -- Fórmula matemática
  inputs JSONB NOT NULL, -- Campos de entrada
  outputs JSONB NOT NULL, -- Campos de saída
  validation_rules JSONB, -- Regras de validação
  
  -- CONFIGURAÇÕES DE IA
  ai_search_keywords TEXT[], -- Palavras-chave para busca por IA
  ai_suggestions JSONB, -- Sugestões automáticas da IA
  related_calculators TEXT[], -- Calculadoras relacionadas
  
  -- METADADOS
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de calculadoras personalizadas pelos usuários
CREATE TABLE IF NOT EXISTS user_calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  calculator_type_id UUID REFERENCES calculator_types(id),
  
  -- IDENTIFICAÇÃO
  name VARCHAR(200) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  url VARCHAR(500) NOT NULL,
  
  -- CONFIGURAÇÃO PERSONALIZADA
  custom_formula JSONB, -- Fórmula personalizada
  custom_inputs JSONB, -- Campos personalizados
  custom_outputs JSONB, -- Saídas personalizadas
  custom_validation JSONB, -- Validações personalizadas
  
  -- CONFIGURAÇÕES DE COMPLIANCE
  target_country VARCHAR(3) REFERENCES countries_compliance(country_code) DEFAULT 'BRA',
  compliance_applied JSONB,
  disclaimers_included JSONB,
  
  -- CONFIGURAÇÕES DE CAPTURA
  lead_capture_config JSONB,
  success_message JSONB,
  
  -- STATUS E MÉTRICAS
  status VARCHAR(50) DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  calculations_count INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  
  -- METADADOS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir países básicos
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

('MEX', 'México', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'LFPDPPP',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutriólogo registrado"}')

ON CONFLICT (country_code) DO NOTHING;

-- =====================================================
-- 4. INSERIR CALCULADORAS COMPLETAS
-- =====================================================

-- Calculadora de IMC
INSERT INTO calculator_types (
  calculator_key, name, description, category,
  formula, inputs, outputs, validation_rules,
  ai_search_keywords, ai_suggestions, related_calculators
) VALUES (
  'imc-calculator',
  'Calculadora de IMC',
  'Calcula o Índice de Massa Corporal',
  'health',
  
  -- FÓRMULA
  '{
    "formula": "imc = weight / (height/100)^2",
    "variables": ["weight", "height"],
    "result_format": "decimal",
    "decimals": 1
  }',
  
  -- INPUTS
  '{
    "weight": {
      "label": "Peso",
      "type": "number",
      "unit": "kg",
      "min": 5,
      "max": 300,
      "required": true,
      "placeholder": "Digite seu peso"
    },
    "height": {
      "label": "Altura",
      "type": "number",
      "unit": "cm",
      "min": 50,
      "max": 250,
      "required": true,
      "placeholder": "Digite sua altura"
    }
  }',
  
  -- OUTPUTS
  '{
    "imc": {
      "label": "IMC",
      "type": "number",
      "format": "decimal",
      "decimals": 1
    },
    "category": {
      "label": "Categoria",
      "type": "text",
      "values": [
        {"min": 0, "max": 18.5, "value": "Abaixo do peso", "color": "blue"},
        {"min": 18.5, "max": 24.9, "value": "Peso normal", "color": "green"},
        {"min": 25, "max": 29.9, "value": "Sobrepeso", "color": "yellow"},
        {"min": 30, "max": 100, "value": "Obesidade", "color": "red"}
      ]
    },
    "recommendation": {
      "label": "Recomendação",
      "type": "text",
      "based_on": "category"
    }
  }',
  
  -- VALIDAÇÃO
  '{
    "weight": {"min": 5, "max": 300, "required": true},
    "height": {"min": 50, "max": 250, "required": true},
    "imc": {"min": 10, "max": 60}
  }',
  
  -- PALAVRAS-CHAVE PARA IA
  ARRAY['imc', 'indice massa corporal', 'peso ideal', 'obesidade', 'sobrepeso', 'calculadora peso', 'bmi'],
  
  -- SUGESTÕES DA IA
  '{
    "suggestions": [
      "Calculadora de peso ideal",
      "Calculadora de calorias",
      "Calculadora de hidratação"
    ],
    "professions": ["nutricionista", "personal trainer", "médico"],
    "objectives": ["capturar-leads", "avaliar-habitos", "educar-valor"]
  }',
  
  -- CALCULADORAS RELACIONADAS
  ARRAY['weight-ideal', 'calories-calculator', 'hydration-calculator']
);

-- Calculadora de Hidratação
INSERT INTO calculator_types (
  calculator_key, name, description, category,
  formula, inputs, outputs, validation_rules,
  ai_search_keywords, ai_suggestions, related_calculators
) VALUES (
  'hydration-calculator',
  'Calculadora de Hidratação',
  'Calcula a quantidade ideal de água por dia',
  'nutrition',
  
  -- FÓRMULA
  '{
    "formula": "water = weight * 35 + (activity_level * 500)",
    "variables": ["weight", "activity_level"],
    "result_format": "decimal",
    "decimals": 1,
    "unit": "ml"
  }',
  
  -- INPUTS
  '{
    "weight": {
      "label": "Peso",
      "type": "number",
      "unit": "kg",
      "min": 20,
      "max": 200,
      "required": true
    },
    "activity_level": {
      "label": "Nível de Atividade",
      "type": "select",
      "options": [
        {"value": 0, "label": "Sedentário"},
        {"value": 1, "label": "Leve"},
        {"value": 2, "label": "Moderado"},
        {"value": 3, "label": "Intenso"}
      ],
      "required": true
    }
  }',
  
  -- OUTPUTS
  '{
    "water_amount": {
      "label": "Quantidade de Água",
      "type": "number",
      "format": "decimal",
      "decimals": 1,
      "unit": "ml"
    },
    "glasses": {
      "label": "Copos de 200ml",
      "type": "number",
      "format": "integer",
      "calculation": "water_amount / 200"
    },
    "recommendation": {
      "label": "Recomendação",
      "type": "text",
      "based_on": "water_amount"
    }
  }',
  
  -- VALIDAÇÃO
  '{
    "weight": {"min": 20, "max": 200, "required": true},
    "activity_level": {"min": 0, "max": 3, "required": true},
    "water_amount": {"min": 500, "max": 5000}
  }',
  
  -- PALAVRAS-CHAVE PARA IA
  ARRAY['hidratacao', 'agua', 'liquidos', 'desidratacao', 'calculadora agua', 'quantidade agua'],
  
  -- SUGESTÕES DA IA
  '{
    "suggestions": [
      "Calculadora de IMC",
      "Calculadora de calorias",
      "Calculadora de macronutrientes"
    ],
    "professions": ["nutricionista", "personal trainer"],
    "objectives": ["educar-valor", "avaliar-habitos"]
  }',
  
  -- CALCULADORAS RELACIONADAS
  ARRAY['imc-calculator', 'calories-calculator', 'macros-calculator']
);

-- Calculadora de Calorias
INSERT INTO calculator_types (
  calculator_key, name, description, category,
  formula, inputs, outputs, validation_rules,
  ai_search_keywords, ai_suggestions, related_calculators
) VALUES (
  'calories-calculator',
  'Calculadora de Calorias',
  'Calcula a necessidade calórica diária',
  'nutrition',
  
  -- FÓRMULA
  '{
    "formula": "calories = (weight * 10 + height * 6.25 - age * 5 + gender_factor) * activity_multiplier",
    "variables": ["weight", "height", "age", "gender", "activity_level"],
    "result_format": "integer"
  }',
  
  -- INPUTS
  '{
    "weight": {
      "label": "Peso",
      "type": "number",
      "unit": "kg",
      "min": 20,
      "max": 200,
      "required": true
    },
    "height": {
      "label": "Altura",
      "type": "number",
      "unit": "cm",
      "min": 100,
      "max": 250,
      "required": true
    },
    "age": {
      "label": "Idade",
      "type": "number",
      "unit": "anos",
      "min": 10,
      "max": 100,
      "required": true
    },
    "gender": {
      "label": "Sexo",
      "type": "select",
      "options": [
        {"value": "male", "label": "Masculino", "factor": 5},
        {"value": "female", "label": "Feminino", "factor": -161}
      ],
      "required": true
    },
    "activity_level": {
      "label": "Nível de Atividade",
      "type": "select",
      "options": [
        {"value": 1.2, "label": "Sedentário"},
        {"value": 1.375, "label": "Leve"},
        {"value": 1.55, "label": "Moderado"},
        {"value": 1.725, "label": "Intenso"},
        {"value": 1.9, "label": "Muito Intenso"}
      ],
      "required": true
    }
  }',
  
  -- OUTPUTS
  '{
    "calories": {
      "label": "Calorias Diárias",
      "type": "number",
      "format": "integer",
      "unit": "kcal"
    },
    "macros": {
      "label": "Macronutrientes",
      "type": "object",
      "carbohydrates": {"percentage": 50, "unit": "g"},
      "proteins": {"percentage": 25, "unit": "g"},
      "fats": {"percentage": 25, "unit": "g"}
    }
  }',
  
  -- VALIDAÇÃO
  '{
    "weight": {"min": 20, "max": 200, "required": true},
    "height": {"min": 100, "max": 250, "required": true},
    "age": {"min": 10, "max": 100, "required": true},
    "calories": {"min": 800, "max": 5000}
  }',
  
  -- PALAVRAS-CHAVE PARA IA
  ARRAY['calorias', 'energia', 'metabolismo', 'dieta', 'emagrecimento', 'ganho peso'],
  
  -- SUGESTÕES DA IA
  '{
    "suggestions": [
      "Calculadora de IMC",
      "Calculadora de macronutrientes",
      "Calculadora de hidratação"
    ],
    "professions": ["nutricionista", "personal trainer"],
    "objectives": ["educar-valor", "avaliar-habitos", "capturar-leads"]
  }',
  
  -- CALCULADORAS RELACIONADAS
  ARRAY['imc-calculator', 'macros-calculator', 'hydration-calculator']
);

-- =====================================================
-- 5. FUNÇÃO DE BUSCA INTELIGENTE POR IA
-- =====================================================

-- Função para buscar calculadoras por IA
CREATE OR REPLACE FUNCTION search_calculators_by_ai(
  p_search_text TEXT,
  p_profession VARCHAR(100) DEFAULT NULL,
  p_objective VARCHAR(100) DEFAULT NULL
) RETURNS TABLE (
  calculator_key VARCHAR(200),
  name VARCHAR(200),
  description TEXT,
  category VARCHAR(100),
  relevance_score DECIMAL(5,2)
) AS $$
DECLARE
  search_words TEXT[];
  word TEXT;
BEGIN
  -- Converter texto de busca em array de palavras
  search_words := string_to_array(lower(p_search_text), ' ');
  
  -- Buscar calculadoras que correspondem às palavras-chave
  RETURN QUERY
  SELECT 
    ct.calculator_key,
    ct.name,
    ct.description,
    ct.category,
    (
      -- Calcular score de relevância
      (
        SELECT COUNT(*)
        FROM unnest(ct.ai_search_keywords) AS keyword
        WHERE keyword = ANY(search_words)
      )::DECIMAL / array_length(ct.ai_search_keywords, 1)
    ) * 100 AS relevance_score
  FROM calculator_types ct
  WHERE ct.is_active = true
    AND (
      -- Busca por palavras-chave
      ct.ai_search_keywords && search_words
      OR
      -- Busca por texto
      lower(ct.name) LIKE '%' || lower(p_search_text) || '%'
      OR
      lower(ct.description) LIKE '%' || lower(p_search_text) || '%'
    )
    AND (
      -- Filtrar por profissão se especificado
      p_profession IS NULL 
      OR 
      ct.ai_suggestions->>'professions' LIKE '%' || p_profession || '%'
    )
    AND (
      -- Filtrar por objetivo se especificado
      p_objective IS NULL 
      OR 
      ct.ai_suggestions->>'objectives' LIKE '%' || p_objective || '%'
    )
  ORDER BY relevance_score DESC, ct.usage_count DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. FUNÇÃO PARA CRIAR CALCULADORA PERSONALIZADA
-- =====================================================

-- Função para criar calculadora personalizada
CREATE OR REPLACE FUNCTION create_custom_calculator(
  p_user_id UUID,
  p_calculator_type_key VARCHAR(200),
  p_custom_name VARCHAR(200),
  p_target_country VARCHAR(3) DEFAULT 'BRA'
) RETURNS UUID AS $$
DECLARE
  calculator_type_record RECORD;
  new_calculator_id UUID;
  new_slug VARCHAR(100);
BEGIN
  -- Buscar tipo de calculadora
  SELECT * INTO calculator_type_record
  FROM calculator_types
  WHERE calculator_key = p_calculator_type_key
    AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tipo de calculadora não encontrado: %', p_calculator_type_key;
  END IF;
  
  -- Gerar slug único
  new_slug := lower(replace(p_custom_name, ' ', '-')) || '-' || substr(gen_random_uuid()::text, 1, 8);
  
  -- Criar calculadora personalizada
  INSERT INTO user_calculators (
    user_id, calculator_type_id, name, description, slug, url,
    custom_formula, custom_inputs, custom_outputs, custom_validation,
    target_country, lead_capture_config, success_message
  ) VALUES (
    p_user_id, calculator_type_record.id, p_custom_name, calculator_type_record.description,
    new_slug, 'https://ylada.com/calc/' || new_slug,
    calculator_type_record.formula, calculator_type_record.inputs, calculator_type_record.outputs,
    calculator_type_record.validation_rules, p_target_country,
    '{"required_fields": ["name", "email"], "form_title": "Receba seu resultado!"}',
    '{"success_message": "Cálculo realizado com sucesso!", "email_template": "Seu resultado: {{result}}"}'
  ) RETURNING id INTO new_calculator_id;
  
  -- Atualizar contador de uso
  UPDATE calculator_types
  SET usage_count = usage_count + 1
  WHERE id = calculator_type_record.id;
  
  RETURN new_calculator_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para busca eficiente
CREATE INDEX IF NOT EXISTS idx_calculator_types_keywords ON calculator_types USING GIN (ai_search_keywords);
CREATE INDEX IF NOT EXISTS idx_calculator_types_category ON calculator_types(category);
CREATE INDEX IF NOT EXISTS idx_user_calculators_user_id ON user_calculators(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calculators_slug ON user_calculators(slug);
CREATE INDEX IF NOT EXISTS idx_countries_compliance_code ON countries_compliance(country_code);

-- =====================================================
-- 8. TESTAR SISTEMA
-- =====================================================

-- Testar busca por IA
DO $$
DECLARE
  result RECORD;
BEGIN
  RAISE NOTICE '=== TESTANDO BUSCA POR IA ===';
  
  FOR result IN 
    SELECT * FROM search_calculators_by_ai('peso ideal', 'nutricionista', 'capturar-leads')
  LOOP
    RAISE NOTICE 'Calculadora: % | Score: %', result.name, result.relevance_score;
  END LOOP;
  
  RAISE NOTICE '=== SISTEMA CRIADO COM SUCESSO ===';
END $$;

-- =====================================================
-- SISTEMA INTELIGENTE DE CALCULADORAS CRIADO!
-- =====================================================
