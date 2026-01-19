-- =====================================================
-- MIGRATION 179: BIBLIOTECA DE PROTOCOLOS (COACH)
-- Data: Janeiro 2026
-- Descrição: Tabela para armazenar protocolos/referências enviados pela Coach
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_protocol_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tipo do item
  item_type VARCHAR(30) NOT NULL DEFAULT 'protocolo', -- 'protocolo' | 'referencia' | 'bloco'

  -- Metadados
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}'::text[],

  -- Informações do arquivo
  file_url TEXT NOT NULL,
  file_path TEXT, -- caminho no storage (para remoção/diagnóstico)
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  file_extension VARCHAR(10),

  -- Metadados de auditoria
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_coach_protocol_library_user_id ON coach_protocol_library(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_protocol_library_item_type ON coach_protocol_library(item_type);
CREATE INDEX IF NOT EXISTS idx_coach_protocol_library_uploaded_at ON coach_protocol_library(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_protocol_library_deleted_at ON coach_protocol_library(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_coach_protocol_library_tags ON coach_protocol_library USING GIN(tags);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_coach_protocol_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_coach_protocol_library_updated_at ON coach_protocol_library;

CREATE TRIGGER trigger_update_coach_protocol_library_updated_at
BEFORE UPDATE ON coach_protocol_library
FOR EACH ROW
EXECUTE FUNCTION update_coach_protocol_library_updated_at();

-- RLS
ALTER TABLE coach_protocol_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_protocol_library_select_own" ON coach_protocol_library;
CREATE POLICY "coach_protocol_library_select_own"
ON coach_protocol_library
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "coach_protocol_library_insert_own" ON coach_protocol_library;
CREATE POLICY "coach_protocol_library_insert_own"
ON coach_protocol_library
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "coach_protocol_library_update_own" ON coach_protocol_library;
CREATE POLICY "coach_protocol_library_update_own"
ON coach_protocol_library
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "coach_protocol_library_delete_own" ON coach_protocol_library;
CREATE POLICY "coach_protocol_library_delete_own"
ON coach_protocol_library
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE coach_protocol_library IS 'Biblioteca de protocolos/referências enviados pela Coach para diagnóstico e exceções';
COMMENT ON COLUMN coach_protocol_library.item_type IS 'protocolo, referencia (pdf/imagem/video), ou bloco (trecho reutilizável)';
COMMENT ON COLUMN coach_protocol_library.tags IS 'Tags livres para busca e organização';

