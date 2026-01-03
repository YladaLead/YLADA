-- ============================================
-- Migration 019: Tabela media_library
-- Sistema de banco próprio de imagens/vídeos/áudios
-- ============================================

-- Criar tabela media_library
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações do arquivo
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Caminho no Supabase Storage
  file_url TEXT NOT NULL, -- URL pública do arquivo
  file_size BIGINT, -- Tamanho em bytes
  mime_type TEXT, -- image/jpeg, video/mp4, audio/mpeg
  
  -- Tipo e categoria
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  area TEXT CHECK (area IN ('nutri', 'coach', 'wellness', 'nutra', 'all')),
  purpose TEXT CHECK (purpose IN ('hook', 'dor', 'solucao', 'cta', 'background', 'b-roll', 'music', 'effect', 'all')),
  
  -- Tags e metadados
  tags TEXT[], -- Array de tags para busca
  title TEXT,
  description TEXT,
  
  -- Relevância e uso
  relevance_score INTEGER DEFAULT 50, -- 0-100, maior = mais relevante
  usage_count INTEGER DEFAULT 0, -- Quantas vezes foi usado
  is_featured BOOLEAN DEFAULT false, -- Destaque para resultados prioritários
  
  -- Dimensões (para imagens/vídeos)
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- Duração em segundos (para vídeos/áudios)
  
  -- Origem
  source TEXT DEFAULT 'envato', -- envato, pexels, unsplash, dalle, custom
  source_id TEXT, -- ID original na fonte
  
  -- Controle
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(media_type);
CREATE INDEX IF NOT EXISTS idx_media_library_area ON media_library(area);
CREATE INDEX IF NOT EXISTS idx_media_library_purpose ON media_library(purpose);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON media_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_library_relevance ON media_library(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_featured ON media_library(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_media_library_active ON media_library(is_active) WHERE is_active = true;

-- Índice composto para busca comum
CREATE INDEX IF NOT EXISTS idx_media_library_search ON media_library(media_type, area, is_active, relevance_score DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_media_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_media_library_updated_at();

-- Comentários
COMMENT ON TABLE media_library IS 'Banco de imagens, vídeos e áudios do Creative Studio';
COMMENT ON COLUMN media_library.tags IS 'Array de tags para busca semântica';
COMMENT ON COLUMN media_library.relevance_score IS 'Score de relevância (0-100) para ordenação de resultados';
COMMENT ON COLUMN media_library.area IS 'Área de uso: nutri, coach, wellness, nutra, ou all';
COMMENT ON COLUMN media_library.purpose IS 'Propósito: hook, dor, solucao, cta, background, etc';

-- Política RLS (Row Level Security)
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler (para busca)
CREATE POLICY "media_library_select_all" ON media_library
  FOR SELECT
  USING (is_active = true);

-- Política: Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "media_library_admin_all" ON media_library
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Verificar se foi criado
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_library') THEN
    RAISE NOTICE '✅ Tabela media_library criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro ao criar tabela media_library';
  END IF;
END $$;


