-- =====================================================
-- ADICIONAR SHORT_CODE EM QUIZZES E PORTALS
-- =====================================================

-- Adicionar coluna short_code em quizzes
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(20) UNIQUE;

-- Índice para busca rápida por código curto em quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_short_code ON quizzes(short_code);

-- Adicionar coluna short_code em wellness_portals
ALTER TABLE wellness_portals 
ADD COLUMN IF NOT EXISTS short_code VARCHAR(20) UNIQUE;

-- Índice para busca rápida por código curto em portals
CREATE INDEX IF NOT EXISTS idx_wellness_portals_short_code ON wellness_portals(short_code);

-- Comentários
COMMENT ON COLUMN quizzes.short_code IS 'Código único para URL encurtada (ex: abc123)';
COMMENT ON COLUMN wellness_portals.short_code IS 'Código único para URL encurtada (ex: abc123)';

