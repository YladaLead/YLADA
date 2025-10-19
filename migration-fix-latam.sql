-- =====================================================
-- YLADA MIGRATION SCRIPT - CORRIGIR ERRO E ADICIONAR LATAM
-- Script para corrigir a coluna template_key e adicionar América Latina
-- =====================================================

-- =====================================================
-- 1. VERIFICAR E CORRIGIR ESTRUTURA EXISTENTE
-- =====================================================

-- Verificar se a coluna template_key existe
DO $$
BEGIN
    -- Se a coluna não existir, adicionar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'templates_base' 
        AND column_name = 'template_key'
    ) THEN
        ALTER TABLE templates_base ADD COLUMN template_key VARCHAR(200);
        
        -- Atualizar registros existentes com template_key baseado no ID
        UPDATE templates_base 
        SET template_key = 'template-' || id::text 
        WHERE template_key IS NULL;
        
        -- Tornar a coluna NOT NULL e UNIQUE
        ALTER TABLE templates_base ALTER COLUMN template_key SET NOT NULL;
        ALTER TABLE templates_base ADD CONSTRAINT templates_base_template_key_unique UNIQUE (template_key);
        
        RAISE NOTICE 'Coluna template_key adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna template_key já existe!';
    END IF;
END $$;

-- =====================================================
-- 2. ADICIONAR SUPORTE COMPLETO PARA LATAM
-- =====================================================

-- Adicionar países da América Latina
INSERT INTO countries_compliance (country_code, country_name, medical_disclaimer_required, nutrition_advice_restrictions, calculation_limits, data_protection_law, content_warnings) VALUES
-- México
('MEX', 'México', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'LFPDPPP',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutriólogo registrado"}'),

-- Argentina
('ARG', 'Argentina', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley 25.326',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Chile
('CHL', 'Chile', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley 19.628',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Colômbia
('COL', 'Colômbia', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley 1581',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Peru
('PER', 'Peru', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley 29733',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Venezuela
('VEN', 'Venezuela', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Uruguai
('URY', 'Uruguai', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley 18.331',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Equador
('ECU', 'Equador', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Bolívia
('BOL', 'Bolívia', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Paraguai
('PRY', 'Paraguai', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Costa Rica
('CRI', 'Costa Rica', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Guatemala
('GTM', 'Guatemala', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Cuba
('CUB', 'Cuba', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- República Dominicana
('DOM', 'República Dominicana', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Honduras
('HND', 'Honduras', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- El Salvador
('SLV', 'El Salvador', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Nicarágua
('NIC', 'Nicarágua', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}'),

-- Panamá
('PAN', 'Panamá', true,
 '{"requires_license": true, "disclaimer": "Consulte siempre un profesional de la salud"}',
 '{"imc_min": 10, "imc_max": 60, "hydration_min": 0.5, "hydration_max": 5.0}',
 'Ley de Protección de Datos',
 '{"medical": "Este contenido no sustituye la consulta médica", "nutrition": "Consulte un nutricionista registrado"}')

ON CONFLICT (country_code) DO NOTHING;

-- =====================================================
-- 3. ADICIONAR VALIDAÇÕES DE CÁLCULO PARA LATAM
-- =====================================================

-- Validações para países da América Latina
INSERT INTO calculation_validations (country_code, calculation_type, min_value, max_value, validation_rules, warning_message, disclaimer_text) VALUES
-- IMC para países LATAM
('MEX', 'imc', 10.0, 60.0, 
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos pueden indicar necesidad de seguimiento médico',
 'Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.'),

('ARG', 'imc', 10.0, 60.0,
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos pueden indicar necesidad de seguimiento médico',
 'Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.'),

('CHL', 'imc', 10.0, 60.0,
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos pueden indicar necesidad de seguimiento médico',
 'Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.'),

('COL', 'imc', 10.0, 60.0,
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos pueden indicar necesidad de seguimiento médico',
 'Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.'),

('PER', 'imc', 10.0, 60.0,
 '{"age_min": 2, "age_max": 120, "height_min": 50, "height_max": 250, "weight_min": 5, "weight_max": 300}',
 'Valores extremos pueden indicar necesidad de seguimiento médico',
 'Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.'),

-- Hidratação para países LATAM
('MEX', 'hydration', 0.5, 5.0,
 '{"weight_min": 20, "weight_max": 200, "activity_level": ["sedentary", "moderate", "active", "very_active"]}',
 'Consulte un nutriólogo para orientación personalizada',
 'Esta es una estimación general. Sus necesidades pueden variar.'),

('ARG', 'hydration', 0.5, 5.0,
 '{"weight_min": 20, "weight_max": 200, "activity_level": ["sedentary", "moderate", "active", "very_active"]}',
 'Consulte un nutricionista para orientación personalizada',
 'Esta es una estimación general. Sus necesidades pueden variar.'),

('CHL', 'hydration', 0.5, 5.0,
 '{"weight_min": 20, "weight_max": 200, "activity_level": ["sedentary", "moderate", "active", "very_active"]}',
 'Consulte un nutricionista para orientación personalizada',
 'Esta es una estimación general. Sus necesidades pueden variar.'),

-- Exercícios para países LATAM
('MEX', 'exercise', 0, 300,
 '{"age_min": 13, "age_max": 80, "intensity_levels": ["light", "moderate", "vigorous"]}',
 'Consulte un profesional antes de iniciar ejercicios intensos',
 'Este programa es solo una sugerencia. Consulte un profesional de educación física.'),

('ARG', 'exercise', 0, 300,
 '{"age_min": 13, "age_max": 80, "intensity_levels": ["light", "moderate", "vigorous"]}',
 'Consulte un profesional antes de iniciar ejercicios intensos',
 'Este programa es solo una sugerencia. Consulte un profesional de educación física.'),

('CHL', 'exercise', 0, 300,
 '{"age_min": 13, "age_max": 80, "intensity_levels": ["light", "moderate", "vigorous"]}',
 'Consulte un profesional antes de iniciar ejercicios intensos',
 'Este programa es solo una sugerencia. Consulte un profesional de educación física.')

ON CONFLICT (country_code, calculation_type) DO NOTHING;

-- =====================================================
-- 4. CRIAR TEMPLATES COM SUPORTE LATAM
-- =====================================================

-- Template de Calculadora de IMC com suporte LATAM
INSERT INTO templates_base (
  template_key, name, description, type, category, profession, specialization, objective,
  template_structure, compliance_config, calculation_validation, data_capture_config, response_config
) VALUES (
  'calculator-imc-latam',
  'Calculadora de IMC LATAM',
  'Calcule seu IMC com suporte completo para América Latina',
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
      {"id": "age", "label": "Edad", "type": "number", "min": 2, "max": 120, "required": true}
    ],
    "calculation": {
      "formula": "imc = weight / (height/100)^2",
      "result_format": "decimal",
      "decimals": 1
    },
    "categories": [
      {"min": 0, "max": 18.5, "category": "Bajo peso", "color": "blue"},
      {"min": 18.5, "max": 24.9, "category": "Peso normal", "color": "green"},
      {"min": 25, "max": 29.9, "category": "Sobrepeso", "color": "yellow"},
      {"min": 30, "max": 100, "category": "Obesidad", "color": "red"}
    ]
  }',
  
  -- CONFIGURAÇÃO DE COMPLIANCE LATAM
  '{
    "countries": {
      "BRA": {
        "disclaimer": "Este cálculo é apenas uma estimativa. Consulte sempre um profissional de saúde.",
        "warning": "Valores extremos podem indicar necessidade de acompanhamento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "MEX": {
        "disclaimer": "Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.",
        "warning": "Valores extremos pueden indicar necesidad de seguimiento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "ARG": {
        "disclaimer": "Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.",
        "warning": "Valores extremos pueden indicar necesidad de seguimiento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "CHL": {
        "disclaimer": "Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.",
        "warning": "Valores extremos pueden indicar necesidad de seguimiento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "COL": {
        "disclaimer": "Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.",
        "warning": "Valores extremos pueden indicar necesidad de seguimiento médico",
        "required_fields": ["weight", "height", "age"]
      },
      "PER": {
        "disclaimer": "Este cálculo es solo una estimación. Consulte siempre un profesional de la salud.",
        "warning": "Valores extremos pueden indicar necesidad de seguimiento médico",
        "required_fields": ["weight", "height", "age"]
      }
    }
  }',
  
  -- VALIDAÇÃO DE CÁLCULOS LATAM
  '{
    "validation_function": "validate_calculation",
    "limits": {
      "BRA": {"min": 10, "max": 60},
      "MEX": {"min": 10, "max": 60},
      "ARG": {"min": 10, "max": 60},
      "CHL": {"min": 10, "max": 60},
      "COL": {"min": 10, "max": 60},
      "PER": {"min": 10, "max": 60}
    }
  }',
  
  -- CONFIGURAÇÃO DE CAPTURA
  '{
    "required_fields": ["name", "email"],
    "optional_fields": ["phone", "age"],
    "form_title": "¡Reciba su resultado personalizado!",
    "consent_required": true
  }',
  
  -- CONFIGURAÇÃO DE RESPOSTA LATAM
  '{
    "success_message": "¡Su IMC ha sido calculado con éxito!",
    "email_template": "Hola {{name}}! Su IMC es {{imc}} ({{category}}). {{disclaimer}}",
    "whatsapp_template": "Hola {{name}}! 👋 Su IMC es {{imc}} ({{category}}). ¿Quiere agendar una consulta? 📅"
  }'
) ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- 5. VERIFICAR ESTRUTURA FINAL
-- =====================================================

-- Verificar se tudo foi criado corretamente
DO $$
DECLARE
    template_count INTEGER;
    country_count INTEGER;
    validation_count INTEGER;
BEGIN
    -- Contar templates
    SELECT COUNT(*) INTO template_count FROM templates_base;
    
    -- Contar países
    SELECT COUNT(*) INTO country_count FROM countries_compliance;
    
    -- Contar validações
    SELECT COUNT(*) INTO validation_count FROM calculation_validations;
    
    RAISE NOTICE '=== ESTRUTURA CRIADA COM SUCESSO ===';
    RAISE NOTICE 'Templates: %', template_count;
    RAISE NOTICE 'Países: %', country_count;
    RAISE NOTICE 'Validações: %', validation_count;
    RAISE NOTICE '====================================';
END $$;

-- =====================================================
-- MIGRAÇÃO COMPLETA!
-- =====================================================
