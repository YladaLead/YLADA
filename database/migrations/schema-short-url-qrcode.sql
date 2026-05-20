-- =====================================================
-- SCHEMA: ENCURTADOR DE URL E QR CODE
-- Adiciona suporte para URLs encurtadas e QR Codes
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CAMPO short_code EM user_templates
-- =====================================================
ALTER TABLE user_templates 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(10) UNIQUE;

-- Índice para busca rápida por código curto
CREATE INDEX IF NOT EXISTS idx_user_templates_short_code ON user_templates(short_code);

-- =====================================================
-- 2. FUNÇÃO PARA GERAR CÓDIGO ÚNICO CURTO
-- =====================================================
CREATE OR REPLACE FUNCTION generate_unique_short_code()
RETURNS VARCHAR(10) AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code VARCHAR(10);
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar código aleatório de 6 caracteres
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM user_templates WHERE short_code = code) INTO exists_check;
    
    -- Se não existe, retornar
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================
COMMENT ON COLUMN user_templates.short_code IS 'Código único para URL encurtada (ex: abc123)';
COMMENT ON FUNCTION generate_unique_short_code() IS 'Gera um código único de 6 caracteres para URLs encurtadas';

