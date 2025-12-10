-- ============================================
-- MIGRATION 030: Habilitar RLS em Tabelas Wellness
-- ============================================
-- Corrige questões de segurança identificadas pelo Supabase Security Advisor
-- Habilita Row Level Security (RLS) e cria políticas de acesso adequadas
-- para todas as tabelas wellness que estavam sem RLS
-- ============================================

-- ============================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS WELLNESS
-- ============================================

-- Tabelas de Links e Treinos
ALTER TABLE IF EXISTS wellness_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_treinos ENABLE ROW LEVEL SECURITY;

-- Tabelas de Fluxos
ALTER TABLE IF EXISTS wellness_fluxos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_fluxos_passos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_fluxos_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_fluxos_dicas ENABLE ROW LEVEL SECURITY;

-- Tabelas de Materiais e Biblioteca
ALTER TABLE IF EXISTS wellness_materiais ENABLE ROW LEVEL SECURITY;
-- wellness_materiais_acesso não existe, removido
ALTER TABLE IF EXISTS wellness_scripts ENABLE ROW LEVEL SECURITY;
-- wellness_cartilhas não existe, removido
-- wellness_apresentacoes não existe, removido
ALTER TABLE IF EXISTS wellness_produtos ENABLE ROW LEVEL SECURITY;

-- Tabela de Diagnósticos
ALTER TABLE IF EXISTS wellness_diagnosticos ENABLE ROW LEVEL SECURITY;

-- Tabelas de Trilhas e Cursos (se existirem)
ALTER TABLE IF EXISTS wellness_trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wellness_passo_a_passo_diario ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. FUNÇÕES HELPER PARA POLÍTICAS RLS
-- ============================================

-- Função para verificar se usuário é wellness
CREATE OR REPLACE FUNCTION is_wellness_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND perfil = 'wellness'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND (is_admin = TRUE OR perfil = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. POLÍTICAS RLS: wellness_links
-- ============================================

-- SELECT: Usuários wellness podem ver links ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_links' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active links" ON wellness_links;
    CREATE POLICY "Wellness users can view active links"
      ON wellness_links FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view links" ON wellness_links;
    CREATE POLICY "Wellness users can view links"
      ON wellness_links FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os links
DROP POLICY IF EXISTS "Admins can view all links" ON wellness_links;
CREATE POLICY "Admins can view all links"
  ON wellness_links FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage links" ON wellness_links;
CREATE POLICY "Admins can manage links"
  ON wellness_links FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 4. POLÍTICAS RLS: wellness_treinos
-- ============================================

-- SELECT: Usuários wellness podem ver treinos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_treinos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active treinos" ON wellness_treinos;
    CREATE POLICY "Wellness users can view active treinos"
      ON wellness_treinos FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view treinos" ON wellness_treinos;
    CREATE POLICY "Wellness users can view treinos"
      ON wellness_treinos FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os treinos
DROP POLICY IF EXISTS "Admins can view all treinos" ON wellness_treinos;
CREATE POLICY "Admins can view all treinos"
  ON wellness_treinos FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage treinos" ON wellness_treinos;
CREATE POLICY "Admins can manage treinos"
  ON wellness_treinos FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 5. POLÍTICAS RLS: wellness_fluxos
-- ============================================

-- SELECT: Usuários wellness podem ver fluxos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_fluxos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active fluxos" ON wellness_fluxos;
    CREATE POLICY "Wellness users can view active fluxos"
      ON wellness_fluxos FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view fluxos" ON wellness_fluxos;
    CREATE POLICY "Wellness users can view fluxos"
      ON wellness_fluxos FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os fluxos
DROP POLICY IF EXISTS "Admins can view all fluxos" ON wellness_fluxos;
CREATE POLICY "Admins can view all fluxos"
  ON wellness_fluxos FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage fluxos" ON wellness_fluxos;
CREATE POLICY "Admins can manage fluxos"
  ON wellness_fluxos FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 6. POLÍTICAS RLS: wellness_fluxos_passos
-- ============================================

-- SELECT: Usuários wellness podem ver passos de fluxos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_fluxos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view fluxo passos" ON wellness_fluxos_passos;
    CREATE POLICY "Wellness users can view fluxo passos"
      ON wellness_fluxos_passos FOR SELECT
      USING (
        is_wellness_user() AND
        EXISTS (
          SELECT 1 FROM wellness_fluxos
          WHERE wellness_fluxos.id = wellness_fluxos_passos.fluxo_id
          AND wellness_fluxos.ativo = true
        )
      );
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view fluxo passos" ON wellness_fluxos_passos;
    CREATE POLICY "Wellness users can view fluxo passos"
      ON wellness_fluxos_passos FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os passos
DROP POLICY IF EXISTS "Admins can view all fluxo passos" ON wellness_fluxos_passos;
CREATE POLICY "Admins can view all fluxo passos"
  ON wellness_fluxos_passos FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage fluxo passos" ON wellness_fluxos_passos;
CREATE POLICY "Admins can manage fluxo passos"
  ON wellness_fluxos_passos FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 7. POLÍTICAS RLS: wellness_fluxos_scripts
-- ============================================

-- SELECT: Usuários wellness podem ver scripts de fluxos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_fluxos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view fluxo scripts" ON wellness_fluxos_scripts;
    CREATE POLICY "Wellness users can view fluxo scripts"
      ON wellness_fluxos_scripts FOR SELECT
      USING (
        is_wellness_user() AND
        (
          fluxo_id IS NULL OR
          EXISTS (
            SELECT 1 FROM wellness_fluxos
            WHERE wellness_fluxos.id = wellness_fluxos_scripts.fluxo_id
            AND wellness_fluxos.ativo = true
          )
        )
      );
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view fluxo scripts" ON wellness_fluxos_scripts;
    CREATE POLICY "Wellness users can view fluxo scripts"
      ON wellness_fluxos_scripts FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os scripts
DROP POLICY IF EXISTS "Admins can view all fluxo scripts" ON wellness_fluxos_scripts;
CREATE POLICY "Admins can view all fluxo scripts"
  ON wellness_fluxos_scripts FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage fluxo scripts" ON wellness_fluxos_scripts;
CREATE POLICY "Admins can manage fluxo scripts"
  ON wellness_fluxos_scripts FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 8. POLÍTICAS RLS: wellness_fluxos_dicas
-- ============================================

-- SELECT: Usuários wellness podem ver dicas de fluxos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_fluxos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view fluxo dicas" ON wellness_fluxos_dicas;
    CREATE POLICY "Wellness users can view fluxo dicas"
      ON wellness_fluxos_dicas FOR SELECT
      USING (
        is_wellness_user() AND
        (
          fluxo_id IS NULL OR
          EXISTS (
            SELECT 1 FROM wellness_fluxos
            WHERE wellness_fluxos.id = wellness_fluxos_dicas.fluxo_id
            AND wellness_fluxos.ativo = true
          )
        )
      );
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view fluxo dicas" ON wellness_fluxos_dicas;
    CREATE POLICY "Wellness users can view fluxo dicas"
      ON wellness_fluxos_dicas FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todas as dicas
DROP POLICY IF EXISTS "Admins can view all fluxo dicas" ON wellness_fluxos_dicas;
CREATE POLICY "Admins can view all fluxo dicas"
  ON wellness_fluxos_dicas FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage fluxo dicas" ON wellness_fluxos_dicas;
CREATE POLICY "Admins can manage fluxo dicas"
  ON wellness_fluxos_dicas FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 9. POLÍTICAS RLS: wellness_materiais
-- ============================================

-- SELECT: Usuários wellness podem ver materiais ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_materiais' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active materiais" ON wellness_materiais;
    CREATE POLICY "Wellness users can view active materiais"
      ON wellness_materiais FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view materiais" ON wellness_materiais;
    CREATE POLICY "Wellness users can view materiais"
      ON wellness_materiais FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os materiais
DROP POLICY IF EXISTS "Admins can view all materiais" ON wellness_materiais;
CREATE POLICY "Admins can view all materiais"
  ON wellness_materiais FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage materiais" ON wellness_materiais;
CREATE POLICY "Admins can manage materiais"
  ON wellness_materiais FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 10. POLÍTICAS RLS: wellness_materiais_acesso
-- ============================================
-- NOTA: Tabela wellness_materiais_acesso não existe no banco
-- Políticas removidas - se a tabela for criada no futuro, adicionar políticas aqui

-- ============================================
-- 11. POLÍTICAS RLS: wellness_diagnosticos
-- ============================================

-- SELECT: Usuários podem ver apenas seus próprios diagnósticos
DROP POLICY IF EXISTS "Users can view own diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Users can view own diagnosticos"
  ON wellness_diagnosticos FOR SELECT
  USING (auth.uid() = user_id);

-- SELECT: Admins podem ver todos os diagnósticos
DROP POLICY IF EXISTS "Admins can view all diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Admins can view all diagnosticos"
  ON wellness_diagnosticos FOR SELECT
  USING (is_admin_user());

-- INSERT: Usuários podem criar seus próprios diagnósticos
DROP POLICY IF EXISTS "Users can insert own diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Users can insert own diagnosticos"
  ON wellness_diagnosticos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- INSERT: Admins podem criar qualquer diagnóstico
DROP POLICY IF EXISTS "Admins can insert any diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Admins can insert any diagnosticos"
  ON wellness_diagnosticos FOR INSERT
  WITH CHECK (is_admin_user());

-- UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Admins can manage diagnosticos"
  ON wellness_diagnosticos FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete diagnosticos" ON wellness_diagnosticos;
CREATE POLICY "Admins can delete diagnosticos"
  ON wellness_diagnosticos FOR DELETE
  USING (is_admin_user());

-- ============================================
-- 12. POLÍTICAS RLS: wellness_scripts (standalone)
-- ============================================

-- SELECT: Usuários wellness podem ver scripts ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active scripts" ON wellness_scripts;
    CREATE POLICY "Wellness users can view active scripts"
      ON wellness_scripts FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view scripts" ON wellness_scripts;
    CREATE POLICY "Wellness users can view scripts"
      ON wellness_scripts FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os scripts
DROP POLICY IF EXISTS "Admins can view all scripts" ON wellness_scripts;
CREATE POLICY "Admins can view all scripts"
  ON wellness_scripts FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage scripts" ON wellness_scripts;
CREATE POLICY "Admins can manage scripts"
  ON wellness_scripts FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 13. POLÍTICAS RLS: wellness_cartilhas
-- ============================================
-- NOTA: Tabela wellness_cartilhas não existe no banco
-- Políticas removidas - se a tabela for criada no futuro, adicionar políticas aqui

-- ============================================
-- 14. POLÍTICAS RLS: wellness_apresentacoes
-- ============================================
-- NOTA: Tabela wellness_apresentacoes não existe no banco
-- Políticas removidas - se a tabela for criada no futuro, adicionar políticas aqui

-- ============================================
-- 15. POLÍTICAS RLS: wellness_produtos
-- ============================================

-- SELECT: Usuários wellness podem ver produtos ativos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' AND column_name = 'ativo'
  ) THEN
    DROP POLICY IF EXISTS "Wellness users can view active produtos" ON wellness_produtos;
    CREATE POLICY "Wellness users can view active produtos"
      ON wellness_produtos FOR SELECT
      USING (is_wellness_user() AND ativo = true);
  ELSE
    DROP POLICY IF EXISTS "Wellness users can view produtos" ON wellness_produtos;
    CREATE POLICY "Wellness users can view produtos"
      ON wellness_produtos FOR SELECT
      USING (is_wellness_user());
  END IF;
END $$;

-- SELECT: Admins podem ver todos os produtos
DROP POLICY IF EXISTS "Admins can view all produtos" ON wellness_produtos;
CREATE POLICY "Admins can view all produtos"
  ON wellness_produtos FOR SELECT
  USING (is_admin_user());

-- INSERT/UPDATE/DELETE: Apenas admins
DROP POLICY IF EXISTS "Admins can manage produtos" ON wellness_produtos;
CREATE POLICY "Admins can manage produtos"
  ON wellness_produtos FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================
-- 16. POLÍTICAS RLS: Tabelas de Trilhas (se existirem)
-- ============================================

-- wellness_trilhas
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_trilhas') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_trilhas' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active trilhas" ON wellness_trilhas;
      CREATE POLICY "Wellness users can view active trilhas"
        ON wellness_trilhas FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view trilhas" ON wellness_trilhas;
      CREATE POLICY "Wellness users can view trilhas"
        ON wellness_trilhas FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all trilhas" ON wellness_trilhas;
    CREATE POLICY "Admins can view all trilhas"
      ON wellness_trilhas FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage trilhas" ON wellness_trilhas;
    CREATE POLICY "Admins can manage trilhas"
      ON wellness_trilhas FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_modulos
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_modulos') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_modulos' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active modulos" ON wellness_modulos;
      CREATE POLICY "Wellness users can view active modulos"
        ON wellness_modulos FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view modulos" ON wellness_modulos;
      CREATE POLICY "Wellness users can view modulos"
        ON wellness_modulos FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all modulos" ON wellness_modulos;
    CREATE POLICY "Admins can view all modulos"
      ON wellness_modulos FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage modulos" ON wellness_modulos;
    CREATE POLICY "Admins can manage modulos"
      ON wellness_modulos FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_aulas
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_aulas') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_aulas' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active aulas" ON wellness_aulas;
      CREATE POLICY "Wellness users can view active aulas"
        ON wellness_aulas FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view aulas" ON wellness_aulas;
      CREATE POLICY "Wellness users can view aulas"
        ON wellness_aulas FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all aulas" ON wellness_aulas;
    CREATE POLICY "Admins can view all aulas"
      ON wellness_aulas FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage aulas" ON wellness_aulas;
    CREATE POLICY "Admins can manage aulas"
      ON wellness_aulas FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_checklists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_checklists') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_checklists' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active checklists" ON wellness_checklists;
      CREATE POLICY "Wellness users can view active checklists"
        ON wellness_checklists FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view checklists" ON wellness_checklists;
      CREATE POLICY "Wellness users can view checklists"
        ON wellness_checklists FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all checklists" ON wellness_checklists;
    CREATE POLICY "Admins can view all checklists"
      ON wellness_checklists FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage checklists" ON wellness_checklists;
    CREATE POLICY "Admins can manage checklists"
      ON wellness_checklists FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_progresso
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_progresso') THEN
    DROP POLICY IF EXISTS "Users can view own progresso" ON wellness_progresso;
    CREATE POLICY "Users can view own progresso"
      ON wellness_progresso FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all progresso" ON wellness_progresso;
    CREATE POLICY "Admins can view all progresso"
      ON wellness_progresso FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can insert own progresso" ON wellness_progresso;
    CREATE POLICY "Users can insert own progresso"
      ON wellness_progresso FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage progresso" ON wellness_progresso;
    CREATE POLICY "Admins can manage progresso"
      ON wellness_progresso FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_anotacoes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_anotacoes') THEN
    DROP POLICY IF EXISTS "Users can view own anotacoes" ON wellness_anotacoes;
    CREATE POLICY "Users can view own anotacoes"
      ON wellness_anotacoes FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all anotacoes" ON wellness_anotacoes;
    CREATE POLICY "Admins can view all anotacoes"
      ON wellness_anotacoes FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own anotacoes" ON wellness_anotacoes;
    CREATE POLICY "Users can manage own anotacoes"
      ON wellness_anotacoes FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all anotacoes" ON wellness_anotacoes;
    CREATE POLICY "Admins can manage all anotacoes"
      ON wellness_anotacoes FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_acoes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_acoes') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_acoes' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active acoes" ON wellness_acoes;
      CREATE POLICY "Wellness users can view active acoes"
        ON wellness_acoes FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view acoes" ON wellness_acoes;
      CREATE POLICY "Wellness users can view acoes"
        ON wellness_acoes FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all acoes" ON wellness_acoes;
    CREATE POLICY "Admins can view all acoes"
      ON wellness_acoes FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage acoes" ON wellness_acoes;
    CREATE POLICY "Admins can manage acoes"
      ON wellness_acoes FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- wellness_passo_a_passo_diario
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_passo_a_passo_diario') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_passo_a_passo_diario' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active passo a passo" ON wellness_passo_a_passo_diario;
      CREATE POLICY "Wellness users can view active passo a passo"
        ON wellness_passo_a_passo_diario FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view passo a passo" ON wellness_passo_a_passo_diario;
      CREATE POLICY "Wellness users can view passo a passo"
        ON wellness_passo_a_passo_diario FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all passo a passo" ON wellness_passo_a_passo_diario;
    CREATE POLICY "Admins can view all passo a passo"
      ON wellness_passo_a_passo_diario FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage passo a passo" ON wellness_passo_a_passo_diario;
    CREATE POLICY "Admins can manage passo a passo"
      ON wellness_passo_a_passo_diario FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- COMENTÁRIOS FINAIS
-- ============================================

COMMENT ON FUNCTION is_wellness_user() IS 'Verifica se o usuário autenticado tem perfil wellness';
COMMENT ON FUNCTION is_admin_user() IS 'Verifica se o usuário autenticado é admin';

-- ============================================
-- FIM DA MIGRATION
-- ============================================
