-- ============================================
-- MIGRAÇÃO: Tornar curso_id opcional em módulos
-- Descrição: Permite criar módulos sem curso (biblioteca de módulos)
-- Data: 2024
-- ============================================

-- 1. Tornar curso_id opcional (NULL permitido)
ALTER TABLE wellness_curso_modulos 
  ALTER COLUMN curso_id DROP NOT NULL;

-- 2. Adicionar índice para módulos sem curso (biblioteca)
CREATE INDEX IF NOT EXISTS idx_wellness_curso_modulos_sem_curso 
  ON wellness_curso_modulos(curso_id) 
  WHERE curso_id IS NULL;

-- 3. Comentário explicativo
COMMENT ON COLUMN wellness_curso_modulos.curso_id IS 
  'ID do curso. NULL = módulo na biblioteca (não associado a curso específico)';

