-- ============================================
-- MIGRAÇÃO: Reestruturação para Módulos → Tópicos → Cursos
-- Descrição: Nova hierarquia onde cursos são os materiais (PDFs/Vídeos)
-- Data: 2024
-- ============================================

-- 1. Criar tabela de tópicos
CREATE TABLE IF NOT EXISTS wellness_modulo_topicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id UUID NOT NULL REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tópicos
CREATE INDEX IF NOT EXISTS idx_wellness_modulo_topicos_modulo ON wellness_modulo_topicos(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_modulo_topicos_ordem ON wellness_modulo_topicos(modulo_id, ordem);

-- 2. Atualizar tabela wellness_curso_materiais para referenciar tópicos
-- Primeiro, adicionar coluna topico_id
ALTER TABLE wellness_curso_materiais 
  ADD COLUMN IF NOT EXISTS topico_id UUID REFERENCES wellness_modulo_topicos(id) ON DELETE CASCADE;

-- Criar índice para topico_id
CREATE INDEX IF NOT EXISTS idx_wellness_curso_materiais_topico ON wellness_curso_materiais(topico_id);

-- 3. Atualizar módulos para não depender de curso (já deve estar feito, mas garantindo)
ALTER TABLE wellness_curso_modulos 
  ALTER COLUMN curso_id DROP NOT NULL;

-- 4. Habilitar RLS na nova tabela
ALTER TABLE wellness_modulo_topicos ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para tópicos
-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários autenticados podem ver tópicos" ON wellness_modulo_topicos;
DROP POLICY IF EXISTS "Apenas admins podem criar tópicos" ON wellness_modulo_topicos;
DROP POLICY IF EXISTS "Apenas admins podem atualizar tópicos" ON wellness_modulo_topicos;
DROP POLICY IF EXISTS "Apenas admins podem deletar tópicos" ON wellness_modulo_topicos;

-- SELECT: Todos usuários autenticados podem ver tópicos
CREATE POLICY "Usuários autenticados podem ver tópicos"
  ON wellness_modulo_topicos FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT/UPDATE/DELETE: Apenas admins
CREATE POLICY "Apenas admins podem criar tópicos"
  ON wellness_modulo_topicos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Apenas admins podem atualizar tópicos"
  ON wellness_modulo_topicos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Apenas admins podem deletar tópicos"
  ON wellness_modulo_topicos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- 6. Comentários
COMMENT ON TABLE wellness_modulo_topicos IS 'Tópicos dentro de módulos. Hierarquia: Módulo → Tópico → Curso (Material)';
COMMENT ON COLUMN wellness_curso_materiais.topico_id IS 'ID do tópico. Cursos (materiais) agora pertencem a tópicos';

