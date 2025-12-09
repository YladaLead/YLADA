-- =====================================================
-- ADICIONAR CATEGORIA "DIVULGAÇÃO" AOS MATERIAIS WELLNESS
-- Migração 026: Adicionar categoria divulgacao e garantir que tabela existe
-- =====================================================

BEGIN;

-- Garantir que a tabela existe (se não existir, criar)
CREATE TABLE IF NOT EXISTS wellness_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'pdf',
    'video',
    'link',
    'imagem',
    'documento'
  )),
  categoria TEXT NOT NULL,
  url TEXT NOT NULL,
  arquivo_path TEXT,
  tamanho_bytes BIGINT,
  tags TEXT[],
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar categoria "divulgacao" se a constraint existir
-- Primeiro, vamos remover a constraint antiga se existir
DO $$
BEGIN
  -- Tentar remover constraint antiga se existir
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'wellness_materiais_categoria_check'
  ) THEN
    ALTER TABLE wellness_materiais 
    DROP CONSTRAINT wellness_materiais_categoria_check;
  END IF;
END $$;

-- Adicionar nova constraint com categoria divulgacao
ALTER TABLE wellness_materiais
ADD CONSTRAINT wellness_materiais_categoria_check 
CHECK (categoria IN (
  'apresentacao',
  'cartilha',
  'produto',
  'treinamento',
  'script',
  'divulgacao',  -- NOVA CATEGORIA
  'outro'
));

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_materiais_categoria ON wellness_materiais(categoria);
CREATE INDEX IF NOT EXISTS idx_materiais_tipo ON wellness_materiais(tipo);
CREATE INDEX IF NOT EXISTS idx_materiais_tags ON wellness_materiais USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_materiais_ativo ON wellness_materiais(ativo);

-- Comentário
COMMENT ON TABLE wellness_materiais IS 'Materiais diversos (PDFs, vídeos, links) incluindo materiais para divulgação';

COMMIT;
