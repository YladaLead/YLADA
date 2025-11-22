-- =====================================================
-- ADICIONAR TABELAS DE CHECKLIST E TAREFAS PARA CURSOS
-- =====================================================
-- Este script cria as tabelas necessárias para checklist e tarefas
-- dos módulos de cursos, seguindo a estrutura existente
-- =====================================================

-- =====================================================
-- TABELA: cursos_checklist
-- Itens de checklist por módulo
-- =====================================================
CREATE TABLE IF NOT EXISTS cursos_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID NOT NULL REFERENCES cursos_modulos(id) ON DELETE CASCADE,
  item_text VARCHAR(500) NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cursos_checklist_modulo_id 
  ON cursos_checklist(modulo_id);
CREATE INDEX IF NOT EXISTS idx_cursos_checklist_ordem 
  ON cursos_checklist(modulo_id, ordem);

-- =====================================================
-- TABELA: cursos_checklist_progresso
-- Progresso do checklist por usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS cursos_checklist_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES cursos_checklist(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checklist_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cursos_checklist_progresso_user 
  ON cursos_checklist_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_cursos_checklist_progresso_checklist 
  ON cursos_checklist_progresso(checklist_id);

-- =====================================================
-- TABELA: cursos_tarefas
-- Tarefas práticas por aula
-- =====================================================
CREATE TABLE IF NOT EXISTS cursos_tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID NOT NULL REFERENCES cursos_aulas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  obrigatoria BOOLEAN DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_aula_id 
  ON cursos_tarefas(aula_id);
CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_ordem 
  ON cursos_tarefas(aula_id, ordem);

-- =====================================================
-- TABELA: cursos_tarefas_progresso
-- Progresso das tarefas por usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS cursos_tarefas_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tarefa_id UUID NOT NULL REFERENCES cursos_tarefas(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  resposta TEXT, -- Resposta do usuário (opcional)
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tarefa_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_progresso_user 
  ON cursos_tarefas_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_progresso_tarefa 
  ON cursos_tarefas_progresso(tarefa_id);

-- =====================================================
-- ADICIONAR CAMPOS EM TABELAS EXISTENTES
-- =====================================================

-- Adicionar video_url em cursos_aulas (se não existir)
ALTER TABLE cursos_aulas 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Adicionar certificate_code em cursos_certificados
ALTER TABLE cursos_certificados 
ADD COLUMN IF NOT EXISTS certificate_code VARCHAR(100);

-- Criar índice único para certificate_code
CREATE UNIQUE INDEX IF NOT EXISTS idx_cursos_certificados_code 
  ON cursos_certificados(certificate_code) 
  WHERE certificate_code IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE cursos_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_checklist_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_tarefas_progresso ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES - CHECKLIST
-- =====================================================

-- Usuários podem ver checklist de módulos publicados
DROP POLICY IF EXISTS "Users can view checklist of published modules" ON cursos_checklist;
CREATE POLICY "Users can view checklist of published modules"
  ON cursos_checklist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cursos_modulos
      JOIN cursos_trilhas ON cursos_trilhas.id = cursos_modulos.trilha_id
      WHERE cursos_modulos.id = cursos_checklist.modulo_id
      AND (cursos_trilhas.status = 'published' OR cursos_trilhas.user_id = auth.uid())
    )
  );

-- Usuários podem gerenciar próprio progresso de checklist
DROP POLICY IF EXISTS "Users can manage own checklist progress" ON cursos_checklist_progresso;
CREATE POLICY "Users can manage own checklist progress"
  ON cursos_checklist_progresso FOR ALL
  USING (user_id = auth.uid());

-- =====================================================
-- POLICIES - TAREFAS
-- =====================================================

-- Usuários podem ver tarefas de aulas publicadas
DROP POLICY IF EXISTS "Users can view tarefas of published aulas" ON cursos_tarefas;
CREATE POLICY "Users can view tarefas of published aulas"
  ON cursos_tarefas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cursos_aulas
      JOIN cursos_modulos ON cursos_modulos.id = cursos_aulas.modulo_id
      JOIN cursos_trilhas ON cursos_trilhas.id = cursos_modulos.trilha_id
      WHERE cursos_aulas.id = cursos_tarefas.aula_id
      AND (cursos_trilhas.status = 'published' OR cursos_trilhas.user_id = auth.uid())
    )
  );

-- Usuários podem gerenciar próprio progresso de tarefas
DROP POLICY IF EXISTS "Users can manage own tarefas progress" ON cursos_tarefas_progresso;
CREATE POLICY "Users can manage own tarefas progress"
  ON cursos_tarefas_progresso FOR ALL
  USING (user_id = auth.uid());

-- =====================================================
-- TRIGGERS - Atualizar updated_at automaticamente
-- =====================================================

-- Trigger para cursos_checklist
DROP TRIGGER IF EXISTS update_cursos_checklist_updated_at ON cursos_checklist;
CREATE TRIGGER update_cursos_checklist_updated_at
  BEFORE UPDATE ON cursos_checklist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para cursos_checklist_progresso
DROP TRIGGER IF EXISTS update_cursos_checklist_progresso_updated_at ON cursos_checklist_progresso;
CREATE TRIGGER update_cursos_checklist_progresso_updated_at
  BEFORE UPDATE ON cursos_checklist_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para cursos_tarefas
DROP TRIGGER IF EXISTS update_cursos_tarefas_updated_at ON cursos_tarefas;
CREATE TRIGGER update_cursos_tarefas_updated_at
  BEFORE UPDATE ON cursos_tarefas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para cursos_tarefas_progresso
DROP TRIGGER IF EXISTS update_cursos_tarefas_progresso_updated_at ON cursos_tarefas_progresso;
CREATE TRIGGER update_cursos_tarefas_progresso_updated_at
  BEFORE UPDATE ON cursos_tarefas_progresso
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE cursos_checklist IS 'Itens de checklist por módulo de curso';
COMMENT ON TABLE cursos_checklist_progresso IS 'Progresso do checklist por usuário';
COMMENT ON TABLE cursos_tarefas IS 'Tarefas práticas por aula';
COMMENT ON TABLE cursos_tarefas_progresso IS 'Progresso das tarefas por usuário';
COMMENT ON COLUMN cursos_aulas.video_url IS 'URL do vídeo da aula (HeyGen ou outro)';
COMMENT ON COLUMN cursos_certificados.certificate_code IS 'Código único do certificado (ex: ILADA-2024-ABC123)';

-- =====================================================
-- VALIDAÇÃO: Verificar se migration funcionou
-- =====================================================
DO $$
BEGIN
  -- Verificar se tabelas foram criadas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'cursos_checklist'
  ) THEN
    RAISE EXCEPTION 'Tabela cursos_checklist não foi criada!';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'cursos_tarefas'
  ) THEN
    RAISE EXCEPTION 'Tabela cursos_tarefas não foi criada!';
  END IF;
  
  RAISE NOTICE '✅ Migration de checklist e tarefas concluída com sucesso!';
END $$;

