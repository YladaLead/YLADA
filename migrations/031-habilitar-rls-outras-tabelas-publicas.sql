-- ============================================
-- MIGRATION 031: Habilitar RLS em Outras Tabelas Públicas
-- ============================================
-- Corrige questões de segurança para tabelas não-wellness
-- que também estavam sem RLS conforme relatório do Supabase
-- ============================================

-- ============================================
-- 0. FUNÇÕES HELPER PARA POLÍTICAS RLS
-- ============================================
-- Garantir que as funções helper existam antes de criar políticas
-- (Caso a migration 030 não tenha sido executada ainda)

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
-- 1. HABILITAR RLS EM TABELAS DE CURSOS/TRAILS
-- ============================================

ALTER TABLE IF EXISTS courses_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trails_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trails_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS progress_user_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS curso_materiais_areas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. HABILITAR RLS EM TABELAS DE BIBLIOTECA
-- ============================================

ALTER TABLE IF EXISTS library_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS library_favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. HABILITAR RLS EM TABELAS DE CURSOS/MICROCURSOS
-- ============================================

ALTER TABLE IF EXISTS microcourses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tutorials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. HABILITAR RLS EM TABELAS DE DOCUMENTOS
-- ============================================

ALTER TABLE IF EXISTS client_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. HABILITAR RLS EM TABELAS DE CONTATO
-- ============================================

ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. HABILITAR RLS EM TABELAS DE JORNADA
-- ============================================

ALTER TABLE IF EXISTS journey_checklist_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS journey_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS journey_checklist_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS journey_daily_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. HABILITAR RLS EM TABELAS NOEL
-- ============================================

ALTER TABLE IF EXISTS noel_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_plan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS noel_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. HABILITAR RLS EM TABELAS WELLNESS ADICIONAIS
-- ============================================

ALTER TABLE IF EXISTS wellness_planos_dias ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. POLÍTICAS RLS: curso_materiais_areas
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'curso_materiais_areas') THEN
    -- Verificar se a coluna 'ativo' existe antes de usar
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'curso_materiais_areas' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active curso materiais" ON curso_materiais_areas;
      CREATE POLICY "Authenticated users can view active curso materiais"
        ON curso_materiais_areas FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      -- Se não tem coluna 'ativo', permitir acesso a todos os registros para usuários autenticados
      DROP POLICY IF EXISTS "Authenticated users can view curso materiais" ON curso_materiais_areas;
      CREATE POLICY "Authenticated users can view curso materiais"
        ON curso_materiais_areas FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage curso materiais" ON curso_materiais_areas;
    CREATE POLICY "Admins can manage curso materiais"
      ON curso_materiais_areas FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 7. POLÍTICAS RLS: courses_trails
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses_trails') THEN
    -- Verificar se a coluna 'ativo' existe antes de usar
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses_trails' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active trails" ON courses_trails;
      CREATE POLICY "Authenticated users can view active trails"
        ON courses_trails FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      -- Se não tem coluna 'ativo', permitir acesso a todos os registros para usuários autenticados
      DROP POLICY IF EXISTS "Authenticated users can view trails" ON courses_trails;
      CREATE POLICY "Authenticated users can view trails"
        ON courses_trails FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage trails" ON courses_trails;
    CREATE POLICY "Admins can manage trails"
      ON courses_trails FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 8. POLÍTICAS RLS: trails_modules
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trails_modules') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'trails_modules' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active modules" ON trails_modules;
      CREATE POLICY "Authenticated users can view active modules"
        ON trails_modules FOR SELECT
        USING (
          auth.role() = 'authenticated' AND
          (ativo IS NULL OR ativo = true) AND
          (
            trail_id IS NULL OR
            EXISTS (
              SELECT 1 FROM courses_trails
              WHERE courses_trails.id = trails_modules.trail_id
              AND (
                NOT EXISTS (
                  SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'courses_trails' AND column_name = 'ativo'
                ) OR (courses_trails.ativo IS NULL OR courses_trails.ativo = true)
              )
            )
          )
        );
    ELSE
      DROP POLICY IF EXISTS "Authenticated users can view modules" ON trails_modules;
      CREATE POLICY "Authenticated users can view modules"
        ON trails_modules FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage modules" ON trails_modules;
    CREATE POLICY "Admins can manage modules"
      ON trails_modules FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 9. POLÍTICAS RLS: trails_lessons
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trails_lessons') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'trails_lessons' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active lessons" ON trails_lessons;
      CREATE POLICY "Authenticated users can view active lessons"
        ON trails_lessons FOR SELECT
        USING (
          auth.role() = 'authenticated' AND
          (ativo IS NULL OR ativo = true) AND
          (
            module_id IS NULL OR
            EXISTS (
              SELECT 1 FROM trails_modules
              WHERE trails_modules.id = trails_lessons.module_id
              AND (
                NOT EXISTS (
                  SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'trails_modules' AND column_name = 'ativo'
                ) OR (trails_modules.ativo IS NULL OR trails_modules.ativo = true)
              )
            )
          )
        );
    ELSE
      DROP POLICY IF EXISTS "Authenticated users can view lessons" ON trails_lessons;
      CREATE POLICY "Authenticated users can view lessons"
        ON trails_lessons FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage lessons" ON trails_lessons;
    CREATE POLICY "Admins can manage lessons"
      ON trails_lessons FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 10. POLÍTICAS RLS: progress_user_trails
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'progress_user_trails') THEN
    DROP POLICY IF EXISTS "Users can view own trail progress" ON progress_user_trails;
    CREATE POLICY "Users can view own trail progress"
      ON progress_user_trails FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all trail progress" ON progress_user_trails;
    CREATE POLICY "Admins can view all trail progress"
      ON progress_user_trails FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can insert own trail progress" ON progress_user_trails;
    CREATE POLICY "Users can insert own trail progress"
      ON progress_user_trails FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update own trail progress" ON progress_user_trails;
    CREATE POLICY "Users can update own trail progress"
      ON progress_user_trails FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage trail progress" ON progress_user_trails;
    CREATE POLICY "Admins can manage trail progress"
      ON progress_user_trails FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 11. POLÍTICAS RLS: library_files
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'library_files') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'library_files' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active library files" ON library_files;
      CREATE POLICY "Authenticated users can view active library files"
        ON library_files FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Authenticated users can view library files" ON library_files;
      CREATE POLICY "Authenticated users can view library files"
        ON library_files FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage library files" ON library_files;
    CREATE POLICY "Admins can manage library files"
      ON library_files FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 12. POLÍTICAS RLS: library_favorites
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'library_favorites') THEN
    DROP POLICY IF EXISTS "Users can view own favorites" ON library_favorites;
    CREATE POLICY "Users can view own favorites"
      ON library_favorites FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all favorites" ON library_favorites;
    CREATE POLICY "Admins can view all favorites"
      ON library_favorites FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own favorites" ON library_favorites;
    CREATE POLICY "Users can manage own favorites"
      ON library_favorites FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all favorites" ON library_favorites;
    CREATE POLICY "Admins can manage all favorites"
      ON library_favorites FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 13. POLÍTICAS RLS: microcourses
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'microcourses') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'microcourses' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active microcourses" ON microcourses;
      CREATE POLICY "Authenticated users can view active microcourses"
        ON microcourses FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Authenticated users can view microcourses" ON microcourses;
      CREATE POLICY "Authenticated users can view microcourses"
        ON microcourses FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage microcourses" ON microcourses;
    CREATE POLICY "Admins can manage microcourses"
      ON microcourses FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 14. POLÍTICAS RLS: tutorials
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tutorials') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'tutorials' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Authenticated users can view active tutorials" ON tutorials;
      CREATE POLICY "Authenticated users can view active tutorials"
        ON tutorials FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Authenticated users can view tutorials" ON tutorials;
      CREATE POLICY "Authenticated users can view tutorials"
        ON tutorials FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;

    DROP POLICY IF EXISTS "Admins can manage tutorials" ON tutorials;
    CREATE POLICY "Admins can manage tutorials"
      ON tutorials FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 15. POLÍTICAS RLS: client_documents
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_documents') THEN
    -- Verificar se a tabela tem user_id ou client_id
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'client_documents' AND column_name = 'user_id'
    ) THEN
      DROP POLICY IF EXISTS "Users can view own client documents" ON client_documents;
      CREATE POLICY "Users can view own client documents"
        ON client_documents FOR SELECT
        USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can manage own client documents" ON client_documents;
      CREATE POLICY "Users can manage own client documents"
        ON client_documents FOR ALL
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'client_documents' AND column_name = 'client_id'
    ) THEN
      -- Se tiver client_id, verificar se o usuário é dono do cliente
      DROP POLICY IF EXISTS "Users can view own client documents" ON client_documents;
      CREATE POLICY "Users can view own client documents"
        ON client_documents FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_documents.client_id
            AND clients.user_id = auth.uid()
          )
        );

      DROP POLICY IF EXISTS "Users can manage own client documents" ON client_documents;
      CREATE POLICY "Users can manage own client documents"
        ON client_documents FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_documents.client_id
            AND clients.user_id = auth.uid()
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_documents.client_id
            AND clients.user_id = auth.uid()
          )
        );
    END IF;

    DROP POLICY IF EXISTS "Admins can view all client documents" ON client_documents;
    CREATE POLICY "Admins can view all client documents"
      ON client_documents FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage all client documents" ON client_documents;
    CREATE POLICY "Admins can manage all client documents"
      ON client_documents FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 16. POLÍTICAS RLS: contact_submissions
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions') THEN
    -- SELECT: Apenas admins podem ver submissões
    DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
    CREATE POLICY "Admins can view contact submissions"
      ON contact_submissions FOR SELECT
      USING (is_admin_user());

    -- INSERT: Qualquer pessoa autenticada pode criar submissão
    DROP POLICY IF EXISTS "Authenticated users can create contact submissions" ON contact_submissions;
    CREATE POLICY "Authenticated users can create contact submissions"
      ON contact_submissions FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');

    -- INSERT: Público também pode criar (formulário de contato)
    DROP POLICY IF EXISTS "Public can create contact submissions" ON contact_submissions;
    CREATE POLICY "Public can create contact submissions"
      ON contact_submissions FOR INSERT
      WITH CHECK (true);

    -- UPDATE/DELETE: Apenas admins
    DROP POLICY IF EXISTS "Admins can manage contact submissions" ON contact_submissions;
    CREATE POLICY "Admins can manage contact submissions"
      ON contact_submissions FOR UPDATE
      USING (is_admin_user())
      WITH CHECK (is_admin_user());

    DROP POLICY IF EXISTS "Admins can delete contact submissions" ON contact_submissions;
    CREATE POLICY "Admins can delete contact submissions"
      ON contact_submissions FOR DELETE
      USING (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 17. POLÍTICAS RLS: journey_checklist_notes
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journey_checklist_notes') THEN
    DROP POLICY IF EXISTS "Users can view own journey checklist notes" ON journey_checklist_notes;
    CREATE POLICY "Users can view own journey checklist notes"
      ON journey_checklist_notes FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all journey checklist notes" ON journey_checklist_notes;
    CREATE POLICY "Admins can view all journey checklist notes"
      ON journey_checklist_notes FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own journey checklist notes" ON journey_checklist_notes;
    CREATE POLICY "Users can manage own journey checklist notes"
      ON journey_checklist_notes FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all journey checklist notes" ON journey_checklist_notes;
    CREATE POLICY "Admins can manage all journey checklist notes"
      ON journey_checklist_notes FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 18. POLÍTICAS RLS: journey_progress
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journey_progress') THEN
    DROP POLICY IF EXISTS "Users can view own journey progress" ON journey_progress;
    CREATE POLICY "Users can view own journey progress"
      ON journey_progress FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all journey progress" ON journey_progress;
    CREATE POLICY "Admins can view all journey progress"
      ON journey_progress FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own journey progress" ON journey_progress;
    CREATE POLICY "Users can manage own journey progress"
      ON journey_progress FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all journey progress" ON journey_progress;
    CREATE POLICY "Admins can manage all journey progress"
      ON journey_progress FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 19. POLÍTICAS RLS: journey_days
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journey_days') THEN
    DROP POLICY IF EXISTS "Authenticated users can view journey days" ON journey_days;
    CREATE POLICY "Authenticated users can view journey days"
      ON journey_days FOR SELECT
      USING (auth.role() = 'authenticated');

    DROP POLICY IF EXISTS "Admins can manage journey days" ON journey_days;
    CREATE POLICY "Admins can manage journey days"
      ON journey_days FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 20. POLÍTICAS RLS: journey_checklist_log
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journey_checklist_log') THEN
    DROP POLICY IF EXISTS "Users can view own journey checklist log" ON journey_checklist_log;
    CREATE POLICY "Users can view own journey checklist log"
      ON journey_checklist_log FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all journey checklist log" ON journey_checklist_log;
    CREATE POLICY "Admins can view all journey checklist log"
      ON journey_checklist_log FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own journey checklist log" ON journey_checklist_log;
    CREATE POLICY "Users can manage own journey checklist log"
      ON journey_checklist_log FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all journey checklist log" ON journey_checklist_log;
    CREATE POLICY "Admins can manage all journey checklist log"
      ON journey_checklist_log FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 21. POLÍTICAS RLS: journey_daily_notes
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journey_daily_notes') THEN
    DROP POLICY IF EXISTS "Users can view own journey daily notes" ON journey_daily_notes;
    CREATE POLICY "Users can view own journey daily notes"
      ON journey_daily_notes FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all journey daily notes" ON journey_daily_notes;
    CREATE POLICY "Admins can view all journey daily notes"
      ON journey_daily_notes FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own journey daily notes" ON journey_daily_notes;
    CREATE POLICY "Users can manage own journey daily notes"
      ON journey_daily_notes FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all journey daily notes" ON journey_daily_notes;
    CREATE POLICY "Admins can manage all journey daily notes"
      ON journey_daily_notes FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 22. POLÍTICAS RLS: wellness_planos_dias
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wellness_planos_dias') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_planos_dias' AND column_name = 'ativo'
    ) THEN
      DROP POLICY IF EXISTS "Wellness users can view active planos dias" ON wellness_planos_dias;
      CREATE POLICY "Wellness users can view active planos dias"
        ON wellness_planos_dias FOR SELECT
        USING (is_wellness_user() AND (ativo IS NULL OR ativo = true));
    ELSE
      DROP POLICY IF EXISTS "Wellness users can view planos dias" ON wellness_planos_dias;
      CREATE POLICY "Wellness users can view planos dias"
        ON wellness_planos_dias FOR SELECT
        USING (is_wellness_user());
    END IF;

    DROP POLICY IF EXISTS "Admins can view all planos dias" ON wellness_planos_dias;
    CREATE POLICY "Admins can view all planos dias"
      ON wellness_planos_dias FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Admins can manage planos dias" ON wellness_planos_dias;
    CREATE POLICY "Admins can manage planos dias"
      ON wellness_planos_dias FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 23. POLÍTICAS RLS: noel_leads
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_leads') THEN
    DROP POLICY IF EXISTS "Users can view own noel leads" ON noel_leads;
    CREATE POLICY "Users can view own noel leads"
      ON noel_leads FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel leads" ON noel_leads;
    CREATE POLICY "Admins can view all noel leads"
      ON noel_leads FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel leads" ON noel_leads;
    CREATE POLICY "Users can manage own noel leads"
      ON noel_leads FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel leads" ON noel_leads;
    CREATE POLICY "Admins can manage all noel leads"
      ON noel_leads FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 24. POLÍTICAS RLS: noel_clients
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_clients') THEN
    DROP POLICY IF EXISTS "Users can view own noel clients" ON noel_clients;
    CREATE POLICY "Users can view own noel clients"
      ON noel_clients FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel clients" ON noel_clients;
    CREATE POLICY "Admins can view all noel clients"
      ON noel_clients FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel clients" ON noel_clients;
    CREATE POLICY "Users can manage own noel clients"
      ON noel_clients FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel clients" ON noel_clients;
    CREATE POLICY "Admins can manage all noel clients"
      ON noel_clients FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 25. POLÍTICAS RLS: noel_users_profile
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_users_profile') THEN
    DROP POLICY IF EXISTS "Users can view own noel profile" ON noel_users_profile;
    CREATE POLICY "Users can view own noel profile"
      ON noel_users_profile FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel profiles" ON noel_users_profile;
    CREATE POLICY "Admins can view all noel profiles"
      ON noel_users_profile FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel profile" ON noel_users_profile;
    CREATE POLICY "Users can manage own noel profile"
      ON noel_users_profile FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel profiles" ON noel_users_profile;
    CREATE POLICY "Admins can manage all noel profiles"
      ON noel_users_profile FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 26. POLÍTICAS RLS: noel_plan_progress
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_plan_progress') THEN
    DROP POLICY IF EXISTS "Users can view own noel plan progress" ON noel_plan_progress;
    CREATE POLICY "Users can view own noel plan progress"
      ON noel_plan_progress FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel plan progress" ON noel_plan_progress;
    CREATE POLICY "Admins can view all noel plan progress"
      ON noel_plan_progress FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel plan progress" ON noel_plan_progress;
    CREATE POLICY "Users can manage own noel plan progress"
      ON noel_plan_progress FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel plan progress" ON noel_plan_progress;
    CREATE POLICY "Admins can manage all noel plan progress"
      ON noel_plan_progress FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 27. POLÍTICAS RLS: noel_security_logs
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_security_logs') THEN
    -- Apenas admins podem ver logs de segurança
    DROP POLICY IF EXISTS "Admins can view security logs" ON noel_security_logs;
    CREATE POLICY "Admins can view security logs"
      ON noel_security_logs FOR SELECT
      USING (is_admin_user());

    -- Apenas sistema pode inserir logs (via service role)
    DROP POLICY IF EXISTS "Service role can insert security logs" ON noel_security_logs;
    CREATE POLICY "Service role can insert security logs"
      ON noel_security_logs FOR INSERT
      WITH CHECK (auth.role() = 'service_role');

    -- Apenas admins podem gerenciar logs
    DROP POLICY IF EXISTS "Admins can manage security logs" ON noel_security_logs;
    CREATE POLICY "Admins can manage security logs"
      ON noel_security_logs FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 28. POLÍTICAS RLS: noel_interactions
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_interactions') THEN
    DROP POLICY IF EXISTS "Users can view own noel interactions" ON noel_interactions;
    CREATE POLICY "Users can view own noel interactions"
      ON noel_interactions FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel interactions" ON noel_interactions;
    CREATE POLICY "Admins can view all noel interactions"
      ON noel_interactions FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel interactions" ON noel_interactions;
    CREATE POLICY "Users can manage own noel interactions"
      ON noel_interactions FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel interactions" ON noel_interactions;
    CREATE POLICY "Admins can manage all noel interactions"
      ON noel_interactions FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 29. POLÍTICAS RLS: noel_user_settings
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_user_settings') THEN
    DROP POLICY IF EXISTS "Users can view own noel settings" ON noel_user_settings;
    CREATE POLICY "Users can view own noel settings"
      ON noel_user_settings FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all noel settings" ON noel_user_settings;
    CREATE POLICY "Admins can view all noel settings"
      ON noel_user_settings FOR SELECT
      USING (is_admin_user());

    DROP POLICY IF EXISTS "Users can manage own noel settings" ON noel_user_settings;
    CREATE POLICY "Users can manage own noel settings"
      ON noel_user_settings FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can manage all noel settings" ON noel_user_settings;
    CREATE POLICY "Admins can manage all noel settings"
      ON noel_user_settings FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 30. POLÍTICAS RLS: noel_rate_limits
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'noel_rate_limits') THEN
    -- Apenas admins podem ver rate limits
    DROP POLICY IF EXISTS "Admins can view rate limits" ON noel_rate_limits;
    CREATE POLICY "Admins can view rate limits"
      ON noel_rate_limits FOR SELECT
      USING (is_admin_user());

    -- Sistema pode inserir/atualizar rate limits
    DROP POLICY IF EXISTS "Service role can manage rate limits" ON noel_rate_limits;
    CREATE POLICY "Service role can manage rate limits"
      ON noel_rate_limits FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');

    -- Admins também podem gerenciar
    DROP POLICY IF EXISTS "Admins can manage rate limits" ON noel_rate_limits;
    CREATE POLICY "Admins can manage rate limits"
      ON noel_rate_limits FOR ALL
      USING (is_admin_user())
      WITH CHECK (is_admin_user());
  END IF;
END $$;

-- ============================================
-- 31. POLÍTICAS RLS: Tabelas de Backup (se existirem)
-- ============================================

-- Essas tabelas geralmente são apenas para backup e não devem ser acessíveis via PostgREST
-- Mas vamos habilitar RLS e restringir acesso apenas a admins

DO $$
DECLARE
  table_name_var TEXT;
BEGIN
  FOR table_name_var IN
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE '%backup%'
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', table_name_var);
    
    EXECUTE format('
      DROP POLICY IF EXISTS "Admins can view %s" ON %I;
      CREATE POLICY "Admins can view %s"
        ON %I FOR SELECT
        USING (is_admin_user());
    ', table_name_var, table_name_var, table_name_var, table_name_var);
    
    EXECUTE format('
      DROP POLICY IF EXISTS "Admins can manage %s" ON %I;
      CREATE POLICY "Admins can manage %s"
        ON %I FOR ALL
        USING (is_admin_user())
        WITH CHECK (is_admin_user());
    ', table_name_var, table_name_var, table_name_var, table_name_var);
  END LOOP;
END $$;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
