-- =====================================================
-- YLADA MULTI-LANGUAGE & SMART TEMPLATES ARCHITECTURE
-- Sistema inteligente para evitar repetição e suportar múltiplos idiomas
-- =====================================================

-- =====================================================
-- 1. SISTEMA DE IDIOMAS
-- =====================================================

-- Tabela de idiomas suportados
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(5) UNIQUE NOT NULL, -- pt, en, es, fr, de, it, etc.
  name VARCHAR(100) NOT NULL, -- Português, English, Español, etc.
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir idiomas padrão
INSERT INTO languages (code, name, is_default) VALUES
('pt', 'Português', true),
('en', 'English', false),
('es', 'Español', false),
('fr', 'Français', false),
('de', 'Deutsch', false),
('it', 'Italiano', false);

-- =====================================================
-- 2. TEMPLATES BASE MULTI-IDIOMA
-- =====================================================

-- Templates base com estrutura inteligente
CREATE TABLE templates_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação única do template
  template_key VARCHAR(200) UNIQUE NOT NULL, -- ex: "quiz-metabolic-profile"
  version INTEGER DEFAULT 1,
  
  -- Metadados
  name_template JSONB NOT NULL, -- {"pt": "Descubra seu Perfil Metabólico", "en": "Discover Your Metabolic Profile"}
  description_template JSONB, -- {"pt": "Quiz para descobrir...", "en": "Quiz to discover..."}
  
  -- Estrutura do template
  type VARCHAR(50) NOT NULL, -- quiz, calculator, checklist, etc.
  category VARCHAR(100) NOT NULL, -- atracao, conversao, indicacao
  
  -- Segmentação inteligente
  profession VARCHAR(100), -- nutricionista, esteticista, etc.
  specialization VARCHAR(200), -- emagrecimento, facial, etc.
  objective VARCHAR(100), -- capturar-leads, gerar-indicacoes, etc.
  
  -- Estrutura do conteúdo (independente de idioma)
  content_structure JSONB NOT NULL, -- Estrutura base do template
  questions_template JSONB, -- Template das perguntas
  calculations_template JSONB, -- Template dos cálculos
  checklist_template JSONB, -- Template dos itens
  
  -- Configurações de personalização
  customization_options JSONB, -- Opções de personalização
  required_fields JSONB, -- Campos obrigatórios
  optional_fields JSONB, -- Campos opcionais
  
  -- Metadados de uso
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Status e versionamento
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TRADUÇÕES DINÂMICAS
-- =====================================================

-- Sistema de traduções automáticas
CREATE TABLE template_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates_base(id) ON DELETE CASCADE,
  language_code VARCHAR(5) REFERENCES languages(code),
  
  -- Conteúdo traduzido
  translated_name VARCHAR(200),
  translated_description TEXT,
  translated_content JSONB, -- Conteúdo completo traduzido
  
  -- Metadados da tradução
  translation_method VARCHAR(50) DEFAULT 'ai', -- ai, manual, cached
  translation_quality DECIMAL(3,2) DEFAULT 0.00, -- 0.00 a 1.00
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Cache e otimização
  is_cached BOOLEAN DEFAULT true,
  cache_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  
  UNIQUE(template_id, language_code)
);

-- =====================================================
-- 4. FERRAMENTAS GERADAS MULTI-IDIOMA
-- =====================================================

-- Ferramentas criadas pelos usuários
CREATE TABLE generated_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_base(id),
  
  -- Identificação
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  
  -- Idioma da ferramenta
  language_code VARCHAR(5) REFERENCES languages(code) DEFAULT 'pt',
  
  -- Conteúdo personalizado
  content JSONB NOT NULL, -- Conteúdo final da ferramenta
  customizations JSONB, -- Personalizações feitas pelo usuário
  
  -- Configurações
  status VARCHAR(50) DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
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
-- 5. SISTEMA DE CACHE INTELIGENTE
-- =====================================================

-- Cache de traduções para economia de IA
CREATE TABLE translation_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Chave do cache
  cache_key VARCHAR(500) UNIQUE NOT NULL,
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  
  -- Conteúdo em cache
  cached_translation JSONB NOT NULL,
  translation_type VARCHAR(50), -- template, question, option, etc.
  
  -- Metadados
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cache de templates por idioma
CREATE TABLE template_language_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates_base(id) ON DELETE CASCADE,
  language_code VARCHAR(5) REFERENCES languages(code),
  
  -- Template completo em cache
  cached_template JSONB NOT NULL,
  
  -- Metadados
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(template_id, language_code)
);

-- =====================================================
-- 6. SISTEMA DE VERSIONAMENTO
-- =====================================================

-- Histórico de versões dos templates
CREATE TABLE template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates_base(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Conteúdo da versão
  version_content JSONB NOT NULL,
  changes_summary TEXT,
  
  -- Metadados
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(template_id, version_number)
);

-- =====================================================
-- 7. SISTEMA DE PERSONALIZAÇÃO INTELIGENTE
-- =====================================================

-- Configurações de personalização por usuário
CREATE TABLE user_template_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates_base(id) ON DELETE CASCADE,
  
  -- Preferências de personalização
  preferred_language VARCHAR(5) REFERENCES languages(code),
  customization_settings JSONB, -- Configurações específicas
  auto_translate BOOLEAN DEFAULT true,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, template_id)
);

-- =====================================================
-- 8. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas multi-idioma
CREATE INDEX idx_templates_base_key ON templates_base(template_key);
CREATE INDEX idx_templates_base_type_category ON templates_base(type, category);
CREATE INDEX idx_templates_base_profession ON templates_base(profession);
CREATE INDEX idx_template_translations_template_lang ON template_translations(template_id, language_code);
CREATE INDEX idx_generated_tools_language ON generated_tools(language_code);
CREATE INDEX idx_translation_cache_key ON translation_cache(cache_key);
CREATE INDEX idx_template_language_cache_template_lang ON template_language_cache(template_id, language_code);

-- =====================================================
-- 9. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar cache quando template muda
CREATE OR REPLACE FUNCTION update_template_cache()
RETURNS TRIGGER AS $$
BEGIN
    -- Invalidar cache de idiomas quando template muda
    DELETE FROM template_language_cache WHERE template_id = NEW.id;
    
    -- Invalidar traduções quando template muda
    UPDATE template_translations 
    SET is_cached = false 
    WHERE template_id = NEW.id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_template_cache_trigger
    AFTER UPDATE ON templates_base
    FOR EACH ROW
    EXECUTE FUNCTION update_template_cache();

-- =====================================================
-- 10. DADOS INICIAIS MULTI-IDIOMA
-- =====================================================

-- Templates base em português (serão traduzidos automaticamente)
INSERT INTO templates_base (template_key, name_template, description_template, type, category, profession, specialization, objective, content_structure) VALUES
('quiz-metabolic-profile', 
 '{"pt": "Descubra seu Perfil Metabólico", "en": "Discover Your Metabolic Profile"}',
 '{"pt": "Quiz para descobrir seu tipo metabólico e necessidades nutricionais", "en": "Quiz to discover your metabolic type and nutritional needs"}',
 'quiz', 'atracao', 'nutricionista', 'emagrecimento', 'capturar-leads',
 '{"questions": [{"type": "multiple_choice", "template": "Como você se sente ao acordar?", "options": ["Energético", "Cansado", "Com fome", "Sem apetite"]}]}'),

('calculator-energy-index',
 '{"pt": "Calculadora de Índice de Energia", "en": "Energy Index Calculator"}',
 '{"pt": "Calcule seu índice de energia e equilíbrio corporal", "en": "Calculate your energy index and body balance"}',
 'calculator', 'atracao', 'nutricionista', 'bem-estar', 'capturar-leads',
 '{"formula": "score = (energia + sono + alimentacao) / 3", "inputs": ["energia", "sono", "alimentacao"]}'),

('checklist-healthy-routine',
 '{"pt": "Checklist de Rotina Saudável", "en": "Healthy Routine Checklist"}',
 '{"pt": "10 sinais de que você precisa mudar sua rotina", "en": "10 signs you need to change your routine"}',
 'checklist', 'atracao', 'nutricionista', 'habitos', 'capturar-leads',
 '{"items": ["Acorda cansado", "Sente fome constante", "Tem dificuldade para dormir"]}');

-- =====================================================
-- ESTRUTURA MULTI-IDIOMA CRIADA!
-- =====================================================
